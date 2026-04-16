"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import { swalModal } from "@/lib/helpers/swalModal";
import { commentAction } from "./action";

const CommentModal = ({ pid, title = "Edit", design = "btn-link" }) => {
  const [isOpen, setIsOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  // console.log(value);
  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      inputRef.current?.focus();
    }
  }, [isOpen]);
  //==========================================
  let clientAction = async (formData) => {
    try {
      setIsOpen(false);
      setLoading(true);
      let data = await commentAction(pid, formData);
      if (data?.success) {
        // toast.success(data?.message);
        // alert(data?.message);
        // Swal.fire("Success", data?.message, "success",);
        swalModal(data?.message);
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
          <div className=" p-2  bg-base-300">
            <Form action={clientAction} className="">
              <div className="mt-3">
                <label className="block" htmlFor="review">
                  Review
                </label>
                <textarea
                  ref={inputRef}
                  rows="4"
                  className="input-000"
                  type="text"
                  id="review"
                  name="review"
                  required
                  placeholder="Enter your review"
                />
              </div>
              <div className="mt-3 relative">
                <SubmitButton design={"btn-success"} />

                <button
                  type="button"
                  className="btn btn-error absolute right-0"
                  onClick={() => setIsOpen(false)}
                >
                  Close
                </button>
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

export default CommentModal;
