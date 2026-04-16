"use client";

import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/components/context";
import { useState } from "react";
import profileImage from "@/assets/profile.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Axios } from "@/lib/helpers/AxiosInstance";
import ProgressBar from "@/lib/components/ProgressBar";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { swalModal } from "../helpers/swalModal";

const Profile = () => {
  let { userInfo, setUserInfo } = useAuth();
  let [picture, setPicture] = useState("");
  const [progress, setProgress] = useState(0);
  const [showpass, setShowPass] = useState(false);

  let router = useRouter();
  let clientAction = async (formData) => {
    try {
      formData.append("id", userInfo?._id || "");
      let { data } = await Axios.post("/api/user/register", formData, {
        onUploadProgress: (progressEvent) => {
          const prog = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(prog);
        },
      });
      if (data?.success) {
        setUserInfo("");
        setProgress(0);
        router.push("/user/login");
        swalModal(data?.message);
        // toast.success(data?.message);
      } else {
        swalModal(data?.message, "error");
        // toast.error(data?.message);
      }
    } catch (error) {
      swalModal(error?.message, "error");
    } finally {
      setPicture("");
      setProgress(0);
    }
  };

  return (
    <div className=" grid place-items-center h-full black-theme">
      <Form
        action={clientAction}
        className=" p-4 md:w-2/5  max-w-100  bg-base-300 "
      >
        <div className=" hidden md:block">
          <Image priority={true} src={profileImage} alt="" />
        </div>

        <div className="mt-3">
          <label className="block" htmlFor="name">
            Name
          </label>
          <input
            className=" input-000"
            type="text"
            id="name"
            name="name"
            required
            defaultValue={userInfo?.name}
            placeholder="Enter name"
          />
        </div>
        <div className="mt-3">
          <label className="block" htmlFor="email">
            Email
          </label>
          <input
            className=" input-000"
            type="email"
            id="email"
            name="email"
            required
            defaultValue={userInfo?.email}
            readOnly={userInfo}
            placeholder="Enter email"
          />
        </div>
        <div className="mt-3">
          <label className="block" htmlFor="phone">
            Mobile Number
          </label>
          <input
            className=" input-000"
            type="text"
            id="phone"
            name="phone"
            defaultValue={userInfo?.phone}
            required
            placeholder="Enter phone number"
          />
        </div>
        <div className="mt-3">
          <label className="block" htmlFor="address">
            Address
          </label>
          <input
            className=" input-000"
            type="text"
            id="address"
            name="address"
            defaultValue={userInfo?.address}
            required
            placeholder="Enter address"
          />
        </div>
        <div className="mt-3 relative">
          <label className="block" htmlFor="name">
            password
          </label>
          <input
            className=" input-000"
            type={showpass ? "text" : "password"}
            id="password"
            name="password"
            required={!userInfo}
            placeholder="Enter password"
          />
          {/* <p className=" text-red-500" aria-live="polite">
                   {state?.message}
                 </p> */}
          <button
            type="button"
            className={
              userInfo ? "hidden" : "cursor-pointer absolute right-2 top-8"
            }
            onClick={() => setShowPass((prev) => !prev)}
          >
            {showpass ? (
              <FaEyeSlash className="text-2xl" />
            ) : (
              <FaEye className=" text-2xl" />
            )}
          </button>
        </div>
        <div className="mt-3">
          <label className="block" htmlFor="name">
            Select Profile Image
          </label>
          <input
            onChange={(e) => {
              setPicture(e.target.files[0]);
            }}
            className=" input-000"
            type="file"
            id="file"
            name="file"
          />
          {/* <p className=" text-red-500" aria-live="polite">
              {state?.message}
            </p> */}
        </div>
        <div className="mb-4 ms-2 flex justify-evenly">
          {picture && (
            <div className="">
              <p>New uploaded</p>
              <Image
                // src={userInfo?.picture && userInfo?.picture?.secure_url}
                src={picture && URL.createObjectURL(picture)}
                alt="image"
                className="rounded-full size-40 object-contain"
                height={100}
                width={100}
              />
            </div>
          )}

          <div className={userInfo?.picture ? "" : "hidden"}>
            <p>Current Image</p>
            <Image
              priority={true}
              width={400}
              height={404}
              // src={'/adds.jpeg'}
              src={
                userInfo?.picture
                  ? userInfo?.picture?.secure_url
                  : "/dummy.jpeg"
              }
              alt="image"
              className=" rounded-full size-40 object-contain"
              // height={"100px"}
              // width={"100px"}
            />
          </div>
        </div>
        <div className="">
          <ProgressBar progress={progress} color={"bg-blue-400"} />
          <SubmitButton title={userInfo ? "Update Profile" : "Register"} />
        </div>
      </Form>
    </div>
  );
};

export default Profile;
