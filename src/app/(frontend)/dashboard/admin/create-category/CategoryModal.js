"use client";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/components/context";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import Image from "next/image";
import blogBanner from "@/assets/blog.svg";
import { Axios } from "@/lib/helpers/AxiosInstance";
import ProgressBar from "@/lib/components/ProgressBar";
import { useRouter } from "next/navigation";

const CategoryModal = ({
  editItem,
  title = "Edit",
  design = "btn-link text-blue-600",
}) => {
  let value = editItem && JSON.parse(editItem);
  let ref = useRef();
  let [loading, setLoading] = useState(false);
  let [picture, setPicture] = useState("");
  const [progress, setProgress] = useState(0);
  let { catPlain, catPlainFunc } = useAuth();
  let router = useRouter();

  // console.log(value);
  let clientAction = async (formData) => {
    formData.append("id", value?._id || "");
    try {
      setLoading(true);

      let { data } = await Axios.post("/api/admin/create-category", formData, {
        onUploadProgress: (progressEvent) => {
          const prog = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(prog);
        },
      });

      if (data?.success) {
        // Swal.fire("Success", data?.message, "success");
        toast.success(data?.message);
        catPlainFunc();
        router.refresh("/dashboard/admin/create-category");
        setProgress(0);
      } else {
        // Swal.fire("Error", data?.message, "error");
        toast.error(data?.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        type="button"
        disabled={loading}
        className={`btn ${design} `}
        onClick={() => ref.current.showModal()}
        // onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        {loading ? "Submitting" : title}
      </button>
      <dialog ref={ref} id="my_modal_1" className="modal mt-15 w-screen ">
        <div className="modal-box">
          <div className="">
            <h3 className="">{title}</h3>
            <div className="mb-4 ms-2">
              <div className="">
                <Image
                  src={
                    picture
                      ? URL.createObjectURL(picture)
                      : value
                        ? value?.picture?.secure_url
                        : blogBanner
                  }
                  alt="image"
                  className=" h-50 w-auto object-contain"
                  height={100}
                  width={100}
                />
              </div>
            </div>
            <Form
              action={clientAction}
              className=" p-4  bg-base-300 shadow-lg shadow-blue-300"
            >
              <div className="mt-3">
                <label className="block" htmlFor="name">
                  Select Image
                </label>
                <input
                  onChange={(e) => {
                    setPicture(e.target.files[0]);
                  }}
                  className="input-000"
                  type="file"
                  id="file"
                  name="file"
                />
              </div>
              <div className="mt-3">
                <label className="block" htmlFor="name">
                  Category Name
                </label>
                <input
                  defaultValue={value?.name}
                  className="input-000"
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block" htmlFor="title">
                  Select Parent Category
                </label>
                <select
                  // onChange={(e) => roleHandle(e.target.value, id)}
                  // defaultValue={'Select Category'}
                  name="parentId"
                  className="select w-full"
                >
                  <option value={value?.parentId?._id || ""}>
                    {value?.parentId?.name || "It is top category"}
                  </option>
                  <option value="">{"Make it top category"}</option>
                  {catPlain?.length &&
                    catPlain
                      .filter((sorted) => sorted._id !== value?._id)
                      .map((item) => (
                        <option key={item?.name} value={item?._id}>
                          {item?.name}
                        </option>
                      ))}
                </select>
              </div>
              <div className="mt-3">
                <ProgressBar progress={progress} color={"bg-blue-400"} />
                <SubmitButton title={"Submit"} design={"btn-accent"} />
              </div>
            </Form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-error absolute right-2 top-5">
                ✕
              </button>
              {/* if there is a button in form, it will close the modal */}
              {/* <button type="submit" className="btn btn-error">
                Close
              </button> */}
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default CategoryModal;
