"use server";

import { deleteImageOnCloudinary } from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import { revalidatePath } from "next/cache";

export const deleteAction = async (id = "") => {
  try {
    await dbConnect();
    const userExist = await UserModel.findByIdAndDelete(id);
    userExist.picture?.public_id &&
      (await deleteImageOnCloudinary(userExist.picture?.public_id));
    revalidatePath("/dashboard/admin/user-list");

    return {
      message: `${userExist?.name} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
