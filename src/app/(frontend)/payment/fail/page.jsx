import dbConnect from "@/lib/helpers/dbConnect";
import { OrderModel } from "@/lib/models/OrderModel";
import Link from "next/link";

const PaymentFail = async ({ searchParams }) => {
  let spms = await searchParams;
  let tran_id = (await spms?.tran_id) ?? "";

  if (tran_id) {
    await dbConnect();
    let order = await OrderModel.findOne({ "payment.trxn_id": tran_id });
    if (order) {
      if (order.payment.status === "FAILED") {
        await OrderModel.findByIdAndDelete(order._id);
      }
    }
  }
  return (
    <div className=" text-center mt-5 bg-red-500  mx-auto p-4 text-white">
      <h2> Sorry payment failed</h2>
      <h4>Your order has been canceled</h4>
      <Link className=" bg-white p-1 text-blue-700 underline" href={"/cart"}>
        Try again
      </Link>
    </div>
  );
};

export default PaymentFail;
