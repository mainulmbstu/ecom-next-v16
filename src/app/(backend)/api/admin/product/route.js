import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import dbConnect from "@/lib/helpers/dbConnect";
import { uploadOnCloudinary } from "@/lib/helpers/cloudinary";
import slugify from "slugify";
import { revalidatePath, revalidateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { ProductModel } from "@/lib/models/productModel";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { UserModel } from "@/lib/models/userModel";
import { getCookieValue } from "@/lib/helpers/getCookieValue";

export async function POST(req) {
  let formData = await req.formData();

  let userInfo = await getTokenData(await getCookieValue("token"));
  let name = formData.get("name");
  let category = formData.get("category");
  let price = formData.get("price");
  let offer = formData.get("offer") || 0;
  let quantity = formData.get("quantity");
  let color = formData.get("color");
  let description = formData.get("description");
  if (!name || !category || !price || !quantity || !description) {
    return Response.json({ message: "All fields are required" });
  }
  let files = formData.getAll("file");
  try {
    await dbConnect();
    let url;
    if (files[0]?.size) {
      url = [];
      for (let file of files) {
        let { secure_url, public_id } = await uploadOnCloudinary(
          file,
          "Product",
        );
        url = [...url, { secure_url, public_id }];
      }
    }

    let cArr = [];
    if (color) {
      cArr = await color.split(",");
    }
    let product = new ProductModel();

    product.name = name;
    product.slug = slugify(name);
    product.category = category;
    product.description = description;
    product.price = price;
    product.quantity = quantity;
    product.user = userInfo?._id;
    if (offer) product.offer = offer;
    if (color) product.color = cArr;
    if (url) product.picture = url;

    await product.save();
    revalidateTag("product-list", { expire: 0 });
    // for immediate update {expire:0}, 'max' for update after refresh or next visit.
    // revalidatePath("/dashboard/admin/create-product", "page");
    // layout means 'path/*'
    // revalidatePath("/post/category/[category]", 'page');  // // page means 'exact path'

    return Response.json({
      success: true,
      message: `Product  created successfully `,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
//=============================
export async function GET(req) {
  let keyword = req.nextUrl.searchParams.get("keyword") || "";
  let catSlug = req.nextUrl.searchParams.get("category");
  let page = req.nextUrl.searchParams.get("page");
  let perPage = req.nextUrl.searchParams.get("perPage");
  let skip = (page - 1) * perPage;
  let keyCat = await CategoryModel.findOne({ slug: catSlug });
  if (keyCat?.parentId) {
    keyCat = await CategoryModel.find({
      $or: [{ _id: keyCat?._id }, { parentId: keyCat?._id }],
    });
  } else {
    let category = await CategoryModel.find({});
    let categoryList = await createCategories(category); // function below
    let filtered = await categoryList.filter(
      (parent) => parent?.slug === catSlug,
    );
    keyCat = getPlainCatList(filtered);
  }
  try {
    await dbConnect();
    const total = await ProductModel.find(
      keyCat?.length
        ? {
            $and: [
              { name: { $regex: keyword, $options: "i" } },
              { category: keyCat },
            ],
          }
        : { name: { $regex: keyword, $options: "i" } },
    );

    const productList = await ProductModel.find(
      keyCat?.length
        ? {
            $and: [
              { name: { $regex: keyword, $options: "i" } },
              { category: keyCat },
            ],
          }
        : { name: { $regex: keyword, $options: "i" } },
    )
      .populate("user", "name email", UserModel)
      .populate("category", "name", CategoryModel)
      // .populate({ path: "category", select: "name email", model: CategoryModel })
      // .populate({ path: "category", select: "-email", model: CategoryModel })
      .skip(skip)
      .limit(perPage)
      .sort({ createdAt: -1 });

    return Response.json({ productList, total: total?.length });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}

let createCategories = async (category, parentId = null) => {
  let categoryList = [];
  let filteredCat;
  if (parentId == null) {
    filteredCat = await category.filter((item) => item.parentId == undefined);
  } else {
    filteredCat = await category.filter((item) => item.parentId == parentId);
  }
  for (let v of filteredCat) {
    categoryList.push({
      _id: v._id,
      name: v.name,
      slug: v.slug,
      user: v.user,
      picture: v.picture,
      parentId: v.parentId,
      updatedAt: v.updatedAt,
      children: await createCategories(category, v._id),
    });
  }
  return categoryList;
};
let getPlainCatList = (filtered, list = []) => {
  for (let v of filtered) {
    list.push(v);
    if (v.children.length > 0) {
      getPlainCatList(v.children, list);
    }
  }
  return list;
};
