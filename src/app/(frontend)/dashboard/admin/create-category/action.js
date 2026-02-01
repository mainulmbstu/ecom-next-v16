"use server";

import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { revalidatePath, updateTag } from "next/cache";
import slugify from "slugify";

//===========================================================
export const editAction = async (id, formData) => {
  let name = formData.get("name");
  let parentId = formData.get("parentId");
  let file = formData.get("file");

  try {
    await dbConnect();
    const itemExist = await CategoryModel.findById(id);
    if (file?.size) {
      itemExist.picture?.public_id &&
        (await deleteImageOnCloudinary(itemExist.picture?.public_id));
      let { secure_url, public_id } = await uploadOnCloudinary(
        file,
        "ecomNextCategory",
      );
      itemExist.picture = { secure_url, public_id };
    }
    if (name) itemExist.name = name;
    if (name) itemExist.slug = slugify(name);
    itemExist.parentId = parentId || null;

    await itemExist.save();
    // revalidatePath("/", "layout");
    updateTag("category-list");
    return {
      success: true,
      message: `Category ${name} has been Updated successfully`,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

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
    revalidatePath("/", "layout");

    return {
      message: `${categoryExist?.name} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
