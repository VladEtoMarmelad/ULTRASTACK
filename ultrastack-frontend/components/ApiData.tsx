"use client";

import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";
import { ApiField } from "../types/ApiField";

export const ApiData = ({ 
  endpoint, 
  config = {},
  fields = [] // New prop to handle dynamic user inputs
}: { 
  endpoint: string; 
  config?: AxiosRequestConfig; 
  fields?: ApiField[];
}) => {
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  // State to store values from input fields
  const [values, setValues] = useState<Record<string, string>>({});

  const handleInputChange = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let finalEndpoint = endpoint;
      let finalData = { ...config.data };

      // Process fields to either replace URL placeholders or populate the body
      fields.forEach((field) => {
        const val = values[field.key];
        if (val) {
          if (field.location === "url") {
            // Replaces placeholders like :id with the actual input value
            finalEndpoint = finalEndpoint.replace(`:${field.key}`, val);
          } else {
            // Appends or overrides data in the request body
            finalData[field.key] = val;
          }
        }
      });

      const res = await axios({
        ...config,
        url: finalEndpoint,
        data: finalData
      });
      setData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setData({ error: "Failed to fetch data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 my-4">
      {/* Render input fields based on configuration */}
      {fields.length > 0 && (
        <div className="grid grid-cols-1 gap-3 mb-4">
          {fields.map((field) => (
            <div key={field.key} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                {field.label}
              </label>
              <input
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={values[field.key] || ""}
                onChange={(e) => handleInputChange(field.key, e.target.value)}
                className="px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-sm"
              />
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={fetchData}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        disabled={loading}
      >
        {loading ? "Loading..." : `Fetch ${config.method?.toUpperCase() || "GET"} from API`}
      </button>
      
      {data && (
        <pre className="mt-4 p-2 bg-black text-green-400 text-xs overflow-auto rounded border border-zinc-700">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}