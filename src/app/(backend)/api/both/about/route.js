import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { uploadOnCloudinary } from "@/lib/helpers/cloudinary";

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
