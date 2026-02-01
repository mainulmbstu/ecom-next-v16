import { Axios } from "@/lib/helpers/AxiosInstance";
import moment from "moment";
import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import ReplyModal from "./ReplyModal";
import { getAllAction } from "./action";

export const metadata = {
  title: "Contact",
  description: "Contact page",
};

const Contact = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "12");
  // let userInfo = await getTokenData(await getCookieValue("token"));

  let data = await getAllAction(keyword, page, perPage);
  let contacts = data?.list;
  let unread =
    contacts?.length && contacts.filter((item) => item?.replies?.length === 0);

  return (
    <div>
      <div className="flex">
        <div className="my-3">
          <Form action={"/dashboard/admin/contacts"}>
            <div className="join">
              <div className="">
                <input
                  name="keyword"
                  type="search"
                  className="input input-bordered join-item"
                  placeholder="email"
                />
              </div>
              <div className="">
                <SubmitButton title={"Search"} design={"btn join-item"} />
              </div>
            </div>
          </Form>
        </div>
        <div className="my-3">
          <Form action={"/dashboard/admin/contacts"}>
            <div className="join">
              <div className="hidden">
                <input
                  name="keyword"
                  type="search"
                  defaultValue="unread"
                  className="input input-bordered join-item"
                  placeholder="email"
                />
              </div>
              <div className="">
                <SubmitButton
                  title={"Unread Only"}
                  design={"btn btn-error join-item"}
                />
              </div>
            </div>
          </Form>
        </div>
      </div>

      <div>
        <h3>Total Messages: {data?.total} </h3>
        <h3 className=" text-red-500">
          Total Unread Messages: {unread?.length}{" "}
        </h3>
      </div>
      <div>
        {contacts?.length &&
          contacts.map((item, i) => {
            return (
              <div
                key={item._id}
                className={` border p-2 px-3 ${
                  i % 2 ? " bg-zinc-200" : "bg-white"
                }`}
              >
                <h5>
                  Name: {item.name} ({moment(item?.createdAt).fromNow()},
                  {moment(item?.createdAt).format("DD-MM-YY hh:mm a")})
                </h5>
                <p>email: {item.email} </p>
                <p>Message: {item.message} </p>
                <ReplyModal
                  cid={item?._id.toString()}
                  name={item?.name}
                  title={item?.replies?.length ? "Replied" : "Reply"}
                  design={item?.replies?.length ? "btn-success" : "btn-error"}
                />
                <hr className=" w-25" />
                <h5> Replies of this message: {item?.replies?.length}</h5>
                {item?.replies &&
                  item?.replies?.reverse().map((rep, i, arr) => {
                    return (
                      <div key={i} className="mb-2">
                        <p className=" font-bold">
                          Reply-{arr?.length - i}: {rep.msg}
                        </p>
                        <p className="">Replied by: {rep.userName}</p>
                        <p>
                          Time: {moment(rep?.date).fromNow()} ,
                          {moment(rep?.date).format("DD-MM-YY hh:mm a")})
                        </p>
                        <hr className=" outline-dashed w-40" />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
      <div className=" mt-3 ">
        <Pagination
          total={data?.total}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
          spms2="userId"
          spms2Value={""}
        />
      </div>
    </div>
  );
};

export default Contact;
