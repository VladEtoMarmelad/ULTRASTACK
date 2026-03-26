"use client";

import { useState } from "react";
import axios, { AxiosRequestConfig } from "axios";

export const ApiData = ({ 
  endpoint, 
  config = {} // Default to an empty object if no config is provided
}: { 
  endpoint: string; 
  config?: AxiosRequestConfig; 
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      // axios automatically handles the response parsing to JSON
      // Spread the config object to apply method, headers, data, etc.
      const res = await axios({
        url: endpoint,
        ...config
      });
      // The actual data is located in the 'data' property of the response object
      setData(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 my-4">
      <button 
        onClick={fetchData}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
        disabled={loading}
      >
        {/* Dynamically display the HTTP method or default to GET */}
        {loading ? "Loading..." : `Fetch ${config.method?.toUpperCase() || "GET"} from API`}
      </button>
      
      {data && (
        <pre className="mt-4 p-2 bg-black text-green-400 text-xs overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}