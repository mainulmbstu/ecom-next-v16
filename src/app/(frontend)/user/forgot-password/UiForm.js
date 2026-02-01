"use client";

import { Action } from "./action";
import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import loginImage from "@/assets/login.svg";
import Image from "next/image";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

const UiForm = () => {
  let router = useRouter();
  const [showpass, setShowPass] = useState(false);
  const [OTP, setOTP] = useState("");
  const [email, setEmail] = useState("");

  let clientAction = async (formData) => {
    setEmail(formData.get("email"));
    let data = await Action(formData);
    if (data?.success) {
      Swal.fire("Success", data?.message, "success");
      // toast.success(data?.message);
      setOTP(data?.genOTP);
      if (data?.success === "reset") {
        router.push("/user/login");
      }
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
        <h2>Reset Password Form</h2>
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
              defaultValue={email}
              type="email"
              id="email"
              name="email"
              required
            />
          </div>
          <div className={OTP ? "" : "hidden"}>
            <div className="mt-3">
              <label className="block" htmlFor="inputOtp">
                Input OTP
              </label>
              <input
                className="input"
                type={"text"}
                id="inputOtp"
                name="inputOtp"
              />
              {/* <p className=" text-red-500" aria-live="polite">
                  {state?.message}
                </p> */}
            </div>
            <div className="mt-3 relative">
              <label className="block" htmlFor="password">
                password
              </label>
              <input
                className="input"
                type={showpass ? "text" : "password"}
                id="password"
                name="password"
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
          </div>
          <div className="mt-3">
            <SubmitButton title={"Submit"} />
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UiForm;
