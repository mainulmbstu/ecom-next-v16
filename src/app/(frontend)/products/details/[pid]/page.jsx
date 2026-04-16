// export const dynamic = "force-static";
// export const dynamicParams = true;

import React, { Suspense } from "react";
import { detailsAction, likeAction, likeStatusAction } from "./action";
import moment from "moment";
import { GrLike } from "react-icons/gr";
import Form from "next/form";
import SubmitButton from "@/lib/components/SubmitButton";
import PriceFormat from "@/lib/components/PriceFormat";
import { MdStar } from "react-icons/md";
import ImagePage from "./ImagePage";
import CommentModal from "./CommentModal";
import CommentData from "./commentData";
import SimilarItems from "./SimilarItems";
import RatingModal from "./RatingModal";
import DateSSR2 from "@/lib/components/DateSSR2";

// export async function generateStaticParams() {
//   return [{ pid: "__placeholder__" }];
//   // return [{ pid: "682d6f4585553eb793014457" }];
// }
// not work
// export const generateMetadata = async ({ searchParams }) => {
//   let { name, description } = await searchParams;
//   return {
//     title: name,
//     description: description,
//   };
// };
export const generateMetadata = async ({ params }) => {
  let { pid } = await params;
  let { details } = await detailsAction(pid);
  return {
    title: details?.name,
    description: details?.description,
  };
};

const details = async ({ params }) => {
  // console.log(search);
  let { pid } = await params;
  let { details } = await detailsAction(pid);
  let like = await likeStatusAction(pid);
  let subLikeAction = likeAction.bind(null, pid);

  return (
    <div className="md:px-4">
      <div className="">
        <div className="">
          <div className="">
            <ImagePage picture={details?.picture} />
            <div className=" pe-3 flex justify-end items-center mt-2 ">
              <span>{like ? "You liked this ||" : ""} </span>{" "}
              <Form className="px-3" action={subLikeAction}>
                <SubmitButton
                  disable={like?.status}
                  design={"btn-link"}
                  title={
                    <GrLike
                      className={
                        like
                          ? " text-3xl  me-3 text-blue-400"
                          : "text-black  me-3"
                      }
                    />
                  }
                />
              </Form>
              Like: {details?.like} || Review: {details?.review} ||
            </div>
            <div className="">
              <div>
                <h5>Name: {details?.name} </h5>
                <p>Category: {details?.category?.name} </p>
                <p className={details?.offer ? "line-through " : "hidden"}>
                  Price: {<PriceFormat price={details?.price} />}{" "}
                </p>
                <p className={details?.offer ? "text-red-400" : ""}>
                  Price:{" "}
                  {
                    <PriceFormat
                      price={
                        details?.price - (details?.price * details?.offer) / 100
                      }
                    />
                  }{" "}
                </p>
                <p className={details?.offer ? "text-danger" : "hidden"}>
                  Offer: {details?.offer}% off{" "}
                </p>
                <p className={details?.color?.length ? "" : "hidden"}>
                  Available Color: {details?.color?.toString()}
                </p>
                <p>Quantity: {details?.quantity} </p>
                <p className="m-0 ">
                  <span className="p-1 text-white bg-green-600">
                    Rating: {details?.rating}
                    <MdStar className=" text-red-500 inline mx-2" />(
                    {details?.ratingNo})
                  </span>{" "}
                </p>
                <p>Description: {details?.description} </p>
                <p>
                  Created:
                  <DateSSR2 date={details?.createdAt} time={true} />, (
                  {moment(details?.createdAt).fromNow()})
                </p>
                <p>
                  Updated:
                  <DateSSR2 date={details?.updatedAt} time={true} />, (
                  {moment(details?.updatedAt).fromNow()})
                </p>
              </div>
            </div>

            <div className="my-2">
              <Suspense fallback={<h2>Loading</h2>}>
                <CommentModal pid={pid} title="Review" design="btn-success" />
              </Suspense>
            </div>
            <div className="my-2">
              <Suspense fallback={<h2>Loading</h2>}>
                <RatingModal
                  pid={pid}
                  title="Rate this product"
                  design="btn-primary"
                />
              </Suspense>
            </div>
          </div>
        </div>
        <hr />
        <div className=" ">
          <div>
            <Suspense fallback={<h2>Loading reviews</h2>}>
              <CommentData pid={pid} />
            </Suspense>
          </div>
        </div>
        <hr />
        <div className=" mb-4">
          <Suspense fallback={<h2>Loading similar products</h2>}>
            <SimilarItems pid={pid} />
            {/* <SimilarItems similarItemsPromise={similarItemsPromise} /> */}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default details;
