import React from "react";

const ProgressBar = ({ progress = 0, color = "bg-blue-500" }) => {
  let test = {
    width: `${progress}%`,
    height: "100%",
    // backgroundColor: color,
    borderRadius: "9999px",
    textAlign: "center",
  };
  console.log();
  return (
    <div
      className={
        progress > 0
          ? " my-1 w-72 h-6 rounded-3xl bg-yellow-100"
          : " my-1 w-72 h-6 rounded-3xl  bg-yellow-100 invisible"
      }
    >
      <div style={test} className={color}>
        {progress}%
      </div>
    </div>
  );
};

export default ProgressBar;
