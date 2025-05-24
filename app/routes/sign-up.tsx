import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSignUpMutation } from "~/features/auth/authService";

export default function SignUp() {
  const [signUp, { isLoading, error }] = useSignUpMutation();

  interface ServerError {
    errors: Record<string, string[]>;
  }

  const serverError =
    error && "data" in error ? (error.data as ServerError) : undefined;

  const navigate = useNavigate();

  interface SignUpFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    checkbox: boolean;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
    watch,
  } = useForm<SignUpFormData>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      checkbox: false,
    },
  });
  const submitForm = (data: SignUpFormData) => {
    data.email = data.email.toLowerCase();
    try {
      signUp({
        user: {
          username: data.username,
          email: data.email,
          password: data.password,
        },
      }).unwrap();
      if (!error) {
        navigate("/sign-in");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <div className="flex justify-center py-[59px] ">
        <div className="bg-white py-[48px] px-[32px] w-sm border border-gray-300 rounded-sm shadow-xl">
          <h1 className="text-center text-xl font-medium">
            Create new account
          </h1>
          <form
            className="flex flex-col gap-[12px] mt-[21px]"
            onSubmit={handleSubmit(submitForm)}
          >
            <div className="wrapper flex flex-col gap-[2px]">
              <label htmlFor="" className="text-sm">
                Username
              </label>
              <input
                type="text"
                placeholder="Username"
                className={`text-base px-[16px] py-[8px] border ${
                  errors?.username || serverError?.errors?.username
                    ? `border-red-600`
                    : `border-gray-300`
                } rounded-xs`}
                {...register("username", {
                  required: { value: true, message: "Please enter username" },
                  minLength: {
                    value: 3,
                    message: "Your username needs to be at least 3 characters",
                  },
                  maxLength: {
                    value: 20,
                    message:
                      "Your username needs to be at less than 20 characters",
                  },
                })}
                onBlur={(e) => {
                  setValue("username", e.target.value);
                  trigger("username");
                }}
              />
              {errors?.username?.message || serverError?.errors?.username ? (
                <p className="text-sm text-red-600">
                  {errors?.username?.message ||
                    `Username ${serverError?.errors?.username}`}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="wrapper flex flex-col gap-[2px]">
              <label htmlFor="" className="text-sm">
                Email address
              </label>
              <input
                type="email"
                placeholder="Email address"
                className={`text-base px-[16px] py-[8px] border ${
                  errors?.email || serverError?.errors?.email
                    ? `border-red-600`
                    : `border-gray-300`
                }  rounded-xs`}
                {...register("email", {
                  required: { value: true, message: "Invalid email address" },
                })}
                onBlur={(e) => {
                  setValue("email", e.target.value);
                  trigger("email");
                }}
              />
              {errors?.email?.message || serverError?.errors?.email ? (
                <p className="text-sm text-red-600">
                  {errors?.email?.message ||
                    `Email ${serverError?.errors?.email}`}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="wrapper flex flex-col gap-[2px]">
              <label htmlFor="" className="text-sm mt-[10px]">
                Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="text-base px-[16px] py-[8px] border border-gray-300 rounded-xs"
                {...register("password", {
                  required: { value: true, message: "Please enter password" },
                  minLength: {
                    value: 6,
                    message: "Password needs to be at least 6 characters",
                  },
                  maxLength: {
                    value: 40,
                    message: "Password needs to be less than 40 characters",
                  },
                })}
                onBlur={(e) => {
                  setValue("password", e.target.value);
                  trigger("password");
                }}
              />
              {errors?.password?.message ? (
                <p className="text-sm text-red-600">
                  {errors.password.message}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="wrapper flex flex-col gap-[2px]">
              <label htmlFor="" className="text-sm mt-[10px]">
                Repeat Password
              </label>
              <input
                type="password"
                placeholder="Password"
                className="text-base px-[16px] py-[8px] border border-gray-300 rounded-xs"
                {...register("confirmPassword", {
                  required: true,
                  validate: (val: string) => {
                    if (watch("password") != val) {
                      return "Passwords must match";
                    }
                  },
                })}
                onChange={(e) => {
                  setValue("confirmPassword", e.target.value);
                  trigger("confirmPassword");
                }}
              />
              {errors?.confirmPassword?.message ? (
                <p className="text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              ) : (
                ""
              )}
            </div>
            <div className="wrapper border-t border-gray-300 mt-[21px] py-[8px] text-sm">
              {" "}
              <input
                type="checkbox"
                {...register("checkbox", {
                  required: "Please check the box",
                })}
                id="terms"
              />
              <label className="text-gray-600 ms-[8px] ">
                I agree to the processing of my personal information
              </label>
              {errors?.checkbox?.message ? (
                <p className="text-sm text-red-600">
                  {errors.checkbox.message}
                </p>
              ) : (
                ""
              )}
            </div>

            <button
              type="submit"
              className="flex flex-row justify-center items-center bg-[#1890FF] text-white p-[8px] text-base rounded-xs mt-[12px] gap-1"
              disabled={isLoading}
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
                  <span>Create</span>
                </>
              )}
            </button>
          </form>
          <span className="block text-center text-gray-400 text-sm mt-[8px]">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-[#1890FF]">
              Sign In
            </Link>
            .
          </span>
        </div>
      </div>
    </>
  );
}
