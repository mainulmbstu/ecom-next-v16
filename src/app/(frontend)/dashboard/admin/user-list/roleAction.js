"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { UserModel } from "@/lib/models/userModel";
import { revalidatePath } from "next/cache";

export const roleAction = async (value, id) => {
  try {
    await dbConnect();
    const userExist = await UserModel.findByIdAndUpdate(
      { _id: id },
      { role: value }
    );
    revalidatePath("/dashboard/admin/user-list");

    return {
      message: `${userExist?.name} has been updated successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
