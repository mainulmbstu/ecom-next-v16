"use client";

import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useAuth } from "@/lib/components/context";
import { useState } from "react";
import profileImage from "@/assets/profile.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Axios } from "@/lib/helpers/AxiosInstance";

const Profile = () => {
  let { userInfo, setUserInfo } = useAuth();
  let [picture, setPicture] = useState("");
  let router = useRouter();
  let clientAction = async (formData) => {
    // let data = await ProfileAction(formData);
    let { data } = await Axios.post("/api/user/profile-update", formData);
    if (data?.success) {
      setUserInfo("");
      router.push("/user/login");
      Swal.fire("Success", data?.message, "success");
      // toast.success(data?.message);
    } else {
      // Swal.fire("Error", data?.message, "error");
      toast.error(data?.message);
    }
  };

  return (
    <div className=" grid place-items-center h-full black-theme">
      <Form action={clientAction} className=" p-4 md:w-3/5  lg:w-4/10 card">
        <div>
          <Image priority={true} src={profileImage} alt="" />
        </div>
        {/* <div className="mt-3">
          <label className="block" htmlFor="userId">
          Use ID
          </label>
          <input
            className="input"
            type="text"
            id="userId"
            name="userId"
            defaultValue={userInfo?._id}
            disabled
          />
        </div> */}
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
            defaultValue={userInfo?.name}
          />
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
            defaultValue={userInfo?.email}
            readOnly
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
            defaultValue={userInfo?.phone}
            required
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
            defaultValue={userInfo?.address}
            required
          />
        </div>
        <div className="mt-3">
          <label className="block" htmlFor="name">
            password
          </label>
          <input
            className="input"
            type="password"
            id="password"
            name="password"
            autoComplete="off"
            defaultValue={""}
          />
        </div>
        <div className="mt-3">
          <label className="block" htmlFor="name">
            Select Profile Image, 3mb maximum
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

          <div>
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
          <SubmitButton title={"Update Profile"} />
        </div>
      </Form>
    </div>
  );
};

export default Profile;
