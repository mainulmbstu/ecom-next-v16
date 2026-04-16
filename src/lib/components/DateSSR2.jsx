"use client";

import moment from "moment";

const DateSSR2 = ({ date, time = false }) => {
  return (
    <span className=" ">
      {moment(date).format(time ? "DD-MMM-YYYY hh:mm a" : "DD-MMM-YYYY")}
    </span>
  );
};

export default DateSSR2;
