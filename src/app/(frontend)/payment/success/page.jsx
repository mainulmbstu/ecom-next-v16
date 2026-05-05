import Link from "next/link";

const PaymentSuccess = async () => {
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
};

export default PaymentSuccess;
