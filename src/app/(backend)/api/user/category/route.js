import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CategoryModel } from "@/lib/models/categoryModdel";

export async function GET(req) {
  try {
    await dbConnect();

    const catPlain = await CategoryModel.find({});
    return Response.json({ catPlain });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
