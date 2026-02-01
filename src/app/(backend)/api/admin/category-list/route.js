import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CategoryModel } from "@/lib/models/categoryModdel";

export async function GET(req) {
  let keyword = req.nextUrl.searchParams.get("keyword");
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

    return Response.json({ categoryList, total: total?.length });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
