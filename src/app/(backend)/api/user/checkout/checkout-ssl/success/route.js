import { getErrorMessage } from "@/lib/helpers/getErrorMessage";
import { redirect } from "next/navigation";

export async function POST(req) {
  let tran_id = req.nextUrl.searchParams.get("tran_id");
  try {
    redirect(`/payment/success?tran_id=${tran_id || ""}`);
  } catch (error) {
    // if u use redirect in try block
    if (error.message === "NEXT_REDIRECT") throw error;
    console.log(error);
    return Response.json({ message: await getErrorMessage(error) });
  }
}
