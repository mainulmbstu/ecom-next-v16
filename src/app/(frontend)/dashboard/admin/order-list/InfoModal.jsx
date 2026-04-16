"use client";
import React, { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import { swalModal } from "@/lib/helpers/swalModal";
import { bkashQuery, bkashSearch } from "./action";

const InfoModal = ({
  editItem,
  title = "Edit",
  design = "btn-link text-blue-600",
}) => {
  let payAction = title === "Search" ? bkashSearch : bkashQuery;
  let value = editItem && JSON.parse(editItem);
  const [isOpen, setIsOpen] = useState(false);
  let [loading, setLoading] = useState(false);
  let [paymentInfo, setpaymentInfo] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Focus the input when the modal opens
      inputRef.current?.focus();
    }
  }, [isOpen]);
  //===================================
  let clientAction = async () => {
    try {
      setLoading(true);
      let data = await payAction(
        title === "Search"
          ? value?.payment?.trxn_id
          : value?.payment?.payment_id,
      );
      if (data?.success) {
        setpaymentInfo(data?.result);
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
  let info = () => {
    let text = [];
    for (let k in paymentInfo) {
      text.push(
        <p key={k}>
          {" "}
          {k} : {paymentInfo[k]}{" "}
        </p>,
      );
    }
    return text;
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
        className={`bg-gray-700/80 w-screen  h-screen fixed top-0 left-0 grid  justify-start  md:justify-center items-start md:items-center z-999 overflow-scroll  ${
          isOpen ? " " : "scale-0"
        }`}
      >
        {/* modal box*/}
        <div
          className={`w-screen max-w-md transition-all duration-1000  shadow-sm shadow-sky-300 p-3 bg-base-100 relative   ${isOpen ? " opacity-100 " : " opacity-0"}`}
        >
          <div className="text-start text-2xl" ref={inputRef} tabIndex={-1}>
            {title}
          </div>
          <div className=" p-2  bg-base-300">
            <div className="text-start"> {info()}</div>
            <Form action={clientAction} className="">
              <div className="mt-3 relative">
                <div className="flex">
                  <SubmitButton title={"Submit"} design={"btn-primary"} />
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

export default InfoModal;
