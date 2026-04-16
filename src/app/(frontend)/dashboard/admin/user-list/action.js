"use server";

import { deleteImageOnCloudinary } from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import { revalidatePath, updateTag } from "next/cache";

export const roleAction = async (value, id) => {
  try {
    await dbConnect();
    const userExist = await UserModel.findByIdAndUpdate(
      { _id: id },
      { role: value },
    );
    // revalidatePath("/dashboard/admin/user-list");
    updateTag("user-list");

    return {
      message: `${userExist?.name} has been updated to ${value} successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//=======================================
export const deleteAction = async (id = "") => {
  try {
    await dbConnect();
    const userExist = await UserModel.findByIdAndDelete(id);
    userExist.picture?.public_id &&
      (await deleteImageOnCloudinary(userExist.picture?.public_id));
    // revalidatePath("/dashboard/admin/user-list");
    updateTag("user-list");

    return {
      message: `${userExist?.name} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
