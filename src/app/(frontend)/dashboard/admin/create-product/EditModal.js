"use client";
import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import { useAuth } from "@/lib/components/context";
import Form from "next/form";
import { editAction } from "./action";
import SubmitButton from "@/lib/components/SubmitButton";
import Image from "next/image";

const EditModal = ({ value }) => {
  let ref = useRef();
  let [loading, setLoading] = useState(false);
  let [picture, setPicture] = useState("");
  let { catPlain } = useAuth();
  // console.log(value);
  let clientAction = async (formData) => {
    setLoading(true);
    let data = await editAction(value?.id, formData);
    setLoading(false);
    if (data?.success) {
      // Swal.fire("Success", data?.message, "success");
      toast.success(data?.message);
    } else {
      // Swal.fire("Error", data?.message, "error");
      toast.error(data?.message);
    }
  };
  return (
    <div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}
      <button
        disabled={loading}
        className="btn btn-link text-blue-600 "
        onClick={() => ref.current.showModal()}
        // onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        {loading ? "Submitting" : "Edit"}
      </button>
      <dialog ref={ref} id="my_modal_1" className="modal">
        <div className="modal-box max-w-full w-100">
          <div className="">
            <h3 className="text-lg font-bold">Edit Product</h3>
            <div className="mb-4 ms-2 flex justify-evenly">
              <div className="">
                <Image
                  src={picture ? URL.createObjectURL(picture) : value?.picture}
                  alt="image"
                  className=" h-50 w-auto object-contain"
                  height={100}
                  width={100}
                />
              </div>
            </div>
            <Form
              action={clientAction}
              className=" p-4  bg-slate-300 shadow-lg shadow-blue-300 card"
            >
              <div className="mt-3">
                <label className="block" htmlFor="name">
                  Select Image
                </label>
                <input
                  onChange={(e) => {
                    setPicture(e.target.files[0]);
                  }}
                  className="input"
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
                  className="input"
                  type="text"
                  id="name"
                  name="name"
                  required
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
                  className="select w-full"
                >
                  <option value={""}>{value?.category}</option>
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
                  className="input"
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
                  className="input"
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
                  className="input"
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
                  defaultValue={value?.color}
                  className="input"
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
                  className="input"
                  type="text"
                  id="description"
                  name="description"
                  required
                  placeholder="Enter product description"
                />
              </div>
              <div className="mt-3">
                <SubmitButton title={"Submit"} design={"btn-accent"} />
              </div>
            </Form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
              {/* if there is a button in form, it will close the modal */}
              <button type="submit" className="btn btn-error">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default EditModal;
