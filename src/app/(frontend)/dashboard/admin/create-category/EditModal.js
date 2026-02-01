"use client";
import React, { useEffect, useRef, useState } from "react";
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
  let { catPlain, catPlainFunc } = useAuth();
  // console.log(value);
  let clientAction = async (formData) => {
    setLoading(true);
    let data = await editAction(value?.id, formData);
    setLoading(false);
    if (data?.success) {
      // Swal.fire("Success", data?.message, "success");
      toast.success(data?.message);
      catPlainFunc();
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
            <h3 className="text-lg font-bold">Edit your post</h3>
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
                />
              </div>
              <div className="mt-3">
                <label className="block" htmlFor="name">
                  Category Name
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
                <label className="block" htmlFor="title">
                  Select Parent Category
                </label>
                <select
                  // onChange={(e) => roleHandle(e.target.value, id)}
                  // defaultValue={'Select Category'}
                  name="parentId"
                  className="select w-full"
                >
                  <option value={value?.parentId || ""}>
                    {value?.parentName || "It is top category"}
                  </option>
                  <option value="">{"Make it top category"}</option>
                  {catPlain?.length &&
                    catPlain
                      .filter((sorted) => sorted._id !== value?.id)
                      .map((item) => (
                        <option key={item?.name} value={item?._id}>
                          {item?.name}
                        </option>
                      ))}
                </select>
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
