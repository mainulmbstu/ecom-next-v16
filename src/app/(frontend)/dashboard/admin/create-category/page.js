import React from "react";
import CreateCategoryModal from "./CreateCategoryModal";
import CategoryList from "./CategoryList";
export const metadata = {
  title: "Category",
  description: "Category page",
};
const Page = ({ searchParams }) => {
  return (
    <div className="pt-3">
      <CreateCategoryModal />
      <CategoryList searchParams={searchParams} />
    </div>
  );
};

export default Page;
