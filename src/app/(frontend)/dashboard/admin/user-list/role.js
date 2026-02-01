"use client";

import { useAuth } from "@/lib/components/context";
import React, { useState } from "react";
import { roleAction } from "./roleAction";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const Role = ({ role, id }) => {
  let { userInfo } = useAuth();
  let [loading, setLoading] = useState(false);
  //   let [value, setValue] = useState('');

  let roleHandle = async (value, id) => {
    try {
      if (userInfo?._id === id) {
        return Swal.fire("Error", "You cannot update yourself", "error");
      }
      setLoading(true);
      let data = await roleAction(value, id);
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
        defaultValue={role}
        name="role"
        className="select"
      >
        <option disabled={true}>{role}</option>
        <option>user</option>
        <option>admin</option>
      </select>
    </div>
  );
};

export default Role;
