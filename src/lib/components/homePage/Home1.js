import * as motion from "motion/react-client";

import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Loadmore from "@/lib/components/Loadmore";
import { allProductAction } from "./action";
import Card from "../card/Card";
import HomeCatPage from "./HomeCatPage";
import Link from "next/link";
import { Suspense } from "react";
import Home12 from "./Home12";
import Skeleton from "../Skeleton";

const Home1 = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "30");

  let data = allProductAction(keyword, page, perPage);

  return (
    <div className="p-2">
      <div className="my-3">
        <Form action={"/"}>
          <div className="join">
            <div className="">
              <input
                defaultValue={keyword}
                name="keyword"
                type="search"
                className="input input-bordered join-item"
                placeholder="name or description"
              />
            </div>
            <div className="">
              <button className="btn join-item">Search</button>
            </div>
          </div>
        </Form>
      </div>
      <HomeCatPage />
      <hr />

      <Suspense fallback=<Skeleton />>
        <Home12 searchParams={searchParams} promise={data} />
      </Suspense>
    </div>
  );
};

export default Home1;
