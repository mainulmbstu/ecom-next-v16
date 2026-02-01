import ProductListClient from "./ProductListClient";

const ProductList = async ({ searchParams }) => {
  let spms = await searchParams;
  let keyword = (await spms["keyword"]) ?? "";
  let category = (await spms["category"]) ?? "";
  let page = Number((await spms["page"]) ?? "1");
  let perPage = Number((await spms["perPage"]) ?? "12");

  let res = await fetch(
    `${process.env.BASE_URL}/api/admin/product?keyword=${keyword}&category=${category}&page=${page}&perPage=${perPage}`,
    { cache: "force-cache", next: { tags: ["product-list"] } },
  );
  let data = await res.json();
  return (
    <ProductListClient
      value={{
        keyword,
        category,
        page,
        perPage,
        data,
      }}
    />
  );
};

export default ProductList;
