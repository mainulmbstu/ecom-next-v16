import * as motion from "motion/react-client";

import Form from "next/form";
import { allProductAction } from "./action";
import HomeCatPage from "./HomeCatPage";
import { Suspense } from "react";
import Home12 from "./Home12";
import Skeleton from "../Skeleton";

const Home1 = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms?.keyword) ?? "";
  let page = Number((await spms?.page) ?? "1");
  let perPage = Number((await spms?.perPage) ?? "30");

  let data = allProductAction(keyword, page, perPage);

  return (
    <div className="p-2">
      <div className="my-3">
        <Form action={"/"}>
          <div className="flex">
            <div className="">
              <input
                defaultValue={keyword}
                name="keyword"
                type="search"
                className=" input-000"
                placeholder="name or description"
              />
            </div>
            <div className="">
              <button type="submit" className=" btn  btn-search">
                Search
              </button>
            </div>
          </div>
        </Form>
      </div>
      <HomeCatPage />

      <Suspense fallback=<Skeleton />>
        <Home12 searchParams={searchParams} promise={"data"} />
      </Suspense>
    </div>
  );
};

export default Home1;
