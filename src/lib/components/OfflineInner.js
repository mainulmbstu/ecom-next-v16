import React, { useEffect } from "react";
let online = globalThis.navigator?.onLine;
import { useRouter } from "next/navigation";

const OfflineInner = () => {
  let router = useRouter();

  // useEffect(() => {
  //   router.refresh();
  //   console.log(online);
  // }, [online]);
  return (
    <div className={online ? "hidden" : ""}>
      <p className=" text-red-900 pt-20">{!online ? "You are offline" : ""}</p>
    </div>
  );
};

export default OfflineInner;
