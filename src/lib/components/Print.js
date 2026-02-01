// /* eslint-disable*/

import React from "react";
import PriceFormat from "./PriceFormat";
import moment from "moment";

const Print = ({ printItem }, ref) => {
  return (
    <div ref={ref} className={printItem ? "mt-5 px-5" : "hidden"}>
      <div className=" text-center mb-4">
        <h3> MAINUL ECOM DEMO</h3>
        <p>Delduar, Tangail, Dhaka, Bangladesh</p>
        <p>email: mainuldemo@gmail.com</p>
        <p>Phone: 01743914780</p>
      </div>
      <div className="grid grid-cols-2">
        <div className=" col-span-1">
          <h3>INVOICE</h3>
        </div>
        <div className="col-span-1">
          <p>Invoice No. {printItem?._id} </p>
          <p>
            Payment Method.{" "}
            {printItem?.payment?.bkashNo ? "Bkash" : "SSL COMMERZ"} (
            {printItem?.payment?.bkashNo})
          </p>
          <p>Invoice Date: {moment(new Date()).format("DD-MM-YYYY hh:mm a")}</p>
        </div>
      </div>

      <hr />
      <div className="row">
        <div className="col-6">
          <h4>Shipping Information</h4>
          <h5>Name: {printItem?.user?.name} </h5>
          <p>Phone: {printItem?.user?.phone} </p>
          <p>Email: {printItem?.user?.email} </p>
          <p>Address: {printItem?.user?.address} </p>
        </div>
      </div>
      <hr />
      <div className="row">
        <table className="table ">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Product</th>
              <th scope="col">Unit Price</th>
              <th scope="col">Quantity</th>
              <th scope="col">Sub-Total</th>
            </tr>
          </thead>

          <tbody>
          {printItem ? (
              printItem?.products?.map((item, i) => (
                <tr key={item?._id} className="hover:bg-zinc-200">
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>
                    {
                      <PriceFormat
                        price={item.price - (item.price * item?.offer) / 100}
                      />
                    }
                  </td>
                  <td>{item.amount}</td>
                  <td>
                    {
                      <PriceFormat
                        price={
                          (item?.price - (item?.price * item?.offer) / 100) *
                          item.amount
                        }
                      />
                    }
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td>No data found</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end pe-5">
          <h4>Total Price: {<PriceFormat price={printItem.total} />}</h4>
        </div>
      </div>
    </div>
  );
};

const forwardPrint = React.forwardRef(Print);
export default forwardPrint;
