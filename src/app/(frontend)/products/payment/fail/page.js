import Link from "next/link";

const PaymentFail = () => {
  return (
    <div className=" text-center mt-5 bg-red-500  mx-auto p-4 text-white">
      <h2> Sorry payment failed</h2>
      <h4>Your order has been canceled</h4>
      <Link className=" bg-white p-1 text-blue-700 underline" href={"/cart"}>
        Try again
      </Link>
    </div>
  );
};

export default PaymentFail;
