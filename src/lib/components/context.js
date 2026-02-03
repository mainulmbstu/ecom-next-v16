"use client";

import { createContext, use, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Axios } from "../helpers/AxiosInstance";
import { getTokenData } from "../helpers/getTokenData";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(Cookies.get("token"));
  const [catPlain, setCatPlain] = useState([]);
  const [catNested, setCatNested] = useState("");
  const [cart, setCart] = useState([]);

  let getUserInfo = async () => {
    if (token) {
      let tokenData = await getTokenData(token);
      setUserInfo(tokenData);
    } else {
      setUserInfo(null);
    }
  };
  let catPlainFunc = async () => {
    // let res = await fetch(`/api/both/category-list`, {
    //   cache: "force-cache",
    //   next: { tags: ["category-list"] },
    // });
    // let data = await res.json();
    let { data } = await Axios.get(`/api/both/category-list`);
    setCatPlain(data?.categoryList);
    setCatNested(data?.nestedCategory);
  };
  useEffect(() => {
    let storageCart = localStorage.getItem("cart");
    if (storageCart) setCart(JSON.parse(storageCart));
  }, []);

  useEffect(() => {
    token && getUserInfo();
    catPlainFunc();
  }, [token]);

  return (
    <AuthContext
      value={{
        userInfo,
        setUserInfo,
        getUserInfo,
        setToken,
        catPlain,
        catPlainFunc,
        catNested,
        cart,
        setCart,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => useContext(AuthContext);
