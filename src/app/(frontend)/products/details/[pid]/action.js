"use server";

import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CommentModel } from "@/lib/models/CommentModel";
import { LikeModel } from "@/lib/models/LikeModel";
import { revalidatePath } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { ProductModel } from "@/lib/models/productModel";
import { RatingModel } from "@/lib/models/RatingModel";
import { getCookieValue } from "@/lib/helpers/getCookieValue";

export const detailsAction = async (pid) => {
  try {
    await dbConnect();
    const item = await ProductModel.findById(pid).populate("category", "name");
    // item.rating = item.rating.toFixed(1);
    return { details: item };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//===========================
export const similarItemsAction = async (pid) => {
  try {
    await dbConnect();
    const item = await ProductModel.findById(pid);
    const similarItems = await ProductModel.find({
      category: item?.category,
      _id: { $ne: pid },
    })
      .populate("category", "name")
      .limit(12)
      .sort({ updatedAt: -1 });

    return { similarItems };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//===========================
export const likeStatusAction = async (pid) => {
  let userInfo = await getTokenData(await getCookieValue("token"));

  try {
    await dbConnect();
    const like = await LikeModel.findOne({
      product: pid,
      user: userInfo?._id,
    });
    return like;
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//================================
export const likeAction = async (pid) => {
  let userInfo = await getTokenData(await getCookieValue("token"));
  try {
    await dbConnect();
    if (!pid) {
      return { message: "pid is required" };
    }

    await LikeModel.create({
      product: pid,
      status: true,
      user: userInfo?._id,
    });

    let item = await ProductModel.findById(pid);
    item.like = item?.like + 1;
    await item.save();
    revalidatePath("/", "layout");
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

//=====================================
export const commentAction = async (pid, comment) => {
  let userInfo = await getTokenData(await getCookieValue("token"));

  try {
    await dbConnect();
    let comm = new CommentModel();
    comm.product = pid;
    comm.comment = comment;
    comm.user = userInfo?._id;
    await comm.save();
    let item = await ProductModel.findById(pid);
    item.review = item?.review + 1;
    await item.save();
    revalidatePath("/", "layout");
    return { success: true, message: "Commented successfully" };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};

//=====================================
export const ratingAction = async (pid, rating) => {
  let userInfo = await getTokenData(await getCookieValue("token"));

  try {
    await dbConnect();
    await RatingModel.create({
      product: pid,
      rating,
      user: userInfo?._id,
    });
    let item = await ProductModel.findById(pid);
    let calRating =
      (item?.rating * item?.ratingNo + rating) / (item?.ratingNo + 1);
    item.rating = calRating.toFixed(1);
    item.ratingNo = item?.ratingNo + 1;
    await item.save();
    revalidatePath("/", "layout");
    return { success: true, message: "Rated successfully" };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
//===========================================================
export const deletePostAction = async (id = "") => {
  try {
    await dbConnect();
    const post = await ProductModel.findByIdAndDelete(id);
    post.picture?.public_id &&
      (await deleteImageOnCloudinary(post.picture?.public_id));
    await LikeModel.deleteMany({ post: id });
    await CommentModel.deleteMany({ post: id });
    revalidatePath("/", "layout");

    return {
      message: `${post?.title} has been deleted successfully`,
      success: true,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
