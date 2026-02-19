"use client";

import ProgressBar from "@/lib/components/ProgressBar";
import SubmitButton from "@/lib/components/SubmitButton";
import { Axios } from "@/lib/helpers/AxiosInstance";
import Form from "next/form";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { CldVideoPlayer } from "next-cloudinary";
import "next-cloudinary/dist/cld-video-player.css";

const AboutPage = () => {
  const [picture, setPicture] = useState("");
  const [progress, setProgress] = useState(0);

  let clientAction = async (formData) => {
    let { data } = await Axios.post("/api/both/about", formData, {
      onUploadProgress: (progressEvent) => {
        const prog = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total,
        );
        setProgress(prog);
      },
    });
    if (data?.success) {
      toast.success(data?.message);
      setProgress(0);
    } else {
      Swal.fire("Error", data?.message, "error");
      // toast.error(data?.message);
    }
  };
  return (
    <div>
      <ProgressBar progress={progress} color={"bg-blue-400"} />
      <div className="p-3 w-96">
        <Form
          action={clientAction}
          className=" p-4  bg-slate-300 shadow-lg shadow-blue-300 card"
        >
          <div className="mt-3">
            <label className="block cursor-pointer" htmlFor="file">
              Select Image (optional)
              <input
                onChange={(e) => {
                  setPicture(e.target.files[0]);
                }}
                className="inputt"
                type="file"
                id="file"
                name="file"
              />
              <Image
                loading="eager"
                // src={"/placeholder.jpg"}
                src={
                  picture ? URL.createObjectURL(picture) : "/placeholder.jpg"
                }
                alt="Selected Image"
                width={100}
                height={100}
                className="mt-3 w-32 h-32 object-cover rounded-full"
              />
            </label>
          </div>
          <div className="mt-3">
            <SubmitButton title={"Submit"} design={"btn-accent"} />
          </div>
        </Form>
      </div>
      <div className="my-5">
        {/* <CldVideoPlayer
          width="400"
          height="300"
          src="https://res.cloudinary.com/dgj1icpu7/video/upload/v1702428300/00Video_wjiekc.mp4"
        /> */}
      </div>
      <video controls src="/00Video.mp4"></video>
    </div>
  );
};

export default AboutPage;
