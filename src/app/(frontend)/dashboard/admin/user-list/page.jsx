import moment from "moment";
import Pagination from "@/lib/components/pagination";
import Form from "next/form";
import Role from "./role";
import Image from "next/image";
import Link from "next/link";
import DeleteModal from "@/lib/components/DeleteModal";
import { deleteAction } from "./action";
import SubmitButton from "@/lib/components/SubmitButton";
import blurimg from "@/assets/blurr.webp";
import DateSSR2 from "@/lib/components/DateSSR2";

export const metadata = {
  title: "User List",
  description: "User List page",
};
const Users = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms?.keyword) ?? "";
  let page = Number((await spms?.page) ?? "1");
  let perPage = Number((await spms?.perPage) ?? "12");
  // let start=(Number(page)-1)*Number(perPage)

  // let userList = await userListAction(keyword);
  let res = await fetch(
    `${process.env.BASE_URL}/api/admin/user-list?keyword=${keyword}&page=${page}&perPage=${perPage}`,
    {
      cache: "force-cache",
      next: { tags: ["user-list", "max"] },
    },
  );
  let { userList, total } = await res.json();
  // let { data } = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
  let entries = userList;
  return (
    <div>
      <div className="my-3">
        <Form action={"/dashboard/admin/user-list"}>
          <div className="flex">
            <div className="">
              <input
                name="keyword"
                type="search"
                className="input-000"
                placeholder="Name or Email or phone"
              />
            </div>
            <div className="">
              <SubmitButton title={"Search"} design={"btn btn-search"} />
            </div>
          </div>
        </Form>
      </div>
      <div className=" card p-2 mt-5">
        <h4>Total Users: ( {total})</h4>
        {/* <h4>Total Sale: {<PriceFormat price={totalPrice} />}</h4> */}
      </div>
      <div className="">
        <table className="w-full border-separate border-spacing-x-0.5 border-spacing-y-1">
          {/* head */}
          <thead>
            <tr className="bg-base-300 py-2 h-10 text-center">
              <th>Name</th>
              <th>Picture</th>
              <th>Email</th>
              <th>Mobile No.</th>
              <th>Address</th>
              <th>User Role</th>
              <th>Join Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="bg-base-100">
            {entries.length ? (
              entries?.map((item) => (
                <tr key={item?._id} className="hover:bg-zinc-200 text-center">
                  <td>{item.name}</td>
                  <td>
                    <Link href={item.picture?.secure_url} target="_blank">
                      <Image
                        blurDataURL={blurimg?.blurDataURL}
                        placeholder="blur"
                        priority={true}
                        className="w-8 h-auto mx-auto"
                        width={30}
                        height="0"
                        src={item.picture?.secure_url}
                        alt=""
                      />
                    </Link>
                  </td>
                  <td>{item.email}</td>
                  <td>{item.phone}</td>
                  <td>{item.address}</td>
                  <td>
                    <Role role={item.role} id={item._id.toString()} />
                  </td>
                  <td>
                    <DateSSR2 date={item.createdAt} />
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
          total={total || 1}
          page={page}
          perPage={perPage}
          spms1="keyword"
          spms1Value={keyword}
        />{" "}
      </div>
    </div>
  );
};

export default Users;

//  <div>
//    <form>
//      <input name="keyword" type="text" id="" />
//      <button
//        // onClick={serverAction}
//        type="submit"
//      >
//        Submit
//      </button>
//    </form>
//    {/* <Input page={page} perPage={perPage} /> */}
//    <div className="grid grid-cols-3 gap-5">
//      {entries?.map(async (item) => {
//        return <Card item={item} />;
//      })}
//    </div>
//    <div className=" mt-3 ">
//      <Pagination
//        totalPage={totalPage}
//        page={page}
//        perPage={perPage}
//        keyword={keyword}
//      />
//    </div>
//  </div>;
