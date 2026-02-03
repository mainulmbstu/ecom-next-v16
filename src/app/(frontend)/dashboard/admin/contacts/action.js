"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { ContactModel, ContactReplyModel } from "@/lib/models/ContactModel";
import { cacheTag, revalidatePath, updateTag } from "next/cache";
import { getCookieValue } from "@/lib/helpers/getCookieValue";

//===========================================================
export const getAllAction = async (keyword, page = 1, perPage) => {
  "use cache";
  cacheTag("contacts");
  let skip = (page - 1) * perPage;
  let editKey = keyword === "unread" ? "" : keyword;
  try {
    await dbConnect();
    const total = await ContactModel.find({
      email: { $regex: editKey, $options: "i" },
    });

    const list = await ContactModel.find({
      email: { $regex: editKey, $options: "i" },
    })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });
    let unread =
      list?.length && list.filter((item) => item?.replies?.length === 0);
    return {
      list:
        keyword === "unread" ? JSON.stringify(unread) : JSON.stringify(list),
      total: keyword === "unread" ? unread?.length : total?.length,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

//=====================================
export const replyAction = async (cid, formData) => {
  let reply = formData.get("reply");
  let userInfo = await getTokenData(await getCookieValue("token"));
  try {
    await dbConnect();
    let findmsg = await ContactModel.findById(cid);
    await ContactReplyModel.create({
      email: findmsg?.email,
      reply,
      msgId: findmsg?._id,
      user: userInfo?._id,
    });
    let destructure = [...findmsg.replies];
    findmsg.replies = [
      ...destructure,
      { userName: userInfo?.name, msg: reply, date: Date.now() },
    ];
    await findmsg.save();
    // revalidatePath("/", "layout");
    updateTag("contacts");
    return { success: true, message: "Replied successfully" };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
