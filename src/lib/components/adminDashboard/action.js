"use server";

import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { OrderModel } from "@/lib/models/OrderModel";
import { ProductModel } from "@/lib/models/productModel";

//==============================
export const totalAction = async (startDate, endDate) => {
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
    });
    const dateTotalProds = await OrderModel.find({
      createdAt: { $gte: sdate, $lte: edate },
    }).select({ total: 1, createdAt: 1, products: 1 });
    //==========================
    // total product list
    let list = [];
    orders.map((item) => {
      for (let v of item.products) {
        list.push(v);
      }
    });
    //===== top 5 products
    let result = {};
    list.map((item) => {
      result[item.name] = (result[item.name] || 0) + item.price;
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
    });
    let totalSaleToday =
      ordersToday?.length &&
      ordersToday.reduce((previous, current) => {
        return previous + current.total;
      }, 0);

    let totalSale =
      orders?.length &&
      orders.reduce((previous, current) => previous + current.total, 0);

    if (!totalSale || totalSale?.length === 0) {
      return { msg: "No data found" };
    }
    return {
      data: {
        dateTotalProds,
        topProds,
        totalSaleToday,
        totalSale,
        success: true,
      },
    };
  } catch (error) {
    console.log(error);
    return { message: await getErrorMessage(error) };
  }
};
