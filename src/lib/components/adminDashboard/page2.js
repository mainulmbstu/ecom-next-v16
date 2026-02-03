"use client";

import PriceFormat from "@/lib/components/PriceFormat";
import Form from "next/form";
import { totalAction } from "./action";
import { useEffect, useState } from "react";
import SubmitButton from "../SubmitButton";
import { Axios } from "@/lib/helpers/AxiosInstance";
import Swal from "sweetalert2";
import TopSellingChart from "./TopSellingChart";
import DateChart from "./DateChart";

const Page2 = () => {
  let [endDate, setEndDate] = useState(new Date());
  let stDate = new Date(new Date(endDate) - 30 * 24 * 3600000);
  let [startDate, setStartDate] = useState(new Date(stDate));
  let [totalSale, setTotalSale] = useState("");
  let [totalSaleToday, setTotalSaleToday] = useState("");
  let [topProds, setTopProds] = useState([]);
  let [dateTotalProds, setDateTotalProds] = useState([]);
  let [timeDiff, setTimeDiff] = useState({ days: "", hrs: "", mins: "" });
  const [head, setHead] = useState(false);

  let seconds = Math.floor((new Date(endDate) - new Date(startDate)) / 1000);
  let timeConvert = (seconds) => {
    let days = Math.floor(seconds / 86400);
    let hrs = Math.floor((seconds % 86400) / 3600);
    let mins = Math.floor((seconds % 3600) / 60);
    setTimeDiff({ days, hrs, mins });
  };
  useEffect(() => {
    timeConvert(seconds);
  }, [seconds]);

  let clientAction = async (today) => {
    let todayDate = new Date().toDateString();
    today === "today" ? setHead(true) : setHead(false);
    // let data = await totalAction(startDate, endDate);
    let { data } = await Axios.post("/api/admin/dashboard", {
      startDate: today === "today" ? todayDate : startDate,
      endDate,
    });
    if (data?.success) {
      setTotalSale(data?.totalSale);
      setTotalSaleToday(data?.totalSaleToday);
      setTopProds(data?.topProds);
      setDateTotalProds(data?.dateTotalProds);
      // Swal.fire("Success", data?.message, "success");
      //   toast.success(data?.message);
    } else {
      Swal.fire("Error", data?.message, "error");
      //   toast.error(data?.message);
    }
  };
  useEffect(() => {
    clientAction();
  }, []);
  return (
    <div>
      {!head ? (
        <p className=" text-center  font-bold text-2xl">
          <span>Statistic of last</span>{" "}
          <span className={timeDiff?.days ? "" : "hidden"}>
            {timeDiff?.days} days{" "}
          </span>{" "}
          <span className={timeDiff?.hrs ? "" : "hidden"}>
            {timeDiff?.hrs} hours{" "}
          </span>{" "}
          <span className={timeDiff?.mins ? "" : "hidden"}>
            {timeDiff.mins} minutes{" "}
          </span>{" "}
        </p>
      ) : (
        <p className=" text-center  font-bold text-2xl">
          <span>Statistic of today</span>{" "}
        </p>
      )}

      <hr />
      <div>
        <Form action={() => clientAction("today")} className="w-64">
          {/* <div className="hidden">
            <input
              defaultValue={startDate}
              className="input"
              type="datetime-local"
              id="sdate"
              name="sdate"
            />
          </div> */}
          <div className="mt-3">
            <SubmitButton
              title={"Click to get today's Data"}
              design={"btn-neutral"}
            />
          </div>
        </Form>
      </div>
      <div className="md:grid grid-cols-2 gap-2">
        <div className=" p-2  border mt-2">
          <div>
            <Form action={clientAction} className="w-64">
              <label htmlFor="sdate" className=" font-bold">
                Start Date
                <input
                  defaultValue={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input"
                  type="datetime-local"
                  id="sdate"
                  name="sdate"
                />
              </label>
              <label htmlFor="edate" className=" font-bold">
                End Date
                <input
                  defaultValue={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="input"
                  type="datetime-local"
                  id="edate"
                  name="edate"
                />
              </label>

              <div className="mt-3">
                <SubmitButton title={"Submit"} design={"btn-accent"} />
              </div>
            </Form>
          </div>

          <div>
            <h4>Total Sale: {<PriceFormat price={totalSale} />} </h4>
            <h4 className="text-success">
              Todays Sale: {<PriceFormat price={totalSaleToday} />}{" "}
            </h4>
          </div>
        </div>
        <div className="p-2 border mt-2">
          <h4>Top {topProds?.length} selling products </h4>
          <TopSellingChart topProds={topProds} />
        </div>
        <div className="col-span-2 border">
          <DateChart dateTotalProds={dateTotalProds} />
        </div>
      </div>
    </div>
  );
};

export default Page2;
