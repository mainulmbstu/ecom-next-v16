import React from "react";
import CreateProductModal from "./CreateProductModal";
import ProductList from "./ProductList";
export const metadata = {
  title: "Admin Product",
  description: "Admin Product page",
};
const Page = ({ searchParams }) => {
  return (
    <div className="pt-3">
      <CreateProductModal />
      <ProductList searchParams={searchParams} />
    </div>
  );
};

export default Page;
