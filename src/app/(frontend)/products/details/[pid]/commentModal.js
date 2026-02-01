"use client";
import React, { useState } from "react";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import { commentAction } from "./action";

const CommentModal = ({ pid }) => {
  let [loading, setLoading] = useState(false);
  let [comment, setComment] = useState("");

  let clientAction = async () => {
    if (!comment) return Swal.fire("Error", "Comment cannot be blank", "error");
    setLoading(true);
    let data = await commentAction(pid, comment);
    setLoading(false);
    if (data?.success) {
      toast.success(data?.message);
      setComment("");
    }
  };
  return (
    <div>
      {/* The button to open modal */}
      <label htmlFor="CommentModal" className="btn btn-success">
        {loading ? "Submitting" : "Click to review"}
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="CommentModal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Comment Box</h3>
          <Form className=" p-4 w-full card">
            <div className="mt-3">
              <label className="block" htmlFor="comment">
                Type your text
              </label>
              <textarea
                onChange={(e) => setComment(e.target.value)}
                className="input w-full"
                type="text"
                id="comment"
                name="comment"
                value={comment}
                required
              />
            </div>
          </Form>
          <div className="modal-action">
            <label htmlFor="CommentModal" className="btn btn-error">
              Close
            </label>
            <label
              onClick={clientAction}
              htmlFor="CommentModal"
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

export default CommentModal;
