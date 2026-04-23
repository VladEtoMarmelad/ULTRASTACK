"use client";

import { TechUI } from "../TechUI";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { increment, decrement, incrementByAmount } from "@/store/slices/counterSlice";
import { fetchUsers } from "@/store/slices/usersSlice";
import { store } from "@/store/store";
import { Provider } from "react-redux";

export const ReduxTechProvider = () => {
  return (
    <Provider store={store}>
      <ReduxTech />
    </Provider>
  );
};

export const ReduxTech = () => {
  const dispatch = useAppDispatch();
  
  // Accessing state from different slices
  const count = useAppSelector((state) => state.counter.value);
  const { entities: users, loading } = useAppSelector((state) => state.users);

  return (
    <>
      <TechUI.H1>Redux Toolkit Integration</TechUI.H1>
      <TechUI.P>
        Redux Toolkit is the official, opinionated, batteries-included toolset for efficient Redux development.
      </TechUI.P>

      <TechUI.H3>Global State Management (Counter Example)</TechUI.H3>
      <TechUI.P>Current Count: <strong>{count}</strong></TechUI.P>
      <div className="flex gap-2 my-4">
        <button 
          onClick={() => dispatch(increment())}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Increment
        </button>
        <button 
          onClick={() => dispatch(decrement())}
          className="px-4 py-2 bg-zinc-700 text-white rounded"
        >
          Decrement
        </button>
        <button 
          onClick={() => dispatch(incrementByAmount(5))}
          className="px-4 py-2 bg-zinc-500 text-white rounded"
        >
          +5
        </button>
      </div>

      <TechUI.H3>Asynchronous Logic with createAsyncThunk</TechUI.H3>
      <TechUI.P>
        Fetch external data and store it in the global Redux state to avoid prop drilling.
      </TechUI.P>
      
      <button 
        onClick={() => dispatch(fetchUsers())}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
        disabled={loading === "pending"}
      >
        {loading === "pending" ? "Loading..." : "Fetch Users via Redux"}
      </button>

      {users.length > 0 && (
        <div className="mt-4 p-4 border border-zinc-200 dark:border-zinc-800 rounded">
          <TechUI.P>Users found in store: {users.length}</TechUI.P>
          <ul className="list-disc ml-6 text-zinc-600 dark:text-zinc-400">
            {/* Type is automatically inferred from the typed Redux state */}
            {users.slice(0, 3).map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      )}

      <TechUI.H3>Standard API Interaction (Consistency Check)</TechUI.H3>
      <TechUI.P>
        Even when using Redux, you can still use the <code>ApiData</code> component for direct database interactions.
      </TechUI.P>
      {/* Reusing the existing ApiData component for architectural consistency */}
      <TechUI.ApiData 
        endpoint="http://localhost:3030/redux-logs" 
        fields={[
          { key: "action", label: "Log Action", placeholder: "e.g. USER_LOGIN", location: "body" }
        ]}
      />
    </>
  );
};