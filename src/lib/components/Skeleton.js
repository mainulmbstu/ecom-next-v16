import React from "react";

const Skeleton = () => {
  return (
    <div className="grid md:grid-cols-4 gap-6">
      {Array.from({ length: 12 }, (v, i) => (
        <div key={i} className="flex flex-col gap-4">
          <div className="skeleton h-64 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-44"></div>
          <div className="skeleton h-4 w-40"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-20"></div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
