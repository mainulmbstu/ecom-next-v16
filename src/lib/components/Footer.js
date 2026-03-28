import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <div className="min-h-[4vh] bg-base-300 flex justify-between items-center">
      <h4 className=" p-3">All rights preserved by MainulTech </h4>
      <div>
        <Link href={'tel:+8801743914780'}></Link>
      </div>
    </div>
  );
};

export default Footer;
