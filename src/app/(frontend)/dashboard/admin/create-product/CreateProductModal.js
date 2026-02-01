"use client";
import React, { useState } from "react";
import { useAuth } from "@/lib/components/context";
import Swal from "sweetalert2";
import toast from "react-hot-toast";
import Form from "next/form";
import { Axios } from "@/lib/helpers/AxiosInstance";
import Image from "next/image";
import blogBanner from "@/assets/blog.svg";
import SubmitButton from "@/lib/components/SubmitButton";
import { useRouter } from "next/navigation";

const CreateProductModal = () => {
  let [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState("");
  let { catPlain, catPlainFunc } = useAuth();
  let router = useRouter();

  let clientAction = async (formData) => {
    setLoading(true);
    let { data } = await Axios.post("/api/admin/product", formData);
    setLoading(false);
    if (data?.success) {
      // Swal.fire("Success", data?.message, "success");
      router.refresh("/dashboard/admin/create-product");
      toast.success(data?.message);
    } else {
      Swal.fire("Error", data?.message, "error");
      // toast.error(data?.message);
    }
  };
  return (
    <div>
      {/* The button to open modal */}
      <label htmlFor="CreateProductModal" className="btn btn-primary">
        {loading ? "Submitting" : "Create New Product"}
      </label>

      {/* Put this part before </body> tag */}
      <input type="checkbox" id="CreateProductModal" className="modal-toggle" />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create Product</h3>
          <div className=" grid md:grid-cols-1">
            <div className="p-3 mx-auto">
              <Image
                priority={true}
                src={picture ? URL.createObjectURL(picture) : blogBanner}
                alt="image"
                className="h-40 w-auto object-contain"
                height={200}
                width={200}
              />
            </div>
            <div className="p-3">
              <Form
                action={clientAction}
                className=" p-4  bg-slate-300 shadow-lg shadow-blue-300 card"
              >
                <div className="mt-3">
                  <label className="block" htmlFor="name">
                    Product Name
                  </label>
                  <input
                    className="input"
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Enter Category Name"
                  />
                </div>
                <div className="mt-3">
                  <label className="block" htmlFor="title">
                    Select Category
                  </label>
                  <select
                    // onChange={(e) => roleHandle(e.target.value, id)}
                    // defaultValue={'Select Category'}
                    name="category"
                    className="select w-full"
                    required
                  >
                    <option value="">Select Category</option>
                    {catPlain?.length &&
                      catPlain.map((item) => (
                        <option key={item?.name} value={item?._id}>
                          {item?.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mt-3">
                  <label className="block" htmlFor="price">
                    Product price
                  </label>
                  <input
                    className="input"
                    type="text"
                    id="price"
                    name="price"
                    required
                    placeholder="Enter price"
                  />
                </div>
                <div className="mt-3">
                  <label className="block" htmlFor="offer">
                    Offer
                  </label>
                  <input
                    className="input"
                    type="number"
                    id="offer"
                    name="offer"
                    placeholder="Enter offer percent, default value 0"
                  />
                </div>
                <div className="mt-3">
                  <label className="block" htmlFor="quantity">
                    Quantity
                  </label>
                  <input
                    className="input"
                    type="number"
                    id="quantity"
                    name="quantity"
                    required
                    placeholder="Enter quantity"
                  />
                </div>
                <div className="mt-3">
                  <label className="block" htmlFor="color">
                    Color
                  </label>
                  <input
                    className="input"
                    type="text"
                    id="color"
                    name="color"
                    placeholder="Type Color with comma (Black,Red,Blue)"
                  />
                </div>
                <div className="mt-3">
                  <label className="block" htmlFor="description">
                    Description
                  </label>
                  <textarea
                    rows="4"
                    className="input"
                    type="text"
                    id="description"
                    name="description"
                    required
                    placeholder="Enter product description"
                  />
                </div>
                <div className="mt-3">
                  <label className="block" htmlFor="name">
                    Select Product Image (optional)
                  </label>
                  <input
                    onChange={(e) => {
                      setPicture(e.target.files[0]);
                    }}
                    className="input"
                    type="file"
                    id="file"
                    name="file"
                    multiple
                  />
                </div>
                <div className="mt-3">
                  <SubmitButton title={"Submit"} design={"btn-accent"} />
                </div>
              </Form>
            </div>
          </div>
          <div className="modal-action">
            <label htmlFor="CreateProductModal" className="btn btn-error">
              Close
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
