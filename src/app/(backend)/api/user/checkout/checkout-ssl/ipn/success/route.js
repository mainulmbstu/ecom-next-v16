import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CommentModel } from "@/lib/models/CommentModel";
import { UserModel } from "@/lib/models/userModel";
import { redirect } from "next/navigation";

export async function POST(req) {
  // let pid = req.nextUrl.searchParams.get("pid");
  try {
    console.log(7777777777777, req);
    redirect(`/payment/success?tran_id=${"result?.trxID" || ""}`);
    // return Response.json({ mm: 111111 });
  } catch (error) {
    // if u use redirect in try block
    if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
