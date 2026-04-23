import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Shape of the user data returned by the external API
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

// createAsyncThunk handles the lifecycle of an external API request
export const fetchUsers = createAsyncThunk<User[]>("users/fetchUsers", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  // Casting the JSON result to the User array type for state consistency
  return (await response.json()) as User[];
});

interface UsersState {
  entities: User[];
  loading: "idle" | "pending" | "succeeded" | "failed";
}

const initialState: UsersState = {
  entities: [],
  loading: "idle",
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = "pending";
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = action.payload;
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = "failed";
      });
  },
});

export default usersSlice.reducer;