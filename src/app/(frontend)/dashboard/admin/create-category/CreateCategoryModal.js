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

const CreateCategoryModal = () => {
  let [loading, setLoading] = useState(false);
  const [picture, setPicture] = useState("");
  let { catPlain, catPlainFunc } = useAuth();
  let router = useRouter();

  let clientAction = async (formData) => {
    setLoading(true);
    let { data } = await Axios.post("/api/admin/create-category", formData);
    setLoading(false);
    if (data?.success) {
      catPlainFunc();
      // Swal.fire("Success", data?.message, "success");
      router.refresh("/dashboard/admin/create-category");
      toast.success(data?.message);
    } else {
      Swal.fire("Error", data?.message, "error");
      // toast.error(data?.message);
    }
  };
  return (
    <div>
      {/* The button to open modal */}
      <label htmlFor="CreateCategoryModal" className="btn btn-primary">
        {loading ? "Submitting" : "Create New Category"}
      </label>

      {/* Put this part before </body> tag */}
      <input
        type="checkbox"
        id="CreateCategoryModal"
        className="modal-toggle"
      />
      <div className="modal" role="dialog">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Create Category</h3>
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
                    Category Name
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
                <div>
                  <label className="block" htmlFor="title">
                    Select Parent Category
                  </label>
                  <select
                    // onChange={(e) => roleHandle(e.target.value, id)}
                    // defaultValue={'Select Category'}
                    name="parentId"
                    className="select w-full"
                  >
                    <option value="">Select Parent Category (optional)</option>
                    {catPlain?.length &&
                      catPlain.map((item) => (
                        <option key={item?.name} value={item?._id}>
                          {item?.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mt-3">
                  <label className="block" htmlFor="name">
                    Select Category Image (optional)
                  </label>
                  <input
                    onChange={(e) => {
                      setPicture(e.target.files[0]);
                    }}
                    className="input"
                    type="file"
                    id="file"
                    name="file"
                  />
                </div>
                <div className="mt-3">
                  <SubmitButton title={"Submit"} design={"btn-accent"} />
                </div>
              </Form>
            </div>
          </div>
          <div className="modal-action">
            <label htmlFor="CreateCategoryModal" className="btn btn-error">
              Close
            </label>
            {/* <label
              onClick={clientAction}
              htmlFor="CreateCategoryModal"
              className="btn btn-success"
            >
              Submit
            </label> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCategoryModal;
