import * as motion from "motion/react-client";

import Pagination from "@/lib/components/pagination";
import Loadmore from "@/lib/components/Loadmore";
import Card from "@/lib/components/card/Card";
import Form from "next/form";

export const generateMetadata = async () => {
  return {
    title: "Offers",
    description: "Offers",
  };
};
const Offers = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "30");

  let res = await fetch(
    `${process.env.BASE_URL}/api/user/offers?keyword=${keyword}&page=${page}&perPage=${perPage}`
  );
  let data = await res.json();
  let entries = data?.list;
  return (
    <div className="p-2">
      <div className="my-3">
        <Form action={`/products/offers`}>
          <div className="join">
            <div className="">
              <input
                defaultValue={keyword}
                name="keyword"
                type="search"
                className="input input-bordered join-item"
                placeholder="Product name"
              />
            </div>
            <div className="">
              <button className="btn join-item">Search</button>
            </div>
          </div>
        </Form>
      </div>
      <h5>Total product found {data?.total} </h5>
      <div className=" grid md:grid-cols-4 gap-6">
        {entries?.length ? (
          entries.map((item) => (
            <motion.div
              key={item._id}
              initial={{ y: 100, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{
                delay: 0.5,
                type: "spring",
                stiffness: 100,
              }}
            >
              <Card item={item} />
            </motion.div>
          ))
        ) : (
          <p>No data found</p>
        )}
      </div>
      {/* <Loadmore
        total={data?.total}
        page={page}
        perPage={perPage}
        spms1="keyword"
        spms1Value={keyword}
      /> */}
      <div className=" mt-3 ">
        <Pagination
          total={data?.total}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
        />{" "}
      </div>
    </div>
  );
};

export default Offers;
