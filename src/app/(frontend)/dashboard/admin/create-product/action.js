"use server";

import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { ProductModel } from "@/lib/models/productModel";
import { revalidatePath, updateTag } from "next/cache";
import slugify from "slugify";

//===========================================================
export const editAction = async (id, formData) => {
  let name = formData.get("name");
  let category = formData.get("category");
  let price = formData.get("price");
  let offer = formData.get("offer");
  let quantity = formData.get("quantity");
  let color = formData.get("color");
  let description = formData.get("description");
  let files = formData.getAll("file");
  try {
    await dbConnect();
    const itemExist = await ProductModel.findById(id);
    if (itemExist.picture[0]?.public_id) {
      for (let pic of itemExist.picture) {
        await deleteImageOnCloudinary(pic?.public_id);
      }
    }
    let url;
    if (files[0]?.size) {
      url = [];
      for (let file of files) {
        let { secure_url, public_id } = await uploadOnCloudinary(
          file,
          "ecomNextProduct",
        );
        url = [...url, { secure_url, public_id }];
      }
    }
    let cArr = [];
    if (color) {
      cArr = await color.split(",");
    }
    if (name) itemExist.name = name;
    if (name) itemExist.slug = slugify(name);
    if (category) itemExist.category = category;
    if (price) itemExist.price = price;
    if (offer) itemExist.offer = offer;
    if (quantity) itemExist.quantity = quantity;
    if (color) itemExist.color = cArr;
    if (description) itemExist.description = description;
    if (url) itemExist.picture = url;

    await itemExist.save();
    // revalidatePath("/", "layout");
    updateTag("product-list");
    return {
      success: true,
      message: `Product Updated successfully`,
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

    const itemExist = await ProductModel.findByIdAndDelete(id);
    if (itemExist.picture[0]?.public_id) {
      for (let pic of itemExist.picture) {
        await deleteImageOnCloudinary(pic?.public_id);
      }
    }
    // revalidatePath("/", "layout");
    updateTag("product-list");

    return {
      message: `${itemExist?.name} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

//==============================
export const offerAction = async (selectIdArr, formData) => {
  let offer = formData.get("offer");
  try {
    await dbConnect();
    for (let id of selectIdArr) {
      await ProductModel.findByIdAndUpdate(id, { offer }, { new: true });
    }

    // revalidatePath("/", "layout");
    updateTag("product-list");

    return {
      message: `${offer} percent offer has been applied successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
