"use client";

import { loginAction } from "./loginAction";
import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuth } from "@/lib/components/context";
import loginImage from "@/assets/login.svg";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
// import { useRouter, useSearchParams } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

const LoginForm = () => {
  let { setToken, setUserInfo } = useAuth();
  let router = useRouter();
  const [showpass, setShowPass] = useState(false);
  let lastPath = useSearchParams().get("lastPath");
  let clientAction = async (formData) => {
    let data = await loginAction(formData);
    if (data?.success) {
      // Swal.fire("Success", data?.message, "success");
      toast.success(data?.message);
      setToken(data?.token);
      setUserInfo(JSON.parse(data?.userInfo));
      router.push(lastPath ? lastPath : "/");
    } else {
      // Swal.fire("Error", data?.message, "error");
      toast.error(data?.message);
    }
  };
  return (
    <div className=" h-[89vh] grid md:grid-cols-2 place-items-center black-theme ">
      {/* <h3 className=" text-white">Login </h3> */}
      <div>
        <Image priority={true} src={loginImage} alt="" />
      </div>
      <div className="w-9/10 grid place-items-center">
        <h2>Login Form</h2>
        <Form
          action={clientAction}
          className=" p-4 w-full md:w-4/5 lg:w-3/5 card"
        >
          {/* <Image src='/login.svg' width={100} height={200} alt="" /> */}
          <div className="mt-3">
            <label className="block" htmlFor="email">
              Email
            </label>
            <input
              className="input"
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className="mt-3 relative">
            <label className="block" htmlFor="name">
              password
            </label>
            <input
              className="input"
              type={showpass ? "text" : "password"}
              id="password"
              name="password"
              required
            />
            {/* <p className=" text-red-500" aria-live="polite">
                {state?.message}
              </p> */}
            <Link
              href={"#"}
              className=" cursor-pointer absolute right-2 top-8"
              onClick={() => setShowPass((prev) => !prev)}
            >
              {showpass ? (
                <FaEyeSlash className="text-2xl" />
              ) : (
                <FaEye className=" text-2xl" />
              )}
            </Link>
          </div>
          <div className="mt-3">
            <SubmitButton
              title={"Sign In"}
              design={"btn-neutral bg-green-500 animate-pulse cursor-pointer"}
            />
          </div>
          <div className="mt-3 text-end">
            <Link href={"/user/forgot-password"} className="">
              Forgot Password ?
            </Link>
          </div>
          <p className="my-3 text-center">
            Don&apos;t have an account?{" "}
            <Link className="text-blue-700 underline" href={"/user/register"}>
              Sign up
            </Link>
          </p>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
