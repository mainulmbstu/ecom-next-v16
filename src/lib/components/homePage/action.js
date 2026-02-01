"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { ProductModel } from "@/lib/models/productModel";

//===========================================================
export const allProductAction = async (keyword, page = 1, perPage) => {
  let skip = (page - 1) * perPage;
  // let limit = page * perPage;
  try {
    await dbConnect();
    // let author = await UserModel.find({
    //   name: { $regex: keyword, $options: "i" },
    // });
    // let authIdArr = author?.length && (await author.map((item) => item._id));
    const offerList = await ProductModel.find({
      offer: { $gt: 0 },
    })
      .populate("category", "name", CategoryModel)
      .limit(7)
      .sort({ createdAt: -1 });
    let offerIds = offerList?.length && offerList.map((item) => item._id);

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
    return { offerList, list, total: total?.length };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
