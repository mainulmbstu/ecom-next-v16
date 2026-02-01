"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import { MdStar } from "react-icons/md";
import { ratingAction } from "./action";

const RatingModal = ({ pid }) => {
  let [loading, setLoading] = useState(false);
  let [rating, setRating] = useState("");
  let clientAction = async () => {
    if (!rating) return Swal.fire("Error", "Star must be selected", "error");
    setLoading(true);
    let data = await ratingAction(pid, rating);
    setLoading(false);
    if (data?.success) {
      toast.success(data?.message);
      setRating("");
    }
  };
  return (
    <div>
      {/* The button to open modal */}
      <label htmlFor="RatingModal" className="btn btn-primary">
        {loading ? "Submitting" : "Rate this Product"}
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="RatingModal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Rating Box</h3>
          <Form className=" p-4 w-full card">
            <div className=" mb-4 flex space-x-4">
              {Array.from({ length: 5 }, (v, i) => i + 1).map((num) => {
                return (
                  <MdStar
                    key={num}
                    className={`text-4xl cursor-pointer ${
                      rating >= num ? "text-red-500" : ""
                    }`}
                    onClick={() => setRating(num)}
                  />
                );
              })}
            </div>
          </Form>
          <div className="modal-action">
            <label htmlFor="RatingModal" className="btn btn-error">
              Close
            </label>
            <label
              onClick={clientAction}
              htmlFor="RatingModal"
              className="btn btn-success"
            >
              Submit
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RatingModal;
