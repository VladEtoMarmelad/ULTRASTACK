import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// createAsyncThunk handles the lifecycle of an external API request
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/users");
  return await response.json();
});

interface UsersState {
  entities: any[];
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