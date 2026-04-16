"use client";

import Link from "next/link";
import { useAuth } from "../context";
import Image from "next/image";
import { blurDataURL } from "@/lib/helpers/blurData";

const HomeCatPage = () => {
  let { catNested } = useAuth();

  return (
    <div className="hidden md:flex my-2 md:flex-wrap">
      {catNested?.length &&
        catNested.map((item) => (
          <div key={item._id} className=" px-2 ">
            <div className="p-2">
              <Link href={`products/category/${item?.slug}`} className="">
                <Image
                  src={item?.picture?.secure_url}
                  blurDataURL={blurDataURL()}
                  placeholder="blur"
                  priority={true}
                  className="w-32 min-h-20 h-15 m-auto object-contain"
                  width={200}
                  height={100}
                  alt="image"
                />
                <p className=" text-center">{item?.name} </p>
              </Link>
            </div>
          </div>
        ))}
    </div>
  );
};

export default HomeCatPage;
