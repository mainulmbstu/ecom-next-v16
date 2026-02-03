"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { ContactModel } from "@/lib/models/ContactModel";
import { cacheLife, revalidatePath, updateTag } from "next/cache";

//===========================================================
export const contactAction = async (formData) => {
  let name = formData.get("name");
  let email = formData.get("email");
  let message = formData.get("message");
  try {
    await dbConnect();
    await ContactModel.create({ name, email, message });
    // revalidatePath("/", "layout");
    updateTag("contacts");
    return {
      success: true,
      message: `message has been sent successfully`,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//===========================================================
export const getMessageAction = async (page = 1, perPage, userInfo) => {
  "use cache";
  cacheLife("days");
  let skip = (page - 1) * perPage;
  try {
    // let userInfo = await getTokenData(await getCookieValue("token"));
    await dbConnect();
    const total = await ContactModel.find({ email: userInfo?.email });
    const list = await ContactModel.find({ email: userInfo?.email })
      .skip(skip)
      .limit(perPage)
      .sort({ updatedAt: -1 });
    return { list: JSON.stringify(list), total: total?.length };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
