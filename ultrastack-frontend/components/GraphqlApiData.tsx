"use client";

import { useState } from "react";
import { 
  DocumentNode, 
  gql, 
  WatchQueryFetchPolicy, 
  MutationUpdaterFunction,
  InternalRefetchQueriesInclude,
  InMemoryCache,
  OperationVariables
} from "@apollo/client";
import { useLazyQuery, useMutation } from "@apollo/client/react";
import { ApiField } from "../types/ApiField";

// Empty placeholders to prevent Apollo hooks from crashing when a prop is not provided.
const NOOP_QUERY = gql`query NoOp { __typename }`;
const NOOP_MUTATION = gql`mutation NoOp { __typename }`;

export const GraphqlApiData = ({ 
  query, 
  mutation,
  fields = [],
  operationName = "Execute",
  /**
   * Optional array of queries to refetch after a successful mutation.
   * This ensures the UI stays in sync with server-side changes.
   */
  refetchQueries = [],
  /**
   * Defines how the query interacts with the Apollo cache.
   * "network-only" helps prevent seeing stale/deleted data.
   */
  fetchPolicy,
  /**
   * Manual cache update function, useful for evicting deleted items.
   */
  update
}: { 
  query?: DocumentNode; 
  mutation?: DocumentNode;
  fields?: ApiField[];
  operationName?: string;
  refetchQueries?: InternalRefetchQueriesInclude; // Type-safe list of queries to re-execute
  fetchPolicy?: WatchQueryFetchPolicy;
  update?: MutationUpdaterFunction<Record<string, unknown>, Record<string, unknown>, InMemoryCache>; // Type-safe cache update function
}) => {
  // Store form input values with specific primitive types allowed by GraphQL variables
  const [values, setValues] = useState<Record<string, string | number>>({});
  
  /**
   * Hooks must be called unconditionally. 
   * We provide a fallback NOOP document if the specific operation is not requested.
  */
  const [execQuery, queryStatus] = useLazyQuery(query || NOOP_QUERY, {
    fetchPolicy: fetchPolicy
  });
  const [execMutation, mutationStatus] = useMutation(mutation || NOOP_MUTATION, {
    update: update as MutationUpdaterFunction<unknown, OperationVariables, InMemoryCache> | undefined
  });

  const loading = queryStatus.loading || mutationStatus.loading;
  const error = queryStatus.error || mutationStatus.error;
  
  // Only display data from the active operation
  const data = (query ? queryStatus.data : mutationStatus.data) as Record<string, unknown> | undefined;

  const handleInputChange = (key: string, value: string, type?: string) => {
    const formattedValue = type === "number" ? parseFloat(value) : value;
    setValues((prev) => ({ ...prev, [key]: formattedValue }));
  };

  const handleExecute = () => {
    /**
     * Including refetchQueries in mutation options triggers an automatic 
     * re-fetch of the specified queries once the mutation succeeds.
     */
    const options = { 
      variables: { ...values },
      refetchQueries: refetchQueries 
    };

    if (mutation) {
      execMutation(options);
    } else if (query) {
      execQuery(options);
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900 my-4">
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
                onChange={(e) => handleInputChange(field.key, e.target.value, field.type)}
                className="px-3 py-2 border rounded bg-white dark:bg-zinc-800 text-sm"
              />
            </div>
          ))}
        </div>
      )}

      <button 
        onClick={handleExecute}
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
        disabled={loading}
      >
        {loading ? "Processing..." : operationName}
      </button>
      
      {error && (
        <div className="mt-4 p-2 text-red-500 text-xs bg-red-50 rounded border border-red-200">
          {error.message}
        </div>
      )}

      {data && (
        <pre className="mt-4 p-2 bg-black text-green-400 text-xs overflow-auto rounded border border-zinc-700">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};