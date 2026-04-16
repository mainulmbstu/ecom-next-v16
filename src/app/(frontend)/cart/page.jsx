"use client";

import { useAuth } from "@/lib/components/context";
import PriceFormat from "@/lib/components/PriceFormat";
import { Axios } from "@/lib/helpers/AxiosInstance";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { checkoutAction } from "./action";
import SubmitButton from "@/lib/components/SubmitButton";
import Form from "next/form";

export const CartPage = () => {
  let { userInfo, cart, setCart } = useAuth();
  let [selectedCart, setSelectedCart] = useState([]);
  let [loading, setLoading] = useState(false);
  let [gateway, setGateway] = useState("");
  let router = useRouter();
  let path = usePathname();
  // console.log(path);

  //========= cart update auto
  useEffect(() => {
    let cartIdArr = cart?.length && cart.map((item) => item?._id);
    let getUpdatedProducts = async () => {
      try {
        let { data } = await Axios.post(`/api/both/cart`, { cartIdArr });
        setCart(data.products);
        localStorage.setItem("cart", JSON.stringify(data.products));
      } catch (error) {
        console.log(error);
      }
    };
    cart?.length && getUpdatedProducts();
  }, []);

  // let ref1 = useRef()
  let [refList, setRefList] = useState([]);

  let ref1 = useCallback((el) => {
    setRefList((prev) => [...prev, el]);
  }, []);

  // console.log(refList[0]?.id);
  //==========================================================
  let cartItemHandle = (checked, checkedItem) => {
    let all = [...selectedCart];
    if (checked) {
      all.push(checkedItem);
    } else {
      all = all.filter((item) => item._id !== checkedItem._id);
      let one =
        refList?.length &&
        refList.find((item) => item?.id === checkedItem?._id);
      if (one) {
        one.value = "";
      }
    }
    setSelectedCart(all);
  };
  //================================================
  let colorHandle = (id, color) => {
    let findObj =
      selectedCart.length && selectedCart.find((item) => item._id === id);
    if (!findObj) {
      alert("Please select the item first");
      let one = refList?.length && refList?.find((item) => item?.id === id);
      if (one) one.value = "";
      return;
    }
    let tempObj = { ...findObj };
    let sortedColor = tempObj?.color
      ?.slice()
      .sort((a, b) => (b === color) - (a === color));
    tempObj.color = sortedColor;
    let tempArr2 = selectedCart?.filter((item) => item._id !== id);
    tempArr2?.push(tempObj);
    setSelectedCart(tempArr2);
  };
  //==================================================================
  let amountHandle = (id, d) => {
    let isSelected =
      selectedCart.length && selectedCart.find((item) => item._id === id);
    if (!isSelected) return alert("Please select the item first");
    let ind = -1;
    selectedCart.length &&
      selectedCart?.forEach((data, index) => {
        if (data._id === id) ind = index;
      });

    let tempArr = [...selectedCart];
    tempArr[ind].amount += d;
    setSelectedCart([...tempArr]);
  };
  //========================================================
  let totalFrac =
    selectedCart?.length &&
    selectedCart?.reduce((previous, current) => {
      return (
        previous +
        (current?.price - (current?.price * current?.offer) / 100) *
          current.amount
      );
    }, 0);

  let total = Math.round(totalFrac);

  let removeCartItem = (id) => {
    try {
      let isSelected =
        selectedCart?.length && selectedCart.find((item) => item._id === id);
      if (isSelected) {
        return alert("Deselect the item first to remove from cart");
      }
      let index = cart?.findIndex((item) => item._id === id);
      let newCart = [...cart];
      newCart?.splice(index, 1);
      setCart(newCart);
      localStorage.setItem("cart", JSON.stringify(newCart));
    } catch (error) {
      console.log(error);
    }
  };
  //===================================================
  let checkoutBkash = async () => {
    try {
      if (!selectedCart.length)
        return alert("No item has been selected for check out");
      setLoading(true);
      let { data } = await Axios.post(`/api/user/checkout/checkout-bkash`, {
        cart: selectedCart,
        total,
        callbackURL: `/api/user/checkout/bkash-callback`,
      });
      router.push(data?.bkashURL);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  //===================================================

  //============== for ssl
  let checkoutSSL = async () => {
    try {
      if (!selectedCart.length)
        return alert("No item has been selected for check out");
      setLoading(true);
      let { data } = await Axios.post(`/api/user/checkout/checkout-ssl`, {
        cart: selectedCart,
        total,
      });

      console.log(data);
      // router.push(data?.sslcz?.baseURL);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={""}>
      <div className="grid  text-center mb-5">
        <h3>{userInfo?.name ? `Hello ${userInfo?.name}` : "Hello Guest"}</h3>
        <h4 className="">
          {cart?.length
            ? `You have ${cart?.length} items in cart ${
                userInfo?.name ? "" : "Please login to checkout"
              }`
            : "Your cart is empty"}
        </h4>
      </div>
      <hr />
      <div className="grid md:grid-cols-12 mt-5">
        <div className="md:col-span-8 mt-0">
          {cart?.length &&
            cart.map((item, i) => {
              let isSelected = selectedCart?.find((p) => p._id === item?._id);
              item = isSelected ? isSelected : item;
              return (
                <div
                  key={i}
                  className="grid md:grid-cols-12 p-1 mb-2 ms-3 border border-zinc-300"
                >
                  <div className="  md:col-span-5 grid grid-cols-12 ">
                    <div className="col-3  content-center">
                      <div className="w-7">
                        <input
                          type="checkbox"
                          // defaultChecked
                          className="size-5"
                          onChange={(e) =>
                            cartItemHandle(e.target.checked, item)
                          }
                          checked={
                            selectedCart?.length &&
                            selectedCart?.filter((p) => p?._id === item?._id)
                              .length > 0
                          }
                        />
                      </div>
                    </div>
                    <div className="col-span-9">
                      <label htmlFor={item?._id}>
                        <Image
                          priority={true}
                          src={
                            item?.picture &&
                            `${item?.picture.at(0)?.secure_url}`
                          }
                          className="h-50 w-auto"
                          height={190}
                          width={190}
                          alt="image"
                        />
                      </label>
                    </div>
                  </div>
                  <div className=" md:col-span-7 ps-3">
                    <div className="flex flex-col">
                      <div>
                        <h6>Name: {item?.name}</h6>
                        <p>
                          {" "}
                          Price:
                          {
                            <PriceFormat
                              price={
                                item?.price - (item?.price * item?.offer) / 100
                              }
                            />
                          }
                        </p>
                        <p className="m-0">Category: {item?.category?.name} </p>
                        {/* <p
                          className={
                            item?.color?.length ? "m-0 py-2 w-50" : "hidden"
                          }
                        >
                          <select
                            ref={ref1}
                            onChange={(e) => colorHandle(item._id, e)}
                            name=""
                            id={item?._id}
                            className="py-2 border border-black"
                          >
                            <option value={""}>Select Color</option>
                            {item?.color?.length &&
                              item?.color.map((clr) => (
                                <option key={clr} value={clr}>
                                  {clr}
                                </option>
                              ))}
                          </select>
                        </p>*/}
                        <div
                          className={
                            item?.color?.length
                              ? "m-0 py-2 flex gap-4 flex-wrap"
                              : ""
                          }
                        >
                          <p>Color: </p>
                          {item?.color
                            ?.slice()
                            .sort()
                            .map((single, i) => (
                              <button
                                key={i}
                                ref={ref1}
                                type="submit"
                                className={`py-1 px-2 border rounded-md cursor-pointer  ${item?.color?.at(0) === single ? "border-pink-600" : "border-slate-300"}`}
                                onClick={() => {
                                  colorHandle(item._id, single);
                                }}
                              >
                                {single}
                              </button>
                            ))}
                        </div>
                        <div>
                          <span>Quntity: </span>
                          <button
                            type="submit"
                            onClick={() => amountHandle(item._id, -1)}
                            className=" px-3 me-3 btn btn-circle"
                            disabled={item?.amount === 1}
                          >
                            -
                          </button>
                          <span>{item?.amount} </span>
                          <button
                            type="submit"
                            onClick={() => amountHandle(item?._id, 1)}
                            className=" px-3 mx-3 btn btn-circle"
                            disabled={item?.amount === item?.quantity}
                          >
                            +
                          </button>
                        </div>
                        <p className="text-red-400">
                          {item?.amount === item?.quantity
                            ? "Max available quantity reached"
                            : ""}{" "}
                        </p>
                        <p className=" font-bold">
                          Sub-Total:{" "}
                          {
                            <PriceFormat
                              price={
                                (item?.price -
                                  (item?.price * item?.offer) / 100) *
                                item?.amount
                              }
                            />
                          }{" "}
                        </p>{" "}
                      </div>
                      <div className=" mt-auto">
                        <button
                          type="submit"
                          onClick={() => removeCartItem(item._id)}
                          className="btn btn-link mb-2 text-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="md:col-span-4 text-center">
          <h5>Cart Summary</h5>
          <p>Total || Checkout || Payment</p>
          <hr />
          <h2>Total: {<PriceFormat price={total} />}</h2>
          <hr />
          {userInfo?.name ? (
            <>
              <h6>Current Address</h6>
              <p>{userInfo?.address} </p>
              <button
                type="submit"
                onClick={() =>
                  router.push(
                    userInfo?.role === "admin"
                      ? "/dashboard/admin/profile"
                      : "/dashboard/user/profile",
                  )
                }
                className="btn btn-primary"
              >
                Update address
              </button>
            </>
          ) : (
            <div>
              <button
                type="submit"
                onClick={() => router.push(`/user/login?lastPath=${path}`)}
                className="btn btn-indigo"
              >
                Please login to checkout
              </button>
            </div>
          )}
          <div className="">
            <div className="flex ms-20 space-x-3  mt-3">
              <input
                className=" size-5"
                onChange={() => setGateway("bkash")}
                type="radio"
                id="Bkash"
                name="same"
                // checked={user.gender === "Male"}
              />
              <label htmlFor="Bkash"> Bkash</label>
            </div>
            <div className="flex ms-20 space-x-3  mt-3">
              <input
                className=" size-5"
                onChange={() => setGateway("ssl")}
                type="radio"
                id="ssl"
                name="same"
                // checked={user.gender === "Male"}
              />
              <label htmlFor="ssl"> SSL</label>
            </div>
          </div>
          {userInfo && cart?.length && gateway === "ssl" ? (
            <div className="my-4 w-full">
              <Form action={checkoutSSL} className="w-full">
                <div className="mt-3">
                  <SubmitButton
                    title={"Check out (SSL)"}
                    design={"btn-success w-full"}
                  />
                </div>
              </Form>
            </div>
          ) : userInfo && cart?.length && gateway === "bkash" ? (
            <div className="my-4 w-full">
              <Form action={checkoutBkash} className="w-full">
                <div className="mt-3">
                  <SubmitButton
                    title={"Check out (bkash)"}
                    design={"btn-black w-full"}
                  />
                </div>
              </Form>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
};
export default CartPage;
