"use client";
import dynamic from "next/dynamic";
const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false, // window is not define problem solve, server render hobena
});
import moment from "moment";
import { useEffect, useState } from "react";

const DateChart = ({ dateTotalProds }) => {
  let dateTotalProdsObj = {};
  dateTotalProds.length &&
    dateTotalProds.map((item) => {
      let date = moment(new Date(item.createdAt)).format("DD-MM-YYYY");
      dateTotalProdsObj[date] = (dateTotalProdsObj[date] || 0) + item.total;
    });

  let ordersObj = {};
  dateTotalProds.length &&
    dateTotalProds.map((item) => {
      let date = moment(new Date(item.createdAt)).format("DD-MM-YYYY");
      ordersObj[date] = (ordersObj[date] || 0) + 1;
    });

  const [state, setstate] = useState("");

  useEffect(() => {
    setstate({
      options: {
        // title: { text: "Sale statistic by date" },
        // colors: ["#111EAA", "#E91E63"],
        //   color: ["#2E93fA", "#66DA26", "#546E7A", "#E91E63", "#FF9800"],
        chart: {
          id: "chart-by-date",
          stacked: true,
        },

        // fill: {
        //   colors: ["#Fg4336", "#E91E63", "#9C27B0"],
        // },
        // plotOptions: {
        //   bar: { horizontal: true, columnWidth:'100%' },
        // },
        xaxis: {
          title: {
            text: "⬅ date ➡",
            style: {
              fontSize: 20,
              color: "green",
            },
          },
          categories: Object.keys(dateTotalProdsObj),
        },
        // yaxis: {
        //   title: { text: "Total Sale in $" },
        // },
        legend: {
          position: "top",
        },
        // dataLabels: {
        //   enabled: false,
        // },
      },

      series1: [
        {
          name: "Total Sale",
          data: Object.values(dateTotalProdsObj),
          // color:"#546E7A",
        },
      ],
      series2: [
        {
          name: "Total Sale quantity",
          data: Object.values(ordersObj),
          color: "#AA1E63",
        },
      ],
    });
  }, [dateTotalProds]);
  return (
    <div>
      {" "}
      <div>
        <div>
          <h4>Total Sale statistics by date</h4>
          {state && state?.series1 && (
            <Chart
              options={state?.options}
              series={state?.series1}
              type="bar" //line, area, bar, pie, donut, scatter, bubble, heatmap, radialBar
              width={"100%"}
              //   height={screen > 768 ? 500 : 320}
            />
          )}
        </div>
        <div>
          <h4>Total orders by date</h4>
          {state && state?.series2 && (
            <Chart
              options={state?.options}
              series={state?.series2}
              type="bar" //line, area, bar, pie, donut, scatter, bubble, heatmap, radialBar
              width={"100%"}
              //   height={screen > 768 ? 500 : 320}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default DateChart;
