"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { ProductModel } from "@/lib/models/productModel";
import { cacheLife, cacheTag } from "next/cache";

//===========================================================
export const allProductAction = async (keyword, page = 1, perPage) => {
  "use cache";
  cacheLife("days");
  cacheTag("product-list");
  let skip = (page - 1) * perPage;
  let limit = page * perPage;
  try {
    await dbConnect();
    // for seach in in poulated item

    // const offerList = await ProductModel.aggregate([
    //   {
    //     $lookup: {
    //       from: "categories",
    //       localField: "category",
    //       foreignField: "_id",
    //       as: "pop",
    //       pipeline: [
    //         {
    //           $project: {
    //             // Specify the fields you want
    //             name: 1,
    //           },
    //         },
    //       ],
    //     },
    //   },
    //   {
    //     $project: {
    //       category: 0, //hide category
    //     },
    //   },
    //   { $unwind: "$pop" },
    //   // Flatten the array to filter individual objects
    //   // { $match: { "pop.name": { $regex: keyword, $options: "i" } } },
    //   {
    //     $match: {
    //       $or: [
    //         { quantity: { $gt: 3 } },
    //         { "pop.name": { $regex: keyword, $options: "i" } },
    //       ],
    //     },
    //   },
    // ])
    //   .limit(limit)
    //   .sort({ createdAt: -1 });
    const offerList = await ProductModel.find({
      offer: { $gt: 0 },
    })
      .populate("category", "name", CategoryModel)
      // .populate({
      //   path: "category",
      //   select: "name user",
      //   model: CategoryModel, //optional
      //   populate: {
      //     path: "user",
      //     model: UserModel, //optional
      //     select: "name",
      //    match:{role:'admin'}  // poulate if only admin
      //
      //   },
      // })
      .limit(limit)
      .sort({ createdAt: -1 });
    let offerIds = offerList?.length ? offerList.map((item) => item._id) : [];

    const total = await ProductModel.find({
      _id: { $nin: keyword ? [] : offerIds },
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        // { user: authIdArr?.length && authIdArr },
      ],
    });
    const list = await ProductModel.find({
      _id: { $nin: keyword ? [] : offerIds },
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        // { user: authIdArr?.length && authIdArr },
      ],
    })
      // .populate({ path: "category", select: "name", model: CategoryModel })
      .populate("category", "name", CategoryModel)
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });
    return {
      success: true,
      offerList: JSON.stringify(offerList),
      list: JSON.stringify(list),
      total: total?.length,
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
