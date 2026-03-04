"use client";

import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import profileBanner from "@/assets/profile.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Axios } from "@/lib/helpers/AxiosInstance";

// let initialState = {
//   message:'',
// };
const RegistrationForm = () => {
  const [showpass, setShowPass] = useState(false);
  let [picture, setPicture] = useState("");
  // console.log{mmmmmm}
  let router = useRouter();
  let clientAction = async (formData) => {
    // let data = await registerAction(formData);
    let { data } = await Axios.post("/api/user/register", formData);
    if (data?.success) {
      Swal.fire("Success", data?.message, "success");
      router.push("/user/login");
      // toast.success(data?.message);
    } else {
      // Swal.fire("Error", data?.message, "error");
      toast.error(data?.message);
    }
  };

  return (
    <div className=" grid md:grid-cols-2 black-theme place-items-center">
   	<div className="hidden md:block">
        <Image priority={true} src={profileBanner} alt="" />
      </div>
      <div className=" h-[89vh] grid place-items-center">
      	<Form
					action={clientAction}
					className=" p-4 w-9/10 md:w-4/5 lg:w-9/10 bg-base-300 shadow-lg shadow-blue-300 card dark:text-white placeholder:dark:text-white "
				>
					<h4 className=" text-center">Sign up form</h4>
					<div className=" hidden md:flex justify-center">
						<Image
							className="h-40 w-auto"
							width={100}
							height={100}
							priority={true}
							src={picture ? URL.createObjectURL(picture) : profileBanner}
							alt=""
						/>
					</div>
					<div className="mt-3">
						<label className="block" htmlFor="name">
							Name
						</label>
						<input
							className="input"
							type="text"
							id="name"
							name="name"
							required
							placeholder="Enter name"
						/>
						{/* <p className=" text-red-500" aria-live="polite">
                {state?.message}
              </p> */}
					</div>
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
							placeholder="Enter email"
						/>
					</div>
					<div className="mt-3">
						<label className="block" htmlFor="phone">
							Mobile Number
						</label>
						<input
							className="input"
							type="text"
							id="phone"
							name="phone"
							required
							placeholder="Enter mobile number"
						/>
					</div>
					<div className="mt-3">
						<label className="block" htmlFor="address">
							Address
						</label>
						<input
							className="input"
							type="text"
							id="address"
							name="address"
							required
							placeholder="Enter address"
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
							placeholder="Enter password"
						/>
						{/* <p className=" text-red-500" aria-live="polite">
                {state?.message}
              </p> */}
						<Link
							href={"#!"}
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
						<label className="block" htmlFor="name">
							Select Profile Image, 3mb max
						</label>
						<input
							onChange={(e) => {
								setPicture(e.target.files[0]);
							}}
							className="input"
							type="file"
							id="file"
							name="file"
						/>
						{/* <p className=" text-red-500" aria-live="polite">
                {state?.message}
              </p> */}
					</div>
					<div className="mt-3">
						<SubmitButton
							title={"Sign Up"}
							design={"btn-primary animate-pulse"}
						/>
					</div>
					<p className="my-3 text-center">
						Already have account?{" "}
						<Link className="text-blue-700 underline" href={"/user/login"}>
							Sign in
						</Link>
					</p>
				</Form>
      </div>
    </div>
  );
};

export default RegistrationForm;
