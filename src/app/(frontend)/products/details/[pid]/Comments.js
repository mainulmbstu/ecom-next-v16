"use client";

import moment from "moment";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Comments = ({ data }) => {
  const [page, setPage] = useState(1);
  let comments = data?.comments?.slice(0, page * 5);
  return (
    <div>
      {comments?.length ? (
        <div className="md:ps-4">
          <h4>Reviews about this product ({data?.comments?.length}) </h4>
          {comments?.length &&
            comments.map((item) => (
              <div key={item._id} className=" my-2">
                {" "}
                <p className="flex">
                  <Link
                    className="me-2"
                    href={
                      item?.user?.picture
                        ? item?.user?.picture?.secure_url
                        : "/"
                    }
                    target="_blank"
                  >
                    <Image
                      priority={true}
                      // sizes="w-10"
                      // blurDataURL={blurDataAuthor}
                      // placeholder="blur"
                      className=" object-contain w-10 h-auto me-3"
                      src={item?.user?.picture?.secure_url}
                      alt=""
                      width={100}
                      height={100}
                    />{" "}
                  </Link>{" "}
                  <span className="mt-3">
                    {item.user?.name} ({moment(item?.createdAt).fromNow()})
                  </span>
                </p>
                <p className="ps-4 ms-3">Comment: {item.comment}</p>
              </div>
            ))}
          <button
            disabled={comments?.length === data?.comments?.length}
            className="btn btn-accent"
            onClick={() => setPage((prev) => prev + 1)}
          >
            Load more
          </button>
        </div>
      ) : (
        <p>No review about this product</p>
      )}
    </div>
  );
};

export default Comments;
