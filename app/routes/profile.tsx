import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateUserMutation } from "~/features/auth/authService";
import { setCredentials } from "~/features/auth/authSlice";
import { useNavigate } from "react-router";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import type { RootState } from "~/store";

export default function Profile() {
  interface EditProfile {
    username?: string;
    email?: string;
    password?: string;
    image?: string;
  }

  const userInfo = useSelector((state: RootState) => state.auth.userInfo);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<EditProfile>({
    defaultValues: {
      username: userInfo?.username || "",
      email: userInfo?.email || "",
      password: "",
      image: userInfo?.image || "",
    },
  });

  const [updateUser, { isLoading, error }] = useUpdateUserMutation();

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const submitForm = async (data: EditProfile) => {
    if (!data.image) {
      delete data.image;
    }
    const result = await updateUser({ user: data }).unwrap();
    const normalizedUser = {
      ...result.user,
      image: result.user.image === null ? undefined : result.user.image,
    };
    dispatch(setCredentials(normalizedUser));
    localStorage.setItem("userInfo", JSON.stringify(normalizedUser));
    if (normalizedUser.token) {
      localStorage.setItem("userToken", normalizedUser.token);
    }
    navigate("/articles");
  };

  return (
    <>
      <div className="flex justify-center py-[59px] ">
        <div className="bg-white py-[48px] px-[32px] w-sm border border-gray-300 rounded-sm shadow-xl">
          <h1 className="text-center text-xl font-medium">Edit Profile </h1>
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
                className="text-base px-[16px] py-[8px] border border-gray-300 rounded-xs"
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
              {errors?.username?.message ? (
                <p className="text-sm text-red-600">
                  {errors.username.message}
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
                className="text-base px-[16px] py-[8px] border border-gray-300 rounded-xs"
                {...register("email", {
                  required: {
                    value: true,
                    message: "Invalid email",
                  },
                })}
                onBlur={(e) => {
                  setValue("email", e.target.value);
                  trigger("email");
                }}
              />
              {errors?.email?.message ? (
                <p className="text-sm text-red-600">{errors.email.message}</p>
              ) : (
                ""
              )}
            </div>
            <div className="wrapper flex flex-col gap-[2px]">
              <label htmlFor="" className="text-sm mt-[10px]">
                New password{" "}
              </label>
              <input
                type="password"
                placeholder="New password"
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
                {`Avatar image (url)   `}{" "}
              </label>
              <input
                type="url"
                placeholder="Avatar image"
                className="text-base px-[16px] py-[8px] border border-gray-300 rounded-xs"
                {...register("image", {
                  validate: async (val: string = "") => {
                    if (val == "") return true;
                    try {
                      const res = await fetch(val, { method: "HEAD" });
                      const contentType = res.headers.get("Content-Type");
                      return (
                        contentType?.startsWith("image") || "Invalid image URL"
                      );
                    } catch (err) {
                      return "Could not verify image URL";
                    }
                  },
                })}
                onBlur={(e) => {
                  setValue("image", e.target.value);
                  trigger("image");
                }}
              />
              {errors?.image?.message ? (
                <p className="text-sm text-red-600">{errors.image.message}</p>
              ) : (
                ""
              )}
            </div>
            <button
              type="submit"
              className="flex flex-row justify-center items-center gap-1 bg-[#1890FF] text-white p-[8px] text-base rounded-xs mt-[12px]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  {" "}
                  <ArrowPathIcon className="animate-spin size-[14px] " />{" "}
                  <span>Saving...</span>
                </>
              ) : (
                <>Save</>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
