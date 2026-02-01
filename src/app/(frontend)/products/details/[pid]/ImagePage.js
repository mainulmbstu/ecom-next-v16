"use client";

import Image from "next/image";
import { useState } from "react";

const ImagePage = ({ picture, blurData }) => {
  const [img, setImg] = useState("");
  const [index, setindex] = useState(0);

  return (
    <div className=" grid md:grid-cols-2">
      <div className="flex flex-wrap">
        {picture?.map((item, i) => {
          return (
            <div className={`text-center  py-1`} key={i}>
              <Image
                onMouseOver={() => {
                  setImg(item?.secure_url);
                  setindex(i);
                }}
                // blurDataURL={blurData}
                // placeholder="blur"
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
            fill
            priority={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            // blurDataURL={blurData}
            // placeholder="blur"
            className=" object-contain"
            src={img || (picture?.length && picture[0]?.secure_url)}
            alt=""
          />{" "}
        </figure>
      </div>
    </div>
  );
};

export default ImagePage;
