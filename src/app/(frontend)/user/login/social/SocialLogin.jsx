import SubmitButton from "@/lib/components/SubmitButton";
import { doLogout, socialLogin } from "./auth";
import { auth } from "./auth";

const SocialLoginPage = async () => {
  let session = await auth();
  console.log(session);

  return (
    <div className=" m-2 ">
      <form action={socialLogin}>
        <div className="mt-3">
          <SubmitButton
            value="google"
            title={"Sign in with google"}
            design={"btn-primary w-full"}
          />
        </div>
        <div className="mt-3">
          <SubmitButton
            value="github"
            title={"Sign in with github"}
            design={"btn-black w-full"}
          />
        </div>
      </form>
      <form action={doLogout}>
        <div className="mt-3">
          <SubmitButton title={"Logout"} design={"btn-error  cursor-pointer"} />
        </div>
      </form>
    </div>
  );
};

export default SocialLoginPage;
