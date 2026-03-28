import Link from "next/link";
import React from "react";
import { MdAddCall } from "react-icons/md";

const Footer = () => {
  return (
    <div className="min-h-[4vh] bg-base-300 flex justify-center space-x-10 items-center">
      <h4 className=" p-3">All rights preserved by MainulTech </h4>
      <Link className=" flex" href={'tel:+8801743914780'}><MdAddCall /> : Call</Link>
      <div>
      </div>
    </div>
  );
};

export default Footer;
