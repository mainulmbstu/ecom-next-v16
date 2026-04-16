import React from "react";
import ProductList from "./ProductList";
import ProductModal from "./ProductModal";
export const metadata = {
  title: "Admin Product",
  description: "Admin Product page",
};
const Page = ({ searchParams }) => {
  return (
    <div className="pt-3 px-2">
      <ProductModal title="Create Product" design="btn-primary" />
      <ProductList searchParams={searchParams} />
    </div>
  );
};

export default Page;
