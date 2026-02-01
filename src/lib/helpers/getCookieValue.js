import { cookies } from "next/headers";

export const getCookieValue = async (cookieName) => {
  let cookieStore = await cookies();
  const cookie = cookieStore.get(cookieName);
  let value = cookie?.value;
  if (value && cookieName == "userInfo") {
    value = JSON.parse(value);
  }
  return value;
};
