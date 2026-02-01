import React from "react";
import Card from "@/lib/components/card/Card";
import { similarItemsAction } from "./action";

const SimilarItems = async ({ pid }) => {
  let similarItemsPromise = similarItemsAction(pid);
  let data = await similarItemsPromise;
  let similarItems = data?.similarItems;
  return (
    <div className=" mb-4">
      <h4>Similar Products</h4>
      <div className="grid md:grid-cols-4 gap-3">
        {similarItems?.length &&
          similarItems?.map((item) => <Card key={item._id} item={item} />)}
      </div>
    </div>
  );
};

export default SimilarItems;
