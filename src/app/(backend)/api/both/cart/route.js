import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CategoryModel } from "@/lib/models/categoryModdel";
import { ProductModel } from "@/lib/models/productModel";

export async function POST(req) {
  let { cartIdArr } = await req.json();

  try {
    await dbConnect();
    let products = [];
    if (cartIdArr?.length) {
      for (let v of cartIdArr) {
        const prod = await ProductModel.findById(v).populate(
          "category",
          "name",
          CategoryModel
        );
        prod && products.push(prod);
      }
    }
    return Response.json({ products });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
