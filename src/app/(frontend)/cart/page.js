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

  let cartItemHandle = (checked, checkedItem) => {
    let all = [...selectedCart];
    if (checked) {
      all.push(checkedItem);
    } else {
      all = all.filter((item) => item._id !== checkedItem._id);
      let one =
        refList?.length &&
        refList.find((item) => item?.id === checkedItem?._id);
      one.value = "";
    }
    setSelectedCart(all);
  };

  let colorHandle = (id, e) => {
    let findObj =
      selectedCart.length && selectedCart.find((item) => item._id === id);
    if (!findObj) {
      alert("Please select the item first");
      let one = refList?.length && refList.find((item) => item?.id === id);
      return (one.value = "");
    }
    let tempObj = { ...findObj };
    tempObj.color = [e.target.value];
    let tempArr2 = selectedCart.filter((item) => item._id !== id);
    tempArr2.push(tempObj);
    setSelectedCart(tempArr2);
  };

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
                          className="checkbox checkbox-success"
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
                            item?.picture && `${item?.picture[0]?.secure_url}`
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
                        <h5>
                          Name: {item?.name}, Price:{" "}
                          {
                            <PriceFormat
                              price={
                                item?.price - (item?.price * item?.offer) / 100
                              }
                            />
                          }
                        </h5>
                        <p className="m-0">Category: {item?.category?.name} </p>
                        <p
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
                        </p>
                        <div>
                          <button
                            onClick={() => amountHandle(item._id, -1)}
                            className=" px-3 me-3 btn btn-secondary"
                            disabled={item?.amount === 1}
                          >
                            -
                          </button>
                          <span>{item?.amount} </span>
                          <button
                            onClick={() => amountHandle(item?._id, 1)}
                            className=" px-3 mx-3 btn btn-secondary"
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
                          onClick={() => removeCartItem(item._id)}
                          className="btn btn-secondary mb-2"
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
          <h4>Cart Summary</h4>
          <p>Total || Checkout || Payment</p>
          <hr />
          <h2>Total: {<PriceFormat price={total} />}</h2>
          <hr />
          {userInfo?.name ? (
            <>
              <h4>Current Address</h4>
              <h5>{userInfo?.address} </h5>
              <button
                onClick={() =>
                  router.push(
                    userInfo?.role == "admin"
                      ? "/dashboard/admin/profile"
                      : "/dashboard/user/profile",
                  )
                }
                className="btn btn-success"
              >
                Update address
              </button>
            </>
          ) : (
            <div>
              <button
                onClick={() => router.push(`/user/login?lastPath=${path}`)}
                className="btn btn-primary"
              >
                Please login to checkout
              </button>
            </div>
          )}
          <div className="">
            <div className="flex w-30">
              <input
                className=""
                onChange={() => setGateway("bkash")}
                type="radio"
                name="same"
                // checked={user.gender === "Male"}
              />
              Bkash
            </div>
            <div className="flex w-26 mt-3">
              <input
                className=""
                onChange={() => setGateway("ssl")}
                type="radio"
                name="same"
                // checked={user.gender === "Male"}
              />
              SSL
            </div>
          </div>
          {userInfo && cart?.length && gateway == "ssl" ? (
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
          ) : userInfo && cart?.length && gateway == "bkash" ? (
            <div className="my-4 w-full">
              <Form action={checkoutBkash} className="w-full">
                <div className="mt-3">
                  <SubmitButton
                    title={"Check out (bkash)"}
                    design={"btn-neutral w-full"}
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
