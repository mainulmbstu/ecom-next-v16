import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import PriceFormat from "@/lib/components/PriceFormat";
import SubmitButton from "@/lib/components/SubmitButton";
import { orderAction } from "./action";
import DateSSR2 from "@/lib/components/DateSSR2";
import { blurDataURL } from "@/lib/helpers/blurData";

export const metadata = {
  title: "Order List",
  description: "Order List page",
};
const Orders = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms?.keyword) ?? "";
  let page = Number((await spms?.page) ?? "1");
  let perPage = Number((await spms?.perPage) ?? "12");
  // let start=(Number(page)-1)*Number(perPage)

  let data = await orderAction(keyword, page, perPage);
  let entries = data?.orderList;

  return (
    <div>
      <div className="my-3">
        <Form action={"/dashboard/user/order-list"}>
          <div className="flex">
            <div className="">
              <input
                name="keyword"
                type="search"
                className="input-000"
                placeholder="Status"
              />
            </div>
            <div className="">
              <SubmitButton title={"Search"} design={"btn btn-search"} />
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
            <div key={item?._id} className={`border border-zinc-300  my-6 `}>
              <table className="w-full border-separate border-spacing-x-0.5 border-spacing-y-1">
                {/* head */}
                <thead>
                  <tr className="bg-base-300 h-10 text-center text-nowrap ">
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
                    <tr key={item?._id} className="bg-zinc-100 text-center">
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
                        <DateSSR2 date={item?.createdAt} time={true} />
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
                    <div key={item?._id}>
                      <div className="grid grid-cols-12 g-4">
                        <div className=" col-span-4 flex justify-center">
                          <Link
                            href={`${p?.picture?.at(0)?.secure_url}`}
                            target="_blank"
                          >
                            <Image
                              src={`${p?.picture?.at(0)?.secure_url}`}
                              blurDataURL={blurDataURL()}
                              placeholder="blur"
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
                            <h6>Name: {p?.name}</h6>
                            <p>
                              Price:
                              {
                                <PriceFormat
                                  price={p?.price - (p?.price * p?.offer) / 100}
                                />
                              }
                            </p>
                            <p>Category: {p?.category?.name} </p>
                            <p className={p?.color?.at(0) ? "" : "hidden"}>
                              Color: {p?.color?.at(0)}{" "}
                            </p>
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
          total={data?.total || 1}
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
