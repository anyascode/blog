import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const URL = "https://blog-platform.kata.academy/api";

export const registerUser = createAsyncThunk<
  { user: User },
  UserSignUp,
  { rejectValue: string }
>("auth/register", async (data: UserSignUp, { rejectWithValue }) => {
  const response = await fetch(URL + "/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    return rejectWithValue(errorMessage);
  }

  return response.json();
});

export const userLogin = createAsyncThunk<
  { user: User },
  UserLogin,
  { rejectValue: string }
>("auth/login", async (data: UserLogin, { rejectWithValue }) => {
  const response = await fetch(URL + "/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorMessage = await response.text();
    return rejectWithValue(errorMessage);
  }

  return response.json();
});

const userToken =
  typeof window !== "undefined" ? localStorage.getItem("userToken") : null;

const userInfo =
  typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("userInfo") || "null")
    : null;

const initialState: AuthState = {
  loading: false,
  userInfo: userInfo,
  userToken: userToken,
  error: null,
  success: false,
};

interface User {
  username: string;
  email: string;
  token?: string;
  bio?: string;
  image?: string;
}

interface UserSignUp {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

interface UserLogin {
  user: {
    email: string;
    password: string;
  };
}

interface AuthState {
  loading: boolean;
  userInfo: User | null;
  userToken: string | null;
  error: string | null;
  success: boolean;
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem("userToken");
      localStorage.removeItem("userInfo");
      state.loading = false;
      state.userInfo = null;
      state.userToken = null;
      state.error = null;
      state.success = false;
    },

    setCredentials: (state, { payload }) => {
      state.userInfo = payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Something went wrong";
        state.success = false;
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.userInfo = payload.user;
        state.userToken = payload.user.token ?? null;
        state.success = true;

        if (state.userToken) {
          localStorage.setItem("userToken", payload.user.token as string);
          localStorage.setItem("userInfo", JSON.stringify(payload.user));
        }
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Login failed";
        state.success = false;
      });
  },
});

export const { logout, setCredentials } = authSlice.actions;
export default authSlice.reducer;
