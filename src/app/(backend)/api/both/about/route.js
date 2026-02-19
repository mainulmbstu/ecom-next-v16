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

  let file = formData.get("file");
  try {
    // let url;
    // if (file?.size) {
    //   let { secure_url, public_id } = await uploadOnCloudinary(
    //     file,
    //     "category",
    //   );
    //   url = { secure_url, public_id };
    // }
    let url;
    if (file?.size) {
      let { secure_url, public_id } = await uploadOnCloudinary(
        file,
        "videotest",
      );
      url = { secure_url, public_id };
    }

    return Response.json({
      success: true,
      message: `Uploaded successfully `,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
