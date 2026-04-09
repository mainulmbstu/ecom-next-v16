"use client";
import React, { useRef, useState } from "react";
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

const ProductModal = ({
  editItem,
  title = "Edit",
  design = "btn-link text-blue-600",
}) => {
  let value = editItem && JSON.parse(editItem);
  let ref = useRef();
  let [loading, setLoading] = useState(false);
  let [picture, setPicture] = useState("");
  const [progress, setProgress] = useState(0);
  let { catPlain } = useAuth();
  let router = useRouter();
  // console.log(value);
  let clientAction = async (formData) => {
    formData.append("id", value?._id || "");
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
        // Swal.fire("Success", data?.message, "success");
        router.refresh("/dashboard/admin/create-product");
        setProgress(0);
        toast.success(data?.message);
      } else {
        Swal.fire("Error", data?.message, "error");
        // toast.error(data?.message);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
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
      <dialog ref={ref} id="my_modal_1" className="modal w-screen  mt-30 ">
        <div className="modal-box ">
          <div className=" relative mb-25">
            <h3 className="">{title}</h3>
            <div>
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
            </div>
            <Form
              action={clientAction}
              className=" p-4  bg-base-300 shadow-lg shadow-blue-300"
            >
              <div className="mt-3">
                <label className="block" htmlFor="name">
                  Select Imageggg
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
              <div className="mt-3">
                <ProgressBar progress={progress} color={"bg-blue-400"} />
                <SubmitButton title={"Submit"} design={"btn-accent"} />
              </div>
            </Form>
            <div className="modal-action">
              <form method="dialog">
                <button
                  type="submit"
                  className="btn btn-sm btn-circle btn-error absolute right-2 top-2"
                >
                  ✕
                </button>
                {/* if there is a button in form, it will close the modal */}
                <button
                  type="submit"
                  className="btn btn-error absolute right-2 bottom-9"
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default ProductModal;
