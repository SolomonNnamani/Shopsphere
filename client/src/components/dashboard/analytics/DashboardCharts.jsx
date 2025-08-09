import React, { useRef, useEffect } from "react";
import { Chart } from "chart.js/auto";

const DashboardCharts = ({ theme, orders }) => {
  const barRef = useRef(null);
  const dailyRef = useRef(null);

//-----for monthly chart -----
  const getMonthYear = (dateString) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("default", { month: "short" });
    const year = date.getFullYear();
    return month;
  };
  //-------------salesOverTime - Monthly------------
  const salesOverTimeMonthly = () => {
    const monthlyData = {};

    orders
  .filter(order => order.orderStatus === "delivered" && order.paymentStatus === "paid")
  .forEach((order) => {
      const month = getMonthYear(order.createdAt);

      //Add to that months total
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }

      monthlyData[month] += order.totalAmount || 0;
    });

    return monthlyData;
  };

  //for daily chart
  const getMonthDay = (dayString) => {
    const date = new Date(dayString);
    const month = date.toLocaleDateString("default", { month: "short" });
    const day = date.getDate(); // returns number, e.g., 12

    return `${month} ${day}`;
  };

  //Sales over Time - Daily
  const salesOverTimeDaily = () => {
    const dailyData = {};
    orders.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    orders
  .filter(order => order.orderStatus === "delivered" && order.paymentStatus === "paid")
  .forEach((order) => {
      const date = getMonthDay(order.createdAt);

      if (!dailyData[date]) {
        dailyData[date] = 0;
      }
      dailyData[date] += order.totalAmount || 0;
    });
    return dailyData;
  };

  //monthly chart
  useEffect(() => {
    const monthlyData = salesOverTimeMonthly();
    const labelKeys = Object.keys(monthlyData);

    const dataValues = Object.values(monthlyData);
    const year = new Date().getFullYear();

    const barChart = new Chart(barRef.current, {
      type: "bar",
      data: {
        labels: labelKeys,
        datasets: [
          {
            // label: "Sales over Month-- Monthly",
            data: dataValues,
            borderWidth: 1,
            backgroundColor: "#b45309",
            hoverBackgroundColor: "#d97706",
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          //makes the item toolpick  display on hover
          mode: "nearest",
          intersect: false,
        },
        hover: {
          //makes the item toolpick  display on hover
          mode: "nearest",
          intersect: false,
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: theme ? "#E0E0E0" : "#333333",
            },
          },
          y: {
            beginAtZero: true,
            grid: {
              color: theme
                ? "rgba(255, 255, 255, 0.1)"
                : "rgba(128, 128, 128, 0.5)",
              borderDash: [10, 5],
              drawOnChartArea: true,
            },
            ticks: {
              color: theme ? "#B0B0B0" : "#666666",
              callback: (value) => `$${value}`,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: true,
            text: `Sales Over Time - Monthly(${year})`,
            align: "start",
            color: theme ? "#E0E0E0" : "#333333",
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              bottom: 30,
            },
          },
        },
      },
    });

    return () => {
      barChart.destroy();
    };
  }, [theme,orders]);

  // Daily Chart
  useEffect(() => {
    const dailyData = salesOverTimeDaily();
    const labelKeys = Object.keys(dailyData);
    const dataValues = Object.values(dailyData);
    const date = new Date();
    const month = date.toLocaleDateString("default", { month: "short" });

    const dailyChart = new Chart(dailyRef.current, {
      type: "line",
      data: {
        labels: labelKeys,
        datasets: [
          {
            label: "Daily Sales ($)",
            data: dataValues,
            fill: false,
            borderColor: "#b45309",
            backgroundColor: "white",
            hoverBackgroundColor: "#d97706",
            tension: 0.3,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: "Sales Per Day ($)",
            align: "start",
            color: theme ? "#E0E0E0" : "#333333",
            font: {
              size: 18,
              weight: "bold",
            },
            padding: {
              bottom: 30,
            },
          },
          legend: {
            display: false,
          },
          datalabels: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              borderDash: [6, 4], // dashed grid lines
              color: theme ? "#E0E0E0" : "#333333", // optional
            },
            ticks: {
              callback: (value) => `$${value}`,
              color: theme ? "#B0B0B0" : "#666666", // y-axis text
            },
          },
          x: {
            ticks: {
              color: theme ? "#B0B0B0" : "#666666", // x-axis labels
            },
            grid: {
              display: false, // optional: no vertical grid lines
            },
          },
        },
      },
    });

    return () => {
      dailyChart.destroy();
    };
  }, [theme,orders]);

  return (
    <>
      {/*monthly */}
      <div
        className={`flex flex-col md:items-center md:col-span-2 lg:h-72  lg:col-span-2 py-4  
             rounded-lg border ${
               theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
             } 
            
             `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div className="w-full overflow-x-auto hide-scrollbar-lg px-4 ">
          <div className="min-w-[800px]">
            <canvas ref={barRef} className="w-full h-64" />
          </div>
        </div>
      </div>

      {/*daily */}
      <div
        className={`flex flex-col md:items-center  md:col-span-2 lg:col-span-4 py-4 h-full  
              rounded-lg border ${
                theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
              } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div className="w-full overflow-x-auto hide-scrollbar-lg px-4 lg:px-8">
          <div className="min-w-[800px] max-w-[1200px] mx-auto">
            <canvas ref={dailyRef} className="w-full h-64"></canvas>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardCharts;
