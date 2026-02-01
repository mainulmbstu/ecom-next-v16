"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/components/context";

const SubCat = ({ slug }) => {
  let { catPlain, catNested } = useAuth();
  let catItem = catPlain?.length && catPlain.find((item) => item.slug == slug);

  let subCat =
    slug === "all-categories"
      ? catNested
      : catItem && catPlain.filter((item) => item.parentId === catItem._id);
  return (
    <div className="flex my-2">
      {subCat?.length ? (
        subCat.map((item) => (
          <div key={item._id} className=" px-2 ">
            <div className="p-2">
              <Link href={`/products/category/${item?.slug}`} className="">
                <Image
                  src={item?.picture?.secure_url}
                  priority={true}
                  className="w-32 min-h-20 h-15 m-auto object-contain"
                  width={200}
                  height={100}
                  alt=""
                />
                <p className=" text-center">{item?.name} </p>
              </Link>
            </div>
          </div>
        ))
      ) : (
        <></>
      )}
    </div>
  );
};

export default SubCat;
