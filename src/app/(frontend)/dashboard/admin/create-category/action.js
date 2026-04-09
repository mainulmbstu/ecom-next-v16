"use server";

import { deleteImageOnCloudinary } from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { revalidatePath, updateTag } from "next/cache";

//==============================
export const deleteAction = async (id = "") => {
  try {
    await dbConnect();
    const isParent = await CategoryModel.findOne({ parentId: id });
    if (isParent) {
      return {
        message: `It has child category. If you want to delete this, first you have to delete its child category`,
      };
      // throw new Error(
      //   `It has child category. If you want to delete this, first you have to delete its child category`
      // );
    }
    const categoryExist = await CategoryModel.findByIdAndDelete(id);
    categoryExist.picture?.public_id &&
      (await deleteImageOnCloudinary(categoryExist.picture?.public_id));

    return {
      message: `${categoryExist?.name} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  } finally {
    updateTag("category-list");
  }
};
