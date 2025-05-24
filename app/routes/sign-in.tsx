import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useLoginMutation } from "~/features/auth/authService";

export default function SignIn() {
  const [login, { isLoading, error }] = useLoginMutation();
  const navigate = useNavigate();

  interface ServerError {
    errors: Record<string, string[]>;
  }

  const serverError =
    error && "data" in error ? (error.data as ServerError) : undefined;

  const { register, handleSubmit } = useForm<SignInData>();

  interface SignInData {
    email: string;
    password: string;
  }

  const submitForm = async (data: SignInData) => {
    try {
      const credentials = {
        user: {
          email: data.email,
          password: data.password,
        },
      };

      await login(credentials).unwrap();
      navigate("/articles");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <>
      <div className="flex justify-center py-[59px] ">
        <div className="bg-white py-[48px] px-[32px] w-sm border border-gray-300 rounded-sm shadow-xl">
          <h1 className="text-center text-xl font-medium">Sign in</h1>
          <form
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
                  error ? `border-red-600` : `border-gray-300`
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
                  error ? `border-red-600` : `border-gray-300`
                } rounded-xs`}
                {...register("password", {
                  required: { value: true, message: "Please enter password" },
                })}
              />
            </div>
            {serverError ? (
              <p className="capitalize text-red-600 text-sm">
                {Object.entries(serverError.errors)
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
              {isLoading ? (
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
