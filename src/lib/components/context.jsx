"use client";

import { createContext, use, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Axios } from "@/lib/helpers/AxiosInstance";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { useRouter } from "next/navigation";
import { swalModal } from "@/lib/helpers/swalModal";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(Cookies.get("token"));
  const [catPlain, setCatPlain] = useState([]);
  const [catNested, setCatNested] = useState("");
  const [cart, setCart] = useState([]);
  const [loginExpireTime, setLoginExpireTime] = useState(24 * 60 * 60 * 1000);
  let router = useRouter();

  let getUserInfo = async () => {
    if (token) {
      let tokenData = await getTokenData(token);
      setUserInfo(tokenData?.userInfo);
      setLoginExpireTime(tokenData?.loginExpireTime ?? 24 * 60 * 60 * 1000);
    } else {
      setUserInfo(null);
    }
  };
  let logout = () => {
    Cookies.remove("token");
    setUserInfo(null);
    setToken(null);
    router.refresh("/");
    swalModal("You have been logged out");
  };
  //=================================
  let autoLogout = () => {
    const timeoutId = setTimeout(() => {
      logout();
    }, loginExpireTime - Date.now());

    return () => clearTimeout(timeoutId);
  };
  //==============================
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
  // useEffect(() => {
  //   let storageCart = localStorage.getItem("cart");
  //   if (storageCart) setCart(JSON.parse(storageCart));
  // }, []);

  useEffect(() => {
    let storageCart = localStorage.getItem("cart");
    if (storageCart) setCart(JSON.parse(storageCart));

    token && getUserInfo();
    catPlainFunc();
    autoLogout();
  }, [token, loginExpireTime]);

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
        logout,
      }}
    >
      {children}
    </AuthContext>
  );
};

export const useAuth = () => useContext(AuthContext);
