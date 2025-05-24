import { createSlice } from "@reduxjs/toolkit";

const userToken =
  typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

const userInfo =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("userInfo") || "null")
    : null;

const initialState = {
  userInfo: userInfo,
  userToken: userToken,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.userToken = action.payload.token;
    },
    logout: (state) => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      state.userInfo = null;
      state.userToken = null;
    },
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
