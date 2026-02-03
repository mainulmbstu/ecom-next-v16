import * as motion from "motion/react-client";

import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Loadmore from "@/lib/components/Loadmore";
import Card from "@/lib/components/card/Card";
import SubCat from "./SubCat";

export const generateMetadata = async ({ params }) => {
  let { slug } = await params;
  return {
    title: slug,
    description: slug,
  };
};
const CategoryPage = async ({ params, searchParams }) => {
  let { slug } = await params;
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "30");

  let res = await fetch(
    `${process.env.BASE_URL}/api/admin/product?keyword=${keyword}&category=${slug}&page=${page}&perPage=${perPage}`,
    {
      cache: "force-cache",
      next: { tags: ["product-list"] },
    },
  );
  let data = await res.json();
  let entries = data?.productList;
  return (
    <div className="p-2">
      <div className={slug === "all-categories" ? "hidden" : "my-3"}>
        <Form action={`/products/category/${slug} `}>
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
      <SubCat slug={slug} />
      <div className={slug === "all-categories" ? "hidden" : "'"}>
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

export default CategoryPage;
