"use client";
import moment from "moment";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DeleteModal from "@/lib/components/DeleteModal";
import { deleteAction, offerAction } from "./action";
import Pagination from "@/lib/components/pagination";
import { useAuth } from "@/lib/components/context";
import SubmitButton from "@/lib/components/SubmitButton";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import ProductModal from "./ProductModal";
import { blurDataURL } from "@/lib/helpers/blurData";

const ProductListClient = ({ value }) => {
  let { keyword, category, page, perPage, data } = value;
  let { catPlain } = useAuth();
  let [products, setProducts] = useState([]);
  useEffect(() => {
    setProducts(data?.productList);
  }, [data]);

  let selectHandle = (e) => {
    let { name, checked } = e.target;
    // setProducts([name]);
    if (name === "selectAll") {
      let tempArr = products?.map((item) => {
        return { ...item, isChecked: checked };
      });
      setProducts(tempArr);
    } else {
      let tempArr = products?.map((item) =>
        item?._id === name ? { ...item, isChecked: checked } : item,
      );
      setProducts(tempArr);
    }
  };
  let clientAction = async (formData) => {
    let offer = formData.get("offer");
    let selectIdArr =
      products?.length &&
      products.filter((item) => item?.isChecked).map((item) => item?._id);
    if (!selectIdArr?.length || !offer) {
      return Swal.fire(
        "Error",
        "Select product and input offer percentage",
        "error",
      );
    }
    let data = await offerAction(selectIdArr, formData);
    if (data?.success) {
      Swal.fire("Success", data?.message, "success");
      //   toast.success(data?.message);
    } else {
      Swal.fire("Error", data?.message, "error");
      //   toast.error(data?.message);
    }
  };
  return (
    <div>
      <div>
        <div className="flex">
          <div className="my-2">
            <Form action="/dashboard/admin/create-product">
              <div className="flex">
                <div className="">
                  <input
                    defaultValue={keyword}
                    name="keyword"
                    type="search"
                    className="input-000"
                    placeholder="Product name"
                  />
                </div>
                <div className="">
                  <SubmitButton title={"Search"} design={"btn btn-search"} />
                </div>
              </div>
            </Form>
          </div>
          <div className="m-2">
            <Form action="/dashboard/admin/create-product">
              <div className="flex">
                <div className="">
                  <input
                    defaultValue={category}
                    name="category"
                    type="search"
                    list="categoryList"
                    className="input-000"
                    placeholder="Select category"
                  />
                  <datalist id="categoryList">
                    {catPlain?.length &&
                      catPlain.map((item) => {
                        return (
                          <option key={item._id} value={item?.slug}></option>
                        );
                      })}
                  </datalist>
                </div>
                <div className="">
                  <SubmitButton title={"Search"} design={"btn btn-search"} />
                </div>
              </div>
            </Form>
          </div>
          <div className="m-2">
            <Form action={clientAction}>
              <div className="flex">
                <div className="">
                  <input
                    //   defaultValue={keyword}
                    name="offer"
                    type="number"
                    className="input-000"
                    placeholder="Write offer percentage"
                  />
                </div>
                <div className="">
                  <SubmitButton title={"Submit"} design={"btn btn-search"} />
                </div>
              </div>
            </Form>
          </div>
        </div>

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <h5> Total product: {data?.total} </h5>

          <table className="w-full border-separate border-spacing-x-0.5 border-spacing-y-1">
            {/* head */}
            <thead className="">
              <tr className="bg-base-300 h-10 text-center">
                <th scope="col">
                  {" "}
                  <div>
                    <input
                      onChange={selectHandle}
                      name="selectAll"
                      className=" mx-2 size-4"
                      checked={
                        products?.length &&
                        products.filter((item) => item?.isChecked !== true)
                          .length < 1
                      }
                      type="checkbox"
                      id="all"
                    />
                  </div>
                </th>
                <th scope="col">Name</th>
                <th scope="col">Picture</th>
                <th scope="col">Creator</th>
                <th scope="col">Category</th>
                <th scope="col">Quantity</th>
                <th scope="col">Price</th>
                <th scope="col">Offer</th>
                <th scope="col">Created Date</th>
                <th scope="col">Edit</th>
                <th scope="col">Delete</th>
              </tr>
            </thead>
            <tbody className=" bg-base-100">
              {products?.length ? (
                products?.map((item) => (
                  <tr key={item?._id} className="hover:bg-zinc-300 text-center">
                    <td>
                      <input
                        onChange={selectHandle}
                        className=""
                        type="checkbox"
                        name={item?._id}
                        id={item?._id}
                        checked={item?.isChecked || false}
                      />
                    </td>
                    <td>{item.name}</td>
                    <td>
                      <Link
                        href={item.picture?.at(0)?.secure_url}
                        target="_blank"
                      >
                        <Image
                          priority={true}
                          blurDataURL={blurDataURL()}
                          placeholder="blur"
                          className="h-8 w-auto mx-auto"
                          width={50}
                          height="50"
                          src={item.picture?.at(0)?.secure_url}
                          alt=""
                        />
                      </Link>
                    </td>
                    <td>{item.user?.name}</td>
                    <td>{item.category?.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.price}</td>
                    <td>{item.offer}</td>
                    <td>
                      {moment(new Date(item.createdAt)).format("DD-MM-YYYY")}
                    </td>

                    <td>
                      <ProductModal editItem={JSON.stringify(item)} />
                    </td>

                    <td>
                      <DeleteModal
                        value={{
                          id: item?._id.toString(),
                          message: `Do you want to delete ${item?.name}`,
                          action: deleteAction,
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td>No data found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className=" mt-3 ">
          <Pagination
            total={data?.total || 1}
            page={page}
            perPage={perPage}
            spms1="keyword"
            spms1Value={keyword}
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default ProductListClient;
