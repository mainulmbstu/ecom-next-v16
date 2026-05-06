import Link from "next/link";

const PaymentStatus = async ({ params }) => {
  let { paymentStatus } = await params;
  if (paymentStatus === "cancelled") {
    return (
      <div className=" text-center mt-5 bg-red-500  mx-auto p-4 text-white">
        <h2> Sorry payment cancelled</h2>
        <h4>Your order has been canceled</h4>
        <Link className=" bg-white p-1 text-blue-700 underline" href={"/cart"}>
          Try again
        </Link>
      </div>
    );
  } else if (paymentStatus === "success") {
    return (
      <div className=" text-center mt-5 bg-green-500  mx-auto p-4 text-white">
        <h3> Payment successful</h3>
        <h4>Your order has been placed successfully</h4>
        <Link
          className=" bg-white px-3 text-blue-600 underline py-1"
          href={`/dashboard/user/order-list`}
        >
          Click to see you order
        </Link>
      </div>
    );
  } else {
    return (
      <div className=" text-center mt-5 bg-red-500  mx-auto p-4 text-white">
        <h2> Sorry payment failed</h2>
        <h4>Your order has been canceled</h4>
        <Link className=" bg-white p-1 text-blue-700 underline" href={"/cart"}>
          Try again
        </Link>
      </div>
    );
  }
};

export default PaymentStatus;
