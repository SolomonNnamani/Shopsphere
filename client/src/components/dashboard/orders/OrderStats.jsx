import { useState, useEffect } from "react";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import totalDelivery from "../../reuseable/svg/totalDelivery.svg";
import totalOrders from "../../reuseable/svg/totalOrders.svg";
import pendingOrder from "../../reuseable/svg/pendingOrder.svg";
import confirmOrder from "../../reuseable/svg/confirmOrder.svg";
import emptyCart from "../../reuseable/svg/emptyCart.svg";

const OrderStats = ({
 orders, 
 theme,
 previousCount,
 previousDeliveredCount,
 previousPendingCount,
 previousProcessingCount,
 previousCancelledCount,


  }) => {
  const [totalOrderCount, setTotalOrderCount] = useState("");
  const [totalOrderChange, setTotalOrderChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [totalDeliveryCount, setTotalDeliveryCount] = useState("");
  const [totalDeliveryChange, setTotalDeliveryChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [totalPendingCount, setTotalPendingCount] = useState("");
  const [totalPendingChange, setTotalPendingChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [totalProcessingCount, setTotalProcessingCount] = useState("");
  const [totalProcessingChange, setTotalProcessingChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [totalCancelledCount, setTotalCancelledCount] = useState("");
  const [totalCancelledChange, setTotalCancelledChange] = useState({
    value: "0.0",
    isPositive: true,
  });

  useEffect(() => {
    //total Orders
    const calculateOrderStats = () => {
      const currentOrderCount = orders.length;
      

      const percentageChange =
        previousCount === 0
          ? 100 //avoid division by 0
          : ((currentOrderCount - previousCount) / previousCount) *
            100;

      setTotalOrderCount(currentOrderCount.toLocaleString());
      setTotalOrderChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateOrderStats();

    //Delivered Orders
    const calculateDeliveryStats = () => {
      const currentDeliveryCount = orders.filter(
        (order) => order && order.orderStatus === "delivered"
      ).length;
      

      const percentageChange =
        previousDeliveredCount === 0
          ? 100
          : ((currentDeliveryCount - previousDeliveredCount) /
              previousDeliveredCount) *
            100;

      setTotalDeliveryCount(currentDeliveryCount.toLocaleString());
      setTotalDeliveryChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateDeliveryStats();

    //Pending Orders
    const calculatePendingStats = () => {
      const currentPendingCount = orders.filter(
        (order) => order && order.orderStatus === "pending"
      ).length;
      

      const percentageChange =
        previousPendingCount === 0
          ? 100
          : ((currentPendingCount - previousPendingCount) /
              previousPendingCount) *
            100;

      setTotalPendingCount(currentPendingCount.toLocaleString());
      setTotalPendingChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculatePendingStats();

    //Processing Orders
    const calculateProcessingStats = () => {
      const currentProcessingCount = orders.filter(
        (order) => order && order.orderStatus === "processing"
      ).length;
      

      const percentageChange =
        previousProcessingCount === 0
          ? 100
          : ((currentProcessingCount - previousProcessingCount) /
              previousProcessingCount) *
            100;

      setTotalProcessingCount(currentProcessingCount.toLocaleString());
      setTotalProcessingChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateProcessingStats();

    //Cancelled Orders
    const calculateCancelledStats = () => {
      const currentCancelledCount = orders.filter(
        (order) => order && order.orderStatus === "cancelled"
      ).length;
      

      const percentageChange =
        previousCancelledCount === 0
          ? 100
          : ((currentCancelledCount - previousCancelledCount) /
              previousCancelledCount) *
            100;

      setTotalCancelledCount(currentCancelledCount.toLocaleString());
      setTotalCancelledChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateCancelledStats();
  }, [orders, previousCount, previousDeliveredCount, previousPendingCount, previousProcessingCount,
 previousCancelledCount,]);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-5  my-5">
      {/*All Orders*/}
      <div
        className={`flex flex-col  lg:flex-col  lg:h-73
         p-5 rounded-lg border row-span-2
          ${theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "} `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
          <p className="text-xs">Total Orders</p>
          <p className="flex gap-5  lg:justify-start items-center ">
            <span
              className={`text-2xl font-bold  ${
                theme ? "headerDark" : "headerLight"
              } `}
            >
              {totalOrderCount}{" "}
            </span>
            <span
              className={`text-xs flex items-center ${
                totalOrderChange.isPositive ? "text-green-500" : "text-red-500"
              } `}
            >
              {totalOrderChange.isPositive ? (
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
              {totalOrderChange.value}%{" "}
            </span>
          </p>
        </div>
        <img
          src={totalOrders}
          alt="total Orders"
          className="w-72 h-72 m-auto md:w-full md:h-full "
        />
      </div>

      {/*All Delivered*/}
      <div
        className={`flex flex-col md:flex-row lg:flex-col md:h-62 lg:h-73 p-5 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
          <p className="text-xs">Delivered Orders</p>
          <p className="flex gap-5  lg:justify-start items-center ">
            <span
              className={`text-2xl font-bold  ${
                theme ? "headerDark" : "headerLight"
              } `}
            >
              {totalDeliveryCount}{" "}
            </span>
            <span
              className={`text-xs flex items-center ${
                totalDeliveryChange.isPositive
                  ? "text-green-500"
                  : "text-red-500"
              } `}
            >
              {totalDeliveryChange.isPositive ? (
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
              {totalDeliveryChange.value}%{" "}
            </span>
          </p>
        </div>
        <img
          src={totalDelivery}
          alt="Delivery"
          className="w-[32rem] h-46 m-auto md:h-32 md:w-[15rem] lg:w-[32rem] lg:h-25 "
        />
      </div>

      {/*All Pending*/}

      <div
        className={`flex flex-col md:flex-row lg:flex-col md:h-62 lg:h-73 p-5 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div className=" ">
          <p className="text-xs">Pending Orders</p>
          <p className="flex gap-5 md:justify-between lg:justify-start items-center ">
            <span
              className={`text-2xl font-bold  ${
                theme ? "headerDark" : "headerLight"
              } `}
            >
              {totalPendingCount}{" "}
            </span>
            <span
              className={`text-xs flex items-center ${
                totalPendingChange.isPositive
                  ? "text-green-500"
                  : "text-red-500"
              } `}
            >
              {totalPendingChange.isPositive ? (
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
              {totalPendingChange.value}%{" "}
            </span>
          </p>
        </div>
        <img
          src={pendingOrder}
          alt="pending Orders"
          className="w-52 h-52 m-auto"
        />
      </div>

      {/*All Processing*/}
      <div
        className={`flex flex-col md:flex-row lg:flex-col md:h-62 lg:h-73 p-5 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
          <p className="text-xs">Processing Orders</p>
          <p className="flex gap-5  lg:justify-start items-center ">
            <span
              className={`text-2xl font-bold  ${
                theme ? "headerDark" : "headerLight"
              } `}
            >
              {totalProcessingCount}{" "}
            </span>
            <span
              className={`text-xs flex items-center ${
                totalProcessingChange.isPositive
                  ? "text-green-500"
                  : "text-red-500"
              } `}
            >
              {totalProcessingChange.isPositive ? (
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
              {totalProcessingChange.value}%{" "}
            </span>
          </p>
        </div>
        <img
          src={confirmOrder}
          alt="processing Orders"
          className="w-72 h-62 m-auto "
        />
      </div>

      {/*All Cancelled*/}

      <div
        className={`flex flex-col md:flex-row lg:flex-col  md:h-62 lg:h-73 p-5 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
          <p className="text-xs">Cancelled Orders</p>
          <p className="flex gap-5 md: lg:justify-start items-center  ">
            <span
              className={`text-2xl font-bold  ${
                theme ? "headerDark" : "headerLight"
              } `}
            >
              {totalCancelledCount}{" "}
            </span>
            <span
              className={`text-xs  flex items-center ${
                totalCancelledChange.isPositive
                  ? "text-red-500"
                  : "text-green-500"
              } `}
            >
              {totalCancelledChange.isPositive ? (
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
              {totalCancelledChange.value}%{" "}
            </span>
          </p>
        </div>
        <img
          src={emptyCart}
          alt="cancelled Orders"
          className="w-72 h-62 m-auto md:w-52 md:h-52 "
        />
      </div>
    </div>
  );
};

export default OrderStats;
