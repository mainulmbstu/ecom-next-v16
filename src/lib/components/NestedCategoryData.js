"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "./context";

const NestedCategoryData = () => {
  let { catNested } = useAuth();
  let category = catNested;
  let [show, setShow] = useState(false);
  let getCategoryList = (category) => {
    let myCategories = [];
    if (category?.length) {
      for (let v of category) {
        myCategories.push(
          <li key={v.slug}>
            {v.parentId ? (
              <Link
                className=" hover:bg-amber-50"
                onClick={() => setShow(false)}
                href={`/products/category/${v.slug}`}
              >
                {v.name}
              </Link>
            ) : (
              <span onMouseOver={() => setShow(true)}>{v.name} </span>
            )}
            {v.children.length > 0 ? (
              <ul className={show ? "" : "hidden"}>
                {getCategoryList(v.children)}{" "}
              </ul>
            ) : null}
          </li>
        );
      }
    }
    return myCategories;
  };

  // let nestedCategory = (category) => {
  //   let categoryList = [];
  //   if (category?.length) {
  //     for (let v of category) {
  //       categoryList.push(
  //         <li key={v._id} className="mx-3 list-none ms-8">
  //           {v.name}
  //           {v.children.length > 0 ? (
  //             <ul>{nestedCategory(v.children)} </ul>
  //           ) : null}
  //         </li>
  //       );
  //     }
  //   }
  //   return categoryList;
  // };

  return (
    <div className="catPage">
      <ul>
        <Link
          href={"/products/offers"}
          className=" me-3 my-auto text-decoration-none"
        >
          OFFERS
        </Link>
        {getCategoryList(category)}
      </ul>
    </div>
  );
};

export default NestedCategoryData;
