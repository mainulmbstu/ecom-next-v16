"use client";

import { useAuth } from "@/lib/components/context";
import React, { useState } from "react";
import { roleAction } from "./action";
import toast from "react-hot-toast";
import { swalModal } from "@/lib/helpers/swalModal";

const Role = ({ role, id }) => {
  let { userInfo } = useAuth();
  let [loading, setLoading] = useState(false);
  //   let [value, setValue] = useState('');

  let roleHandle = async (value, id) => {
    try {
      if (userInfo?._id === id) {
        return swalModal("You cannot update yourself", "error");
      }
      setLoading(true);
      let data = await roleAction(value, id);
      setLoading(false);
      if (data?.success) {
        // toast.success(data?.message);
        swalModal(data?.message);
      }
    } catch (error) {
      // toast.error(error?.message);
      swalModal(error?.message, "error");
      console.log(error);
    }
  };
  return (
    <div>
      <select
        onChange={(e) => roleHandle(e.target.value, id)}
        defaultValue={role}
        name="role"
        className="input-000 w-20"
      >
        <option disabled={true}>{role}</option>
        <option>user</option>
        <option>admin</option>
      </select>
    </div>
  );
};

export default Role;
