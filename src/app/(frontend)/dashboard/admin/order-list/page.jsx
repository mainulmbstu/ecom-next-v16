import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@/lib/components/DeleteModal";
import { deleteAction } from "./action";
import Status from "./status";
import PriceFormat from "@/lib/components/PriceFormat";
import ClientPage from "./clientPage";
import InfoModal from "./InfoModal";
import RefundModal from "./RefundModal";
import SubmitButton from "@/lib/components/SubmitButton";
import DateSSR2 from "@/lib/components/DateSSR2";
import blurimg from "@/assets/blurr.webp";
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

  // let userList = await userListAction(keyword);
  let res = await fetch(
    `${process.env.BASE_URL}/api/admin/order-list?keyword=${keyword}&page=${page}&perPage=${perPage}`,
    { cache: "force-cache", next: { tags: ["order-list"] } },
  );
  let data = await res.json();
  // let { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
  let entries = data?.orderList;

  return (
    <div>
      <div className="my-3">
        <Form action={"/dashboard/admin/order-list"}>
          <div className="flex">
            <div className="">
              <input
                name="keyword"
                type="search"
                className="input-000"
                placeholder="Phone, Email or Status"
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
                    <th scope="col">User-phone</th>
                    <th scope="col">User-Address</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Method</th>
                    <th scope="col">Item</th>
                    <th scope="col">Total Price</th>
                    <th scope="col">Order Date/Time</th>
                    <th scope="col">Print</th>
                    <th scope="col">Query</th>
                    <th scope="col">Search</th>
                    <th scope="col">Refund</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {entries?.length ? (
                    <tr key={item?._id} className="bg-zinc-100 text-center">
                      <td>
                        <Status status={item.status} id={item._id.toString()} />
                      </td>
                      <td>{item?.user?.email} </td>
                      <td>{item?.user?.phone} </td>
                      <td>{item?.user?.address} </td>
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
                      <td>
                        <ClientPage item={item} />
                      </td>

                      <td>
                        <InfoModal
                          editItem={JSON.stringify(item)}
                          title="query"
                        />
                      </td>
                      <td>
                        <InfoModal
                          editItem={JSON.stringify(item)}
                          title="Search"
                        />
                      </td>

                      <td>
                        <RefundModal
                          editItem={JSON.stringify(item)}
                          title={item.payment?.refund ? "Refunded" : "Refund"}
                        />
                      </td>
                      {/* <td>
                        <RefundModal
                          value={{
                            title: "Refund",
                            amount: item?.total,
                            paymentID: item.payment?.payment_id,
                            trxID: item.payment?.trxn_id,
                            refund: item.payment?.refund,
                          }}
                        />
                      </td>*/}
                      <td>
                        <DeleteModal
                          value={{
                            id: item?._id.toString(),
                            message: `Do you want to delete the order of ${item?.user?.name}, orderId: ${item?._id}`,
                            action: deleteAction,
                          }}
                        />
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
                    <div key={i} className=" g-5 mb-2">
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
        />
      </div>
    </div>
  );
};

export default Orders;
