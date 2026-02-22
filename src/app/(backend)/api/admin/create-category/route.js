import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import dbConnect from "@/lib/helpers/dbConnect";
import { uploadOnCloudinary } from "@/lib/helpers/cloudinary";
import slugify from "slugify";
import { revalidatePath, revalidateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { getCookieValue } from "@/lib/helpers/getCookieValue";

export async function POST(req) {
  let formData = await req.formData();

  let userInfo = await getTokenData(await getCookieValue("token"));
  let name = formData.get("name");
  let parentId = formData.get("parentId") || null;
  if (!name) {
    return Response.json({ message: "Name is required" });
  }
  let file = formData.get("file");
  try {
    await dbConnect();
    const categoryExist = await CategoryModel.findOne({
      slug: slugify(name.toLowerCase()),
    });
    if (categoryExist) {
      return Response.json({ message: "Name is already exist" });
    }
    let url;
    if (file?.size) {
      if (file?.size > 3 * 1024 * 1000) {
        return {
          success: false,
          message: `File too large, maximum 3 mb`,
        };
      }
      let { secure_url, public_id } = await uploadOnCloudinary(
        file,
        "category",
      );
      url = { secure_url, public_id };
    }
    await CategoryModel.create({
      name,
      parentId,
      slug: slugify(name),
      user: userInfo?._id,
      picture: url && url,
    });
    revalidateTag("category-list", { expire: 0 });
    // for immediate update {expire:0}, 'max' for update after refresh or next visit.
    // revalidatePath("/", "layout");
    // revalidatePath("/dashboard/admin/create-category");
    // layout means 'path/*'
    // revalidatePath("/post/category/[category]", 'page');  // // page means 'exact path'

    return Response.json({
      success: true,
      message: `Category  created successfully `,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
