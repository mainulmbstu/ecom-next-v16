import moment from "moment";
import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import PriceFormat from "@/lib/components/PriceFormat";
import SubmitButton from "@/lib/components/SubmitButton";
import { orderAction } from "./action";

export const metadata = {
  title: "Order List",
  description: "Order List page",
};
const Orders = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "1");
  // let start=(Number(page)-1)*Number(perPage)

  let data = await orderAction(keyword, page, perPage);
  let entries = data?.orderList;

  return (
    <div>
      <div className="my-3">
        <Form action={"/dashboard/user/order-list"}>
          <div className="join">
            <div className="">
              <input
                name="keyword"
                type="search"
                className="input input-bordered join-item"
                placeholder="Status"
              />
            </div>
            <div className="">
              <SubmitButton title={"Search"} design={"btn join-item"} />
            </div>
          </div>
        </Form>
      </div>
      <div className=" card p-2 mt-5">
        <h4>Total Orders: ( {data?.total})</h4>
        {/* <h4>Total Sale: {<PriceFormat price={totalPrice} />}</h4> */}
      </div>
      <div className="">
        {entries?.length &&
          entries?.map((item, i) => (
            <div key={item?._id}>
              <table className="table">
                {/* head */}
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Order Status</th>
                    <th scope="col">User-email</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Method</th>
                    <th scope="col">Item</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Order Date</th>
                  </tr>
                </thead>
                <tbody>
                  {entries?.length ? (
                    <tr className="hover:bg-zinc-200">
                      <td>{i + 1} </td>

                      <td>{item?.status} </td>
                      <td>{item?.user?.email} </td>
                      <td>
                        {item?.payment?.refund === "refunded"
                          ? "Refunded"
                          : item?.payment?.status === true
                          ? "Success"
                          : "Failed"}
                      </td>
                      <td>{item?.payment?.payment_id ? "Bkash" : "SSL"} </td>
                      <td>{item?.products?.length} </td>
                      <td>{<PriceFormat price={item.total} />} </td>
                      <td>
                        {moment(item?.createdAt).format("DD-MM-YY hh:mm a")}{" "}
                      </td>
                    </tr>
                  ) : (
                    <tr>no data found</tr>
                  )}
                </tbody>
              </table>
              {item?.products?.length &&
                item?.products?.map((p, i) => {
                  return (
                    <div key={i} className=" g-5 mb-2 bg-zinc-200">
                      <div className="grid grid-cols-12 g-4">
                        <div className=" col-span-4 flex justify-center">
                          <Link
                            href={`${p?.picture[0]?.secure_url}`}
                            target="_blank"
                          >
                            <Image
                              src={`${p?.picture[0]?.secure_url}`}
                              priority={true}
                              className="w-32 h-auto"
                              width={200}
                              height={0}
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className=" col-span-8 ">
                          <div>
                            <h5>
                              Name: {p?.name}- Price:{" "}
                              {
                                <PriceFormat
                                  price={p?.price - (p?.price * p?.offer) / 100}
                                />
                              }
                            </h5>
                            <p>Category: {p?.category?.name} </p>
                            <p>{`Qnty: ${p?.amount}`}</p>
                            <p>
                              Sub-Total:{" "}
                              {
                                <PriceFormat
                                  price={
                                    (p?.price - (p?.price * p?.offer) / 100) *
                                    p.amount
                                  }
                                />
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
      </div>
      <div className=" mt-3 ">
        <Pagination
          total={data?.total}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
          spms2=""
          spms2Value={""}
        />
      </div>
    </div>
  );
};

export default Orders;
