"use client";

import moment from "moment";

const DateSSR = ({ date }) => {
  return (
    <span className=" ">Date: {moment(date).format("DD-MM-YY hh:mm a")}</span>
  );
};

export default DateSSR;
