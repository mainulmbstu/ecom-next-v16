import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/helpers/dbConnect";
import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { CommentModel } from "@/lib/models/CommentModel";
import { UserModel } from "@/lib/models/userModel";

export async function GET(req) {
  let pid = req.nextUrl.searchParams.get("pid");
  try {
    await dbConnect();

    const comments = await CommentModel.find({ product: pid })
      .populate("user", "-password", UserModel)
      .sort({ createdAt: -1 });
    return Response.json({ comments });
  } catch (error) {
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
