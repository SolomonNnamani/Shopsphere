import { useState, useEffect } from "react";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import allCustomers from "../../reuseable/svg/customers.svg";
import newCustomerSvg from "../../reuseable/svg/customer.svg";

const CustomerStats = ({ customers, theme,previousCustomersCount, newCustomersThisMonth,newCustomersLastMonth }) => {
  const [totalCustomersCount, setTotalCustomersCount] = useState("0");
  const [totalCustomersChange, setTotalCustomersChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [newCustomersCount, setNewCustomersCount] = useState("");
  const [newCustomersChange, setNewCustomersChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [monthLabel, setMonthLabel] = useState("");

  useEffect(() => {
    //total Customers
    const calculateTotalCustomersStats = () => {
      const currentCustomerscount = customers.length;
      const percentageChange =
        previousCustomersCount === 0
          ? 100
          : ((currentCustomerscount - previousCustomersCount) /
              previousCustomersCount) *
            100;
      setTotalCustomersCount(currentCustomerscount.toLocaleString());
      setTotalCustomersChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateTotalCustomersStats();

//New Customers
    const calculateNewCustomersMonthly = () => {
      const now = new Date();
      const monthLabel = now.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });
      
      const currentNewCustomersCount = newCustomersThisMonth
      

      const percentageChange =
        newCustomersLastMonth === 0
          ? 100
          : ((currentNewCustomersCount - newCustomersLastMonth) / newCustomersLastMonth) * 100;

      setNewCustomersCount(currentNewCustomersCount.toLocaleString());
      setNewCustomersChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
      setMonthLabel(monthLabel);
    };
    calculateNewCustomersMonthly();
  }, [customers, previousCustomersCount, newCustomersThisMonth, newCustomersLastMonth]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2  gap-4 lg:gap-40  my-5">
      {/*total Customers*/}
      <div
        className={`flex flex-col  lg:flex-col  lg:h-73
         p-5 rounded-lg border row-span-2
          ${theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "} `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
          <p className="text-xs">Total Customers</p>
          <p className="flex gap-5  lg:justify-start items-center ">
            <span
              className={`text-2xl font-bold  ${
                theme ? "headerDark" : "headerLight"
              } `}
            >
              {totalCustomersCount}{" "}
            </span>
            <span
              className={`text-xs flex items-center ${
                totalCustomersChange.isPositive
                  ? "text-green-500"
                  : "text-red-500"
              } `}
            >
              {totalCustomersChange.isPositive ? (
                <>
                  {" "}
                  <FaArrowUpLong /> +
                </>
              ) : (
                <>
                  {" "}
                  <FaArrowDownLong /> -
                </>
              )}
              {totalCustomersChange.value}%{" "}
            </span>
          </p>
        </div>
        <img
          src={allCustomers}
          alt="all Customers"
          className="w-72 m-auto md:w-62 md:h-full "
        />
      </div>

      {/*New Customers*/}
      <div
        className={`flex flex-col  lg:flex-col  lg:h-73
         p-5 rounded-lg border row-span-2
          ${theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "} `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
          <p className="text-xs">
            New Customers <span className="ml-1 italic">({monthLabel})</span>
          </p>

          <p className="flex gap-5  lg:justify-start items-center ">
            <span
              className={`text-2xl font-bold  ${
                theme ? "headerDark" : "headerLight"
              } `}
            >
              {newCustomersCount}{" "}
            </span>
            <span
              className={`text-xs flex items-center ${
                newCustomersChange.isPositive
                  ? "text-green-500"
                  : "text-red-500"
              } `}
            >
              {newCustomersChange.isPositive ? (
                <>
                  {" "}
                  <FaArrowUpLong /> +
                </>
              ) : (
                <>
                  {" "}
                  <FaArrowDownLong /> -
                </>
              )}
              {newCustomersChange.value}%{" "}
            </span>
          </p>
          <p className="text-[10px] text-gray-400 italic">
            Resets monthly on the 1st
          </p>
        </div>
        <img
          src={newCustomerSvg}
          alt="new Customers"
          className="w-62 m-auto md:w-52 md:h-42 "
        />
      </div>
    </div>
  );
};
export default CustomerStats;
