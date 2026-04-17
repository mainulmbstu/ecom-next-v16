import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@/lib/components/DeleteModal";
import { deleteAction } from "./action";
import SubmitButton from "@/lib/components/SubmitButton";
import CategoryModal from "./CategoryModal";
import DateSSR2 from "@/lib/components/DateSSR2";

const CategoryList = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms?.keyword) ?? "";
  let page = Number((await spms?.page) ?? "1");
  let perPage = Number((await spms?.perPage) ?? "12");

  let res = await fetch(
    `${process.env.BASE_URL}/api/admin/category-list?keyword=${keyword}&page=${page}&perPage=${perPage}`,
    {
      cache: "force-cache",
      next: { tags: ["category-list"] },
    },
  );
  let data = await res.json();
  let entries = data?.categoryList;
  return (
    <div>
      <div className="my-3">
        <Form action={"/dashboard/admin/create-category"}>
          <div className="flex">
            <div className="">
              <input
                defaultValue={keyword}
                name="keyword"
                type="search"
                className="input-000"
                placeholder="Search"
              />
            </div>
            <div className="">
              <SubmitButton title={"Search"} design={"btn btn-search"} />
            </div>
          </div>
        </Form>
      </div>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <h5> Total category: {data?.total} </h5>
        <table className="w-full border-separate border-spacing-x-0.5 border-spacing-y-1">
          {/* head */}
          <thead>
            <tr className="bg-base-300 py-2 h-10 text-center">
              <th>Category Name</th>
              <th>Picture</th>
              <th>Created Date</th>
              <th>Edit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-base-100">
            {entries?.length ? (
              entries?.map((item) => (
                <tr key={item?._id} className="hover:bg-zinc-300 text-center">
                  <td>{item.name}</td>
                  <td>
                    <Link href={item.picture?.secure_url} target="_blank">
                      <Image
                        priority={true}
                        className="w-8 h-auto mx-auto"
                        width={30}
                        height="0"
                        src={item.picture?.secure_url}
                        alt=""
                      />
                    </Link>
                  </td>

                  <td>
                    <DateSSR2 date={item.createdAt} />
                  </td>
                  <td>
                    <CategoryModal editItem={JSON.stringify(item)} />
                  </td>

                  <td>
                    <DeleteModal
                      value={{
                        id: item?._id.toString(),
                        message: `Do you want to delete ${item?.name}`,
                        action: deleteAction,
                      }}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div className=" mt-3 ">
        <Pagination
          total={data?.total || 1}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
        />{" "}
      </div>
    </div>
  );
};

export default CategoryList;
