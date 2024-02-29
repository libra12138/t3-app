"use client";
import { Button } from "~/components/ui/button";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const { replace } = useRouter();
  signOut({ redirect: false });
  return (
    <>
      <div className="bg-subtle dark:bg-darkgray-50 flex min-h-screen flex-col justify-center py-12 sm:px-6 lg:px-8">
        <h3 className="logo mx-auto mb-auto"></h3>
        <div className="text-center sm:mx-auto sm:w-full sm:max-w-md"></div>
        <div className="mb-auto mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-default border-subtle mx-2 rounded-md border px-4 py-10 dark:bg-muted sm:px-10">
            <div className="mb-4">
              <div className=" mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-green-600"
                >
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-5">
                <h3
                  className="text-emphasis text-lg font-medium leading-6"
                  id="modal-title"
                >
                  您已登出
                </h3>
                <div className="mt-2">
                  <p className="text-subtle text-sm">
                    我们希望能很快再次与您见面！
                  </p>
                </div>
              </div>
            </div>
            <Button
              className="w-full"
              onClick={() => {
                replace("/auth/sign-in");
              }}
            >
              返回登录页面
            </Button>
          </div>
          <div className="text-default mt-8 text-center text-sm"></div>
        </div>
      </div>
    </>
  );
}
