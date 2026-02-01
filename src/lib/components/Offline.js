"use client";

import React, { useEffect, useState } from "react";
import OfflineInner from "./OfflineInner";
// import { useRouter } from "next/router";

const Offline = () => {
  const [mounted, setMounted] = useState(false);
  // let router= useRouter()
  useEffect(() => {
    setMounted(true);
  }, []);

  return <div className={" text-center"}>{mounted && <OfflineInner />}</div>;
};

export default Offline;
