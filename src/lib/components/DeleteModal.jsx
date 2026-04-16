"use client";

import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import { swalModal } from "@/lib/helpers/swalModal";
import { useAuth } from "@/lib/components/context";
import { useRouter } from "next/navigation";

const DeleteModal = ({ value, title = "Delete", design = "btn-link" }) => {
  const [isOpen, setIsOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let { userInfo, catPlainFunc } = useAuth();
  const inputRef = useRef(null);
  let router = useRouter();
  // console.log(value);
  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      inputRef.current?.focus();
    }
  }, [isOpen]);
  //==========================================
  let deleteFunc = async () => {
    try {
      if (userInfo?._id === value?.id) {
        swalModal("You cannot delete yourself", "error");
        return;
      }
      setLoading(true);
      let data = await value.action(value?.id);
      if (data?.success) {
        catPlainFunc();
        // toast.success(data?.message);
        swalModal(data?.message);
        value?.redirect && router.push(value?.redirect);
      } else {
        swalModal(data?.message, "error");
      }
    } catch (error) {
      toast.error(error?.message);
      console.log(error);
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
        {loading ? "Deleting" : title}
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
          {/* for focus */}
          <div className="text-start">
            <span ref={inputRef} tabIndex={-1}></span>
          </div>
          <h3 className="font-bold text-lg text-start">Delete confirmation</h3>
          <div className=" p-2 my-6 text-start  bg-base-300">
            <Form action={deleteFunc} className="">
              <p className="py-4">{value?.message}</p>
              <div className="mt-3 relative">
                <SubmitButton title="YES" design={"btn-success"} />

                <button
                  type="button"
                  className="btn btn-error absolute right-0"
                  onClick={() => setIsOpen(false)}
                >
                  NO
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

export default DeleteModal;
