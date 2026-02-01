"use client";
import React, { useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import { replyAction } from "./action";

const ReplyModal = ({ name, cid, title = "Submit", design = "btn-link" }) => {
  let ref = useRef();
  let [loading, setLoading] = useState(false);
  // console.log(value);
  let clientAction = async (formData) => {
    setLoading(true);
    let data = await replyAction(cid, formData);
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
        className={`btn ${design}`}
        onClick={() => ref.current.showModal()}
        // onClick={() => document.getElementById("my_modal_1").showModal()}
      >
        {loading ? "Submitting" : title}
      </button>
      <dialog ref={ref} id="my_modal_1" className="modal">
        <div className="modal-box max-w-full w-100">
          <div className="">
            <h3 className="text-lg font-bold">Reply to {name} </h3>
            <Form
              action={clientAction}
              className=" p-4  bg-slate-300 shadow-lg shadow-blue-300 card"
            >
              <div className="mt-3">
                <label className="block" htmlFor="description">
                  Reply
                </label>
                <textarea
                  rows="4"
                  className="input"
                  type="text"
                  id="reply"
                  name="reply"
                  required
                  placeholder="Enter your reply"
                />
              </div>
              <div className="mt-3">
                <SubmitButton title={"Submit"} design={"btn-accent w-full"} />
              </div>
            </Form>
          </div>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
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

export default ReplyModal;
