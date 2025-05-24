import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router";
import { useGetUserDetailsQuery } from "~/features/auth/authService";
import { setCredentials, logout } from "~/features/auth/authSlice";
import type { AppDispatch } from "~/store";

export default function Header() {
  interface User {
    username: string;
    email: string;
    token?: string;
    bio?: string;
    image?: string;
  }
  const { userInfo } = useSelector(
    (state: { auth: { userInfo: User } }) => state.auth
  );

  const navigate = useNavigate();

  const { data, isFetching } = useGetUserDetailsQuery("userDetails", {
    pollingInterval: 900000,
  });

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (data && data.user) dispatch(setCredentials(data.user));
  }, [data, dispatch]);

  return (
    <header className="bg-white">
      <nav>
        {userInfo ? (
          <ul className="flex items-center gap-[26px] list-none px-[22px] py-[16px]">
            <li className="mr-auto">
              <Link to="/articles">Realworld Blog</Link>
            </li>

            <li>
              <Link
                to="/new-article"
                className="px-[10px] py-[6px] border border-lime-500 rounded-sm text-lime-500 text-sm"
              >
                Create article
              </Link>
            </li>

            <li>
              <Link
                to="/profile"
                className=" flex flex-row items-center gap-[13px] text-sm"
              >
                {userInfo.username}{" "}
                <img
                  className="rounded-[50%] block size-[46px]  object-cover"
                  src={
                    userInfo.image
                      ? userInfo.image
                      : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTl9tmItyQlUn7ktlHH10GC4cu_-znWFXXW-w&s"
                  }
                  alt="user avatar"
                />
              </Link>
            </li>

            <li>
              <button
                className="px-[18px] py-[10px] border border-black rounded-sm text-sm"
                onClick={() => {
                  dispatch(logout());
                  navigate("/sign-in");
                }}
              >
                Log Out
              </button>
            </li>
          </ul>
        ) : (
          <ul className="list-none grid grid-flow-col grid-cols-12 p-[16px]">
            <li className="col-span-10  p-[8px]">
              <a href="#">Realworld Blog</a>
            </li>
            <li className="p-[8px]">
              <Link to="/sign-in" className="text-center block">
                Sign In
              </Link>
            </li>
            <li className="border border-lime-500 p-[8px] rounded-sm">
              <Link to="/sign-up" className="text-center block text-lime-500">
                Sign Up
              </Link>
            </li>
          </ul>
        )}
      </nav>
    </header>
  );
}
