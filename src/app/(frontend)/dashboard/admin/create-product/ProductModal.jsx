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
import { useRouter } from "next/navigation";
import ProgressBar from "@/lib/components/ProgressBar";
import { swalModal } from "@/lib/helpers/swalModal";

const ProductModal = ({
  editItem,
  title = "Edit",
  design = "btn-link text-blue-600",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  let value = editItem && JSON.parse(editItem);
  let [loading, setLoading] = useState(false);
  let [picture, setPicture] = useState("");
  const [progress, setProgress] = useState(0);
  let { catPlain } = useAuth();
  let router = useRouter();
  const inputRef = useRef(null);
  // console.log(value);
  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      inputRef.current?.focus();
    }
  }, [isOpen]);

  let clientAction = async (formData) => {
    formData.append("id", value?._id || "");
    if (value) setIsOpen(false);
    try {
      setLoading(true);
      let { data } = await Axios.post("/api/admin/product", formData, {
        onUploadProgress: (progressEvent) => {
          const prog = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setProgress(prog);
        },
      });
      if (data?.success) {
        // toast.success(data?.message);
        // alert(data?.message);
        // Swal.fire("Success", data?.message, "success",);
        swalModal(data?.message);
        router.refresh("/dashboard/admin/create-product");
        setProgress(0);
      } else {
        swalModal(data?.message, "error");
        // toast.error(data?.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="">
      <button
        type="button"
        disabled={loading}
        className={`btn ${design} `}
        onClick={() => setIsOpen(true)}
      >
        {loading ? "Submitting" : title}
      </button>
      {/* modal*/}
      <div
        className={`bg-gray-700/80  w-screen h-screen fixed top-0 left-0 grid  justify-start  md:justify-center items-start md:items-center z-999 overflow-scroll  ${
          isOpen ? " " : "scale-0"
        }`}
      >
        {/* modal box*/}
        <div
          className={`w-screen max-w-md transition-all duration-1000  shadow-sm shadow-sky-300 p-3 bg-base-100 relative   ${isOpen ? " opacity-100 " : " opacity-0"}`}
        >
          <h4 className="text-start">{title}</h4>
          <div className=" p-2  bg-base-300">
            <div className=" ms-2 pb-1">
              <Image
                src={
                  picture
                    ? URL.createObjectURL(picture)
                    : value
                      ? value?.picture?.at(0)?.secure_url
                      : blogBanner
                }
                alt="image"
                className=" h-50 w-auto object-contain mx-auto"
                height={100}
                width={100}
              />
            </div>
            <Form action={clientAction} className="text-start">
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
                  multiple
                />
              </div>
              <div className="mt-3">
                <label className="block" htmlFor="name">
                  Product Name
                </label>
                <input
                  ref={inputRef}
                  defaultValue={value?.name}
                  className="input-000"
                  type="text"
                  id="name"
                  name="name"
                  required
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="block" htmlFor="category">
                  Select Category
                </label>
                <select
                  // onChange={(e) => roleHandle(e.target.value, id)}
                  // defaultValue={'Select Category'}
                  name="category"
                  className="input-000 w-full"
                >
                  <option value={""}>
                    {value?.category?.name || "Select Category"}
                  </option>
                  {catPlain?.length &&
                    catPlain.map((item) => (
                      <option key={item?.name} value={item?._id}>
                        {item?.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mt-3">
                <label className="block" htmlFor="price">
                  Product price
                </label>
                <input
                  defaultValue={value?.price}
                  className="input-000"
                  type="text"
                  id="price"
                  name="price"
                  required
                  placeholder="Enter price"
                />
              </div>
              <div className="mt-3">
                <label className="block" htmlFor="offer">
                  Offer (percent)
                </label>
                <input
                  defaultValue={value?.offer}
                  className="input-000"
                  type="number"
                  id="offer"
                  name="offer"
                  placeholder="Enter offer percent, default value 0"
                />
              </div>
              <div className="mt-3">
                <label className="block" htmlFor="quantity">
                  Quantity
                </label>
                <input
                  defaultValue={value?.quantity}
                  className="input-000"
                  type="number"
                  id="quantity"
                  name="quantity"
                  required
                  placeholder="Enter quantity"
                />
              </div>
              <div className="mt-3">
                <label className="block" htmlFor="color">
                  Color
                </label>
                <input
                  defaultValue={value?.color?.toString()}
                  className="input-000"
                  type="text"
                  id="color"
                  name="color"
                  placeholder="Type Color with comma (Black,Red,Blue)"
                />
              </div>
              <div className="mt-3">
                <label className="block" htmlFor="description">
                  Description
                </label>
                <textarea
                  defaultValue={value?.description}
                  rows="4"
                  className="input-000"
                  type="text"
                  id="description"
                  name="description"
                  required
                  placeholder="Enter product description"
                />
              </div>
              <div className="mt-3 relative">
                <ProgressBar progress={progress} color={"bg-blue-400"} />
                <div className="flex">
                  <SubmitButton title={"Submit"} design={"btn-success"} />
                  <button
                    type="button"
                    className="btn btn-error absolute right-0"
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Form>
            <div className="my-2">
              <button
                type="button"
                className="btn  btn-error btn-circle absolute top-1 right-4"
                onClick={() => setIsOpen(false)}
              >
                x
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
