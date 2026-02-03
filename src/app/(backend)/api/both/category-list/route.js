import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CategoryModel } from "@/lib/models/categoryModdel";

export async function GET(req) {
  let keyword = req.nextUrl.searchParams.get("keyword") || "";
  let page = req.nextUrl.searchParams.get("page");
  let perPage = req.nextUrl.searchParams.get("perPage");
  let skip = (page - 1) * perPage;

  try {
    await dbConnect();
    const total = await CategoryModel.find({
      $or: [{ name: { $regex: keyword, $options: "i" } }],
    });

    const categoryList = await CategoryModel.find({
      $or: [{ name: { $regex: keyword, $options: "i" } }],
    })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    const items = await CategoryModel.find({});

    let nestedItems = await createNestedItems(items);
    return Response.json({
      nestedCategory: nestedItems,
      categoryList,
      total: total?.length,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}

let createNestedItems = async (items, parentId = null) => {
  let itemList = [];
  let filteredItem;
  if (parentId == null) {
    filteredItem = await items.filter((item) => item.parentId == undefined);
  } else {
    filteredItem = await items.filter((item) => item.parentId == parentId);
  }
  for (let v of filteredItem) {
    await itemList.push({
      _id: v._id,
      name: v.name,
      slug: v.slug,
      parentId: v.parentId,
      picture: v.picture,
      user: v.user,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
      children: await createNestedItems(items, v._id),
    });
  }
  // console.log(commentsList);
  return itemList;
};
