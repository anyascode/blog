import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { userLogin } from "../features/auth/authSlice";
import type { AppDispatch } from "~/store";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

export default function SignIn() {
  const { loading, error } = useSelector(
    (state: { auth: { loading: boolean; error: any; success: boolean } }) =>
      state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  const navigate = useNavigate();
  const serverSideErr = JSON.parse(error);

  const { register, handleSubmit } = useForm<SignInData>();

  interface SignInData {
    email: string;
    password: string;
  }

  const submitForm = async (data: SignInData) => {
    try {
      await dispatch(
        userLogin({
          user: {
            email: data.email,
            password: data.password,
          },
        })
      ).unwrap(); // Waits for the thunk to resolve or reject

      navigate("/articles"); // Only runs if login is successful
    } catch (err: any) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="flex justify-center py-[59px] ">
        <div className="bg-white py-[48px] px-[32px] w-sm border border-gray-300 rounded-sm shadow-xl">
          <h1 className="text-center text-xl font-medium">Sign in</h1>
          <form
            action="submit"
            className="flex flex-col gap-[12px] mt-[21px]"
            onSubmit={handleSubmit(submitForm)}
          >
            <div className="wrapper flex flex-col gap-[2px]">
              <label htmlFor="email-form" className="text-sm">
                Email address
              </label>
              <input
                id="email-form"
                type="email"
                placeholder="Email address"
                className={`text-base px-[16px] py-[8px] border ${
                  serverSideErr ? `border-red-600` : `border-gray-300`
                } rounded-xs`}
                {...register("email", {
                  required: { value: true, message: "Invalid email address" },
                })}
              />
            </div>
            <div className="wrapper flex flex-col gap-[2px]">
              <label htmlFor="password-form" className="text-sm mt-[10px]">
                Password
              </label>
              <input
                id="password-form"
                type="password"
                placeholder="Password"
                className={`text-base px-[16px] py-[8px] border ${
                  serverSideErr ? `border-red-600` : `border-gray-300`
                } rounded-xs`}
                {...register("password", {
                  required: { value: true, message: "Please enter password" },
                })}
              />
            </div>
            {serverSideErr?.errors ? (
              <p className="capitalize text-red-600 text-sm">
                {Object.entries(serverSideErr.errors)
                  .join(",")
                  .split(",")
                  .join(" ")}
              </p>
            ) : (
              ""
            )}
            <button
              type="submit"
              className="flex flex-row justify-center items-center gap-1 bg-[#1890FF] text-white p-[8px] text-base rounded-xs mt-[12px]"
            >
              {" "}
              {loading ? (
                <>
                  {" "}
                  <ArrowPathIcon className="animate-spin size-[14px] " />{" "}
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <span>Login</span>
                </>
              )}
            </button>
          </form>
          <span className="block text-center text-gray-400 text-sm mt-[8px]">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-[#1890FF]">
              Sign Up
            </Link>
            .
          </span>
        </div>
      </div>
    </>
  );
}
