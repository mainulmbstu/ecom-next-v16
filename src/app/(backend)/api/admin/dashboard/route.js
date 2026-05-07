import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";

export async function POST(req) {
  let { startDate, endDate } = await req.json();
  try {
    let sdate = new Date(startDate);
    let edate = new Date(endDate);

    let todayFull = new Date();
    let todayShort = todayFull.toDateString();
    let today = new Date(todayShort);
    let todayNow = new Date();

    await dbConnect();
    const orders = await OrderModel.find({
      createdAt: { $gte: sdate, $lte: edate },
      "payment.status": { $ne: "refunded" },
    });
    const dateTotalProds = await OrderModel.find({
      createdAt: { $gte: sdate, $lte: edate },
      "payment.status": { $ne: "refunded" },
    }).select({ total: 1, charge: 1, createdAt: 1, products: 1 });
    const dateTotalProdsRefund = await OrderModel.find({
      createdAt: { $gte: sdate, $lte: edate },
      "payment.status": "refunded",
    }).select({ total: 1, charge: 1, createdAt: 1, products: 1 });
    //==========================
    // total product list
    let list = [];
    orders.forEach((item) => {
      for (let v of item.products) {
        list.push(v);
      }
    });
    //===== top 5 products
    let result = {};
    list.forEach((item) => {
      result[item.name] =
        (result[item.name] || 0) +
        (item.price - (item.price * item.offer) / 100);
    });
    let resultArr = [];
    for (let k in result) {
      resultArr.push({ name: k, totalSale: result[k] });
    }
    let topProds = resultArr
      .sort((a, b) => {
        return b.totalSale - a.totalSale;
      })
      .slice(0, 5);
    //==============
    const ordersToday = await OrderModel.find({
      createdAt: { $gte: today, $lte: todayNow },
      "payment.status": { $ne: "refunded" },
    });
    let totalSaleToday =
      ordersToday?.length &&
      ordersToday.reduce((previous, current) => {
        return previous + current.total - current?.charge;
      }, 0);

    let totalSale =
      orders?.length &&
      orders.reduce(
        (previous, current) => previous + current.total - current?.charge,
        0,
      );

    if (!totalSale || totalSale?.length === 0) {
      return Response.json({ msg: "No data found" });
    }

    return Response.json({
      dateTotalProds,
      dateTotalProdsRefund,
      topProds,
      totalSaleToday,
      totalSale,
      success: true,
    });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
