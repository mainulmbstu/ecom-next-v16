"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { revalidatePath, updateTag } from "next/cache";

export const deleteAction = async (id = "") => {
  try {
    await dbConnect();
    const itemExist = await OrderModel.findByIdAndDelete(id);
    // revalidatePath("/", "layout");
    updateTag("order-list");

    return {
      message: `${itemExist?._id} order has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
