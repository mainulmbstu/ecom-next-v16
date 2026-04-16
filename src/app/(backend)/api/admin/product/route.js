import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import dbConnect from "@/lib/helpers/dbConnect";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import slugify from "slugify";
import { revalidatePath, revalidateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { ProductModel } from "@/lib/models/productModel";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { UserModel } from "@/lib/models/userModel";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { createNestedCategory } from "@/lib/helpers/createNestedCategory";

export async function POST(req) {
  let formData = await req.formData();

  let { userInfo } = await getTokenData(await getCookieValue("token"));
  let id = formData.get("id");
  let name = formData.get("name");
  let category = formData.get("category");
  let price = formData.get("price");
  let offer = formData.get("offer") || 0;
  let quantity = formData.get("quantity");
  let color = formData.get("color");
  let description = formData.get("description");
  let files = formData.getAll("file");
  try {
    if (!id) {
      if (!name || !category || !price || !quantity || !description) {
        throw new Error("All fields are required");
      }
      await dbConnect();
      let url;
      if (files[0]?.size) {
        url = [];
        for (let file of files) {
          if (file?.size > 3 * 1024 * 1000) {
            throw new Error("File too large, maximum 3 mb`");
          }
          let { secure_url, public_id } = await uploadOnCloudinary(
            file,
            "ecomNext",
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

      return Response.json({
        success: true,
        message: `${name}  created successfully `,
      });
    } else {
      await dbConnect();
      const itemExist = await ProductModel.findById(id);
      if (itemExist?.picture?.at(0)?.public_id) {
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
            "ecomNext",
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

      return Response.json({
        success: true,
        message: `${name}  updated successfully `,
      });
    }
  } catch (error) {
    console.log(error);
    // if u use redirect in try block
    // if (error.message === "NEXT_REDIRECT") throw error;
    return Response.json({ message: await getErrorMessage(error) });
  } finally {
    revalidateTag("product-list", { expire: 0 });
    // for immediate update {expire:0}, 'max' for update after refresh or next visit.
    // revalidatePath("/dashboard/admin/create-product", "page");
    // layout means 'path/*'
    // revalidatePath("/post/category/[category]", 'page');  // // page means 'exact path'
  }
}
//=============================
export async function GET(req) {
  let keyword = req.nextUrl.searchParams.get("keyword") || "";
  let catSlug = req.nextUrl.searchParams.get("category");
  let page = req.nextUrl.searchParams.get("page");
  let perPage = req.nextUrl.searchParams.get("perPage");
  let skip = (page - 1) * perPage;
  let keyCat;

  try {
    await dbConnect();
    keyCat = await CategoryModel.findOne({ slug: catSlug });
    if (keyCat?.parentId) {
      keyCat = await CategoryModel.find({
        $or: [{ _id: keyCat?._id }, { parentId: keyCat?._id }],
      });
    } else {
      let category = await CategoryModel.find({});
      let categoryList = await createNestedCategory(category); // function below

      let filtered = categoryList?.filter((parent) => parent?.slug === catSlug);
      keyCat = getPlainCatList(filtered);
    }

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

let getPlainCatList = (filtered, list = []) => {
  for (let v of filtered) {
    list.push(v);
    if (v.children?.length > 0) {
      getPlainCatList(v.children, list);
    }
  }
  return list;
};
