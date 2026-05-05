"use client";
import { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import Print from "@/lib/components/Print";

const ClientPage = ({ item }) => {
  let [printItem, setPrintItem] = useState("");

  useEffect(() => {
    setPrintItem(item);
  }, [item?._id]);
  //=============== print
  let contentRef = useRef();
  let printAddress = useReactToPrint({
    contentRef,
    documentTitle: printItem?._id,
  });

  return (
    <div className="flex">
      {/* <button
        type="button"
        onClick={() => {
          setPrintItem(item);
        }}
        className="btn btn-info"
        disabled={item?.payment?.refund === "refunded"}
      >
        {printItem?._id === item?._id ? "OK" : "Set Print"}
      </button>*/}
      <button
        type="button"
        onClick={() => {
          printAddress();
        }}
        className={"btn btn-link text-blue-600"}
      >
        Print
      </button>
      <div className=" hidden">
        <Print ref={contentRef} printItem={printItem} />
      </div>
    </div>
  );
};

export default ClientPage;
