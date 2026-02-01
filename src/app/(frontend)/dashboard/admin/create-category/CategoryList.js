import moment from "moment";
import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@/lib/components/DeleteModal";
import { deleteAction } from "./action";
import EditModal from "./EditModal";
import SubmitButton from "@/lib/components/SubmitButton";

const CategoryList = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "12");

  let res = await fetch(
    `${process.env.BASE_URL}/api/admin/category-list?keyword=${keyword}&page=${page}&perPage=${perPage}`,
    { cache: "force-cache", next: { tags: ["category-list"] } },
  );
  let data = await res.json();
  let entries = data?.categoryList;
  return (
    <div>
      <div className="my-3">
        <Form action={"/dashboard/admin/create-category"}>
          <div className="join">
            <div className="">
              <input
                defaultValue={keyword}
                name="keyword"
                type="search"
                className="input input-bordered join-item"
                placeholder="Search"
              />
            </div>
            <div className="">
              <SubmitButton title={"Search"} design={"btn join-item"} />
            </div>
          </div>
        </Form>
      </div>
      <div className="">
        <h5> Total category: {data?.total} </h5>
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Picture</th>
              <th>Created Date</th>
              <th>Edit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entries?.length ? (
              entries?.map((item) => (
                <tr key={item?._id} className="hover:bg-zinc-200">
                  <td>{item.name}</td>
                  <td>
                    <Link href={item.picture?.secure_url} target="_blank">
                      <Image
                        priority={true}
                        className="w-8 h-auto"
                        width={30}
                        height="0"
                        src={item.picture?.secure_url}
                        alt=""
                      />
                    </Link>
                  </td>

                  <td>
                    {moment(new Date(item.createdAt)).format("DD-MM-YYYY")}
                  </td>
                  <td>
                    <EditModal
                      value={{
                        id: item._id.toString(),
                        name: item.name,
                        parentId: item.parentId,
                        picture: item?.picture?.secure_url,
                        parentName: entries.find(
                          (cat) => cat._id == item.parentId,
                        )?.name,
                      }}
                    />
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

export default CategoryList;
