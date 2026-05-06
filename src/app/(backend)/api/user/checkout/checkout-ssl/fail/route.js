import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { redirect } from "next/navigation";

export async function POST(req) {
  let tran_id = req.nextUrl.searchParams.get("tran_id");
  try {
    if (tran_id) {
      await dbConnect();
      let order = await OrderModel.findOne({ "payment.trxn_id": tran_id });
      if (order) {
        if (order.payment.status === "FAILED") {
          await OrderModel.findByIdAndDelete(order._id);
        }
      }
    }
    redirect(`/payment/fail?tran_id=${tran_id || ""}`);
    // return Response.json({ mm: 111111 });
  } catch (error) {
    // if u use redirect in try block
    if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
