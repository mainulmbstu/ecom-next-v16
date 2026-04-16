"use client";

import Image from "next/image";
import { useState } from "react";
import { blurDataURL } from "@/lib/helpers/blurData";

const ImagePage = ({ picture }) => {
  const [img, setImg] = useState("");
  const [index, setindex] = useState(0);

  return (
    <div className=" grid md:grid-cols-2 my-1">
      <div className="flex flex-wrap">
        {picture?.map((item, i) => {
          return (
            <div className={`text-center  py-1 relative`} key={i}>
              <Image
                onMouseOver={() => {
                  setImg(item?.secure_url);
                  setindex(i);
                }}
                // fill
                priority={true}
                blurDataURL={blurDataURL()}
                placeholder="blur"
                src={`${item?.secure_url}`}
                alt="img"
                width={70}
                height={70}
                className={`px-3 cursor-pointer h-16 w-auto ${
                  i === index ? "border border-red-400" : ""
                }`}
              />
            </div>
          );
        })}
      </div>
      <div className="">
        <figure className=" h-40 md:h-100 relative">
          <Image
            priority={true}
            blurDataURL={blurDataURL()}
            placeholder="blur"
            className=" object-contain h-40 md:h-100  w-auto mx-auto"
            alt="image"
            width={2000}
            height={2000}
            src={img || picture?.at(0)?.secure_url}
          />{" "}
        </figure>
      </div>
    </div>
  );
};

export default ImagePage;
