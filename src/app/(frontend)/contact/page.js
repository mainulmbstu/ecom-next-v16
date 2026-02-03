import ContactPage from "./ContactPage";
import moment from "moment";
import Pagination from "@/lib/components/pagination";
import { getMessageAction } from "./action";
import { getTokenData } from "@/lib/helpers/getTokenData";
import { getCookieValue } from "@/lib/helpers/getCookieValue";
import { Suspense } from "react";

export const metadata = {
  title: "Contact",
  description: "Contact page",
};

const Contact = async ({ searchParams }) => {
  let spms = await searchParams;
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "12");
  let userInfo = await getTokenData(await getCookieValue("token"));

  let data = await getMessageAction(page, perPage, userInfo);
  let contacts = JSON.parse(data?.list);
  let data2 = getMessageAction(page, perPage, userInfo);
  return (
    <div className="px-2">
      <Suspense>
        <ContactPage promise={data2} />
      </Suspense>
      <h2 className=" box-decoration-slice bg-linear-to-r from-blue-400 via-yellow-300 to-pink-400">
        Message history
      </h2>
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
                <p>
                  <b>You:</b> ({moment(item?.createdAt).fromNow()},
                  {moment(item?.createdAt).format("DD-MM-YY hh:mm a")})
                </p>
                <p>Message: {item.message} </p>
                <p>
                  Time: ({moment(item?.createdAt).fromNow()},
                  {moment(item?.createdAt).format("DD-MM-YY hh:mm a")})
                </p>

                <hr className=" w-25" />
                {item?.replies &&
                  item?.replies?.reverse().map((rep, i, arr) => {
                    return (
                      <div key={i}>
                        <p className=" font-bold">
                          Reply-{arr?.length - i}: {rep.msg}
                        </p>
                        <p className="">Replied by: {rep.userName}</p>
                        <p>
                          Time: {moment(rep?.date).fromNow()},
                          {moment(rep?.date).format("DD-MM-YY hh:mm a")}
                        </p>
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
          spms1Value={""}
          spms2=""
          spms2Value={""}
        />
      </div>
    </div>
  );
};

export default Contact;
