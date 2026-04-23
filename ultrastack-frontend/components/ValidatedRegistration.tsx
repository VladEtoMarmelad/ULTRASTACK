"use client";

import { useState } from "react";
import { z } from "zod";
import axios from "axios";

// Define the validation schema for the registration form
const registrationSchema = z.object({
  email: z.string().email("Invalid email address"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

// Infer the TypeScript type from the Zod schema
type RegistrationValues = z.infer<typeof registrationSchema>;

// Specialized component that mimics ApiData but includes validation
export const ValidatedRegistration = () => {
  const [values, setValues] = useState<RegistrationValues>({ email: "", name: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Stores the API response or error object for display
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (key: keyof RegistrationValues, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    // Clear error when user starts typing again
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleRegister = async () => {
    // Validate the values against the Zod schema
    const result = registrationSchema.safeParse(values);

    if (!result.success) {
      // Map Zod errors to a simple key-value object for the UI
      const formattedErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        formattedErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(formattedErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      const res = await axios.post<Record<string, unknown>>("http://localhost:3030/auth/register", values);
      setData(res.data);
    } catch (err: unknown) {
      console.error("Fetch error:", err);
      
      let errorMessage = "Failed to register";
      
      // Safely extract the message from Axios error response
      if (axios.isAxiosError(err)) {
        const errorData = err.response?.data as Record<string, unknown> | undefined;
        if (typeof errorData?.message === 'string') {
          errorMessage = errorData.message;
        }
      }

      setData({ error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 my-4">
      <div className="grid grid-cols-1 gap-3 mb-4">
        {/* Email Field */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Email Address</label>
          <input
            type="text"
            placeholder="user@example.com"
            value={values.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={`px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-sm ${errors.email ? 'border-red-500' : ''}`}
          />
          {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
        </div>

        {/* Name Field */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={values.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className={`px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-sm ${errors.name ? 'border-red-500' : ''}`}
          />
          {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
        </div>

        {/* Password Field */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Password</label>
          <input
            type="password"
            placeholder="Enter secure password..."
            value={values.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            className={`px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-sm ${errors.password ? 'border-red-500' : ''}`}
          />
          {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
        </div>
      </div>

      <button 
        onClick={handleRegister}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        {loading ? "Loading..." : "Fetch POST from API"}
      </button>
      
      {data && (
        <pre className="mt-4 p-2 bg-black text-green-400 text-xs overflow-auto rounded border border-zinc-700">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};