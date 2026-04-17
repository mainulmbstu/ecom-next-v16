"use client";

import React from "react";
import { useAuth } from "../context";
import toast from "react-hot-toast";
import { swalModal } from "@/lib/helpers/swalModal";

const AddToCartBTN = ({ data }) => {
  let item = data ? JSON.parse(data) : {};

  let { cart, setCart } = useAuth();
  return (
    <div>
      {" "}
      <button
        type="button"
        onClick={() => {
          let cartIds = cart.map((it) => it._id);
          if (cartIds.includes(item?._id)) {
            return alert("Already added");
          }
          setCart([item, ...cart]);
          localStorage.setItem("cart", JSON.stringify([item, ...cart]));
          // toast.success(`${item?.name} added to Cart`);
          swalModal(`${item?.name} added to Cart`);
        }}
        className="btn btn-blue mt-auto"
      >
        Add to cart
      </button>
    </div>
  );
};

export default AddToCartBTN;
