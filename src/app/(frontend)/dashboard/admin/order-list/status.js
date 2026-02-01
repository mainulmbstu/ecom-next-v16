"use client";

import { useAuth } from "@/lib/components/context";
import React, { useState } from "react";
import { StatusAction } from "./action";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Status = ({ status, id }) => {
  let { userInfo } = useAuth();
  let [loading, setLoading] = useState(false);
  //   let [value, setValue] = useState('');
  let roleHandle = async (value, id) => {
    try {
      if (userInfo?._id === id) {
        return Swal.fire("Error", "You cannot update yourself", "error");
      }
      setLoading(true);
      let data = await StatusAction(value, id);
      setLoading(false);
      if (data?.success) {
        toast.success(data?.message);
      }
    } catch (error) {
      toast.error(error?.message);
      console.log(error);
    }
  };
  return (
    <div>
      <select
        onChange={(e) => roleHandle(e.target.value, id)}
        defaultValue={status}
        name="role"
        className="select"
      >
        <option disabled={true}>{status}</option>
        <option>Not Process</option>
        <option>Processing</option>
        <option>shipped</option>
        <option>delivered</option>
        <option>cancel</option>
      </select>
    </div>
  );
};

export default Status;
