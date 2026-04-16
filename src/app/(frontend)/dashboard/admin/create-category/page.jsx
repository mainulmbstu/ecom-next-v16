import React from "react";
import CategoryList from "./CategoryList";
import CategoryModal from "./CategoryModal";
export const metadata = {
  title: "Category",
  description: "Category page",
};
const Page = ({ searchParams }) => {
  return (
    <div className="pt-3 px-2">
      <CategoryModal title="Create Category" design="btn-primary" />
      <CategoryList searchParams={searchParams} />
    </div>
  );
};

export default Page;
