"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Pagination = ({
  page,
  perPage,
  total,
  spms1,
  spms1Value = "",
  spms2 = "",
  spms2Value = "",
}) => {
  let router = useRouter();
  let path = usePathname();
  // let searchParams = useSearchParams();
  // let page = searchParams.get("page") ?? "1";
  //   let perPage = searchParams.get("perPage") ?? "3";
  let totalPage = Math.ceil(total / perPage);
  let pageArr = Array.from({ length: totalPage }, (v, i) => i + 1);
  if (totalPage === 1) {
    return null;
  }

  return (
    <div>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => {
          router.push(
            `${path}?${spms1}=${spms1Value}&${spms2}=${spms2Value}&page=${
              page - 1
            }&perPage=${perPage}`,
          );
        }}
        className="btn btn-primary disabled:opacity-50"
      >
        Previous
      </button>
      <span className={page <= 11 ? "hidden" : ""}>
        <button
          type="button"
          className="btn "
          onClick={() => {
            router.push(
              `${path}?${spms1}=${spms1Value}&${spms2}=${spms2Value}&page=1&perPage=${perPage}`,
            );
          }}
        >
          1
        </button>
        ......
      </span>
      {pageArr.map((item, i) => (
        <button
          type="button"
          key={i}
          onClick={() => {
            router.push(
              `${path}?${spms1}=${spms1Value}&${spms2}=${spms2Value}&page=${item}&perPage=${perPage}`,
            );
          }}
          // className={item==page?'my-3 btn btn-primary':'btn'}
          className={
            item < page - 10 || item > page + 10
              ? "hidden"
              : item === page
                ? "my-3 btn btn-blue"
                : "btn"
          }
        >
          {item}
        </button>
      ))}
      <span className={page >= totalPage - 10 ? "hidden" : ""}>
        ......
        <button
          type="button"
          className="btn"
          onClick={() => {
            router.push(
              `${path}?${spms1}=${spms1Value}&${spms2}=${spms2Value}&page=${totalPage}&perPage=${perPage}`,
            );
          }}
        >
          {totalPage}
        </button>
      </span>
      <button
        type="button"
        disabled={page >= totalPage}
        onClick={() => {
          router.push(
            `${path}?${spms1}=${spms1Value}&${spms2}=${spms2Value}&page=${
              page + 1
            }&perPage=${perPage}`,
          );
        }}
        className="btn btn-primary disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
