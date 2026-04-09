import { NextRequest, NextResponse } from "next/server";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import dbConnect from "@/lib/helpers/dbConnect";
import {
  deleteImageOnCloudinary,
  uploadOnCloudinary,
} from "@/lib/helpers/cloudinary";
import slugify from "slugify";
import { revalidatePath, revalidateTag } from "next/cache";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { getCookieValue } from "@/lib/helpers/getCookieValue";

export async function POST(req) {
  let formData = await req.formData();
  let id = formData.get("id");
  let name = formData.get("name");
  let parentId = formData.get("parentId") || null;
  let file = formData.get("file");
  let userInfo = await getTokenData(await getCookieValue("token"));
  try {
    if (!id) {
      if (!name) {
        throw new Error("Name is required");
      }
      await dbConnect();
      const categoryExist = await CategoryModel.findOne({
        slug: slugify(name.toLowerCase()),
      });
      if (categoryExist) {
        throw new Error("Name is already exist");
      }
      let url;
      if (file?.size) {
        if (file?.size > 3 * 1024 * 1000) {
          throw new Error("File too large, maximum 3 mb`");
        }
        let { secure_url, public_id } = await uploadOnCloudinary(
          file,
          "ecomNext",
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

      return Response.json({
        success: true,
        message: `Category ${name} has been created successfully`,
      });
    } else {
      await dbConnect();
      const itemExist = await CategoryModel.findById(id);
      if (file?.size) {
        itemExist.picture?.public_id &&
          (await deleteImageOnCloudinary(itemExist.picture?.public_id));
        let { secure_url, public_id } = await uploadOnCloudinary(
          file,
          "ecomNext",
        );
        itemExist.picture = { secure_url, public_id };
      }
      if (name) itemExist.name = name;
      if (name) itemExist.slug = slugify(name);
      itemExist.parentId = parentId || null;
      await itemExist.save();

      return Response.json({
        success: true,
        message: `Category ${name} has been Updated successfully`,
      });
    }
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  } finally {
    revalidateTag("category-list", { expire: 0 });
    // for immediate update {expire:0}, 'max' for update after refresh or next visit.
    // revalidatePath("/", "layout");
    // revalidatePath("/dashboard/admin/create-category");
    // layout means 'path/*'
    // revalidatePath("/post/category/[category]", 'page');  // // page means 'exact path'
  }
}
