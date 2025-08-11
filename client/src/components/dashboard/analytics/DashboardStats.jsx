import React, { useState, useEffect } from "react";
import WelcomeSvg from "../../reuseable/svg/welcome.svg";
import SalesSvg from "../../reuseable/svg/sales.svg";
import OrderSvg from "../../reuseable/svg/order.svg";
import RevenueSvg from "../../reuseable/svg/revenue.svg";
import CustomersSvg from "../../reuseable/svg/customer.svg";
import DashboardCharts from "./DashboardCharts";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import {fetchWithAuth} from '../utils/fetchWithAuth.js';

const DashboardStats = ({ 
  theme, 
  orders,
  setLoading,
  previousCount,
  todaySales,
  yesterdaySales,
  todayRevenue,
  yesterdayRevenue,
  customers,
  previousCustomersCount

   }) => {
  const [totalSales, setTotalSales] = useState("0");
  const [totalSalesChange, setTotalSalesChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [totalOrders, setTotalOrders] = useState("0");
  const [totalOrdersChange, setTotalOrdersChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [totalRevenue, setTotalRevenue] = useState("0");
  const [totalRevenueChange, setTotalRevenueChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [totalCustomers, setTotalCustomers] =
    useState("0");
  const [totalCustomersChange, setTotalCustomersChange] = useState({
    value: "0.0",
    isPositive: true,
  });
    const [notifications, setNotifications] = useState([]);
    


useEffect(()=> {
     const fetchNotifications = async() =>{
    try{
      const res = await fetchWithAuth("/api/dashboard/notifications");
      const data = await res.json();
     
      setNotifications(data)
    } catch(err){
      console.log("Notification fetch error:", err.message);
    }finally{
      setLoading(false)
    }
  }
fetchNotifications()
},[])
   

  useEffect(() => {
    //total Sales
const calculateSalesStat = () => {
    const currentSalesValue = todaySales
      
      let percentageChange = yesterdaySales === 0
      ? 100
      : ((currentSalesValue - yesterdaySales) / yesterdaySales )*100;
      setTotalSales(currentSalesValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }));
      setTotalSalesChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });

    
  };

      //total Orders
    const calculateOrderStats = () => {
      const currentOrderCount = orders.length;
      

      const percentageChange =
        previousCount === 0
          ? 100 //avoid division by 0
          : ((currentOrderCount - previousCount) / previousCount) *
            100;

      setTotalOrders(currentOrderCount.toLocaleString());
      setTotalOrdersChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };


     //All Revenue
  const calculateRevenueStats = () => {
    const currentRevenueValue = todayRevenue
      
      let percentageChange = yesterdayRevenue === 0
      ? 100
      : ((currentRevenueValue - yesterdayRevenue) / yesterdayRevenue )*100;
      setTotalRevenue(currentRevenueValue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            }));
      setTotalRevenueChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    
  }

//total Customers
 const calculateTotalCustomersStats = () => {
     
      const currentCustomerscount = customers.length;
      const percentageChange =
        previousCustomersCount === 0
          ? 100
          : ((currentCustomerscount - previousCustomersCount) /
              previousCustomersCount) *
            100;
      setTotalCustomers(currentCustomerscount.toLocaleString());
      setTotalCustomersChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
   
   


calculateSalesStat()
 calculateOrderStats();
 calculateRevenueStats()
  calculateTotalCustomersStats();

  },[orders,previousCount,todaySales,yesterdaySales,todayRevenue,
    yesterdayRevenue,customers, previousCustomersCount])


   const unreadCount = notifications?.filter((n) => !n.isRead).length


 
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4  my-5">
      {/*Welcome*/}
      <div
        className={`flex flex-col md:flex-row  md:col-span-2  p-5 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
          <h2
            className={`text-xl font-bold  ${
              theme ? "headerDark" : "headerLight"
            } `}
          >
            Welcome back, Shelby
          </h2>
          <p className="text-sm tracking-wider">
            {" "}
            You’ve got {unreadCount} new notifications waiting for you.
          </p>
        </div>
        <img src={WelcomeSvg} alt="Welcome" className="w-62 h-62 m-auto" />
      </div>

      {/*Sales*/}
      <div
        className={`flex flex-col   p-5 md:h-62 lg:h-73 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
          <p className="text-xs">TOTAL SALES</p>
          <p className="flex gap-5 md:justify-between lg:justify-start items-center ">
              <span
                className={`text-2xl font-bold  ${
                  theme ? "headerDark" : "headerLight"
                } `}
              >
                {totalSales}
              </span>
              <span
                className={`text-xs flex items-center ${
                  totalSalesChange.isPositive ? "text-green-500" : "text-red-500"
                } `}
              >
                {totalSalesChange.isPositive ? (
                  <>
                    <FaArrowUpLong /> +
                  </>
                ) : (
                  <>
                    <FaArrowDownLong /> -
                  </>
                )}
                {totalSalesChange.value}%
              </span>
            </p>
             <p className="text-[10px] text-gray-400 italic">
            on successful delivery
          </p>
        </div>
        <img
          src={SalesSvg}
          alt="Sales image"
          className="w-92 md:w-52 lg:w-full h-62 m-auto"
        />
      </div>

      {/*Order*/}
      <div
        className={`flex flex-col md:flex-row lg:flex-col md:h-62   lg:h-73 p-5  rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
           <p className="text-xs">TOTAL ORDERS</p>
          <p className="flex gap-5 md:justify-between lg:justify-start items-center ">
              <span
                className={`text-2xl font-bold  ${
                  theme ? "headerDark" : "headerLight"
                } `}
              >
                {totalOrders}
              </span>
              <span
                className={`text-xs flex items-center ${
                  totalOrdersChange.isPositive ? "text-green-500" : "text-red-500"
                } `}
              >
                {totalOrdersChange.isPositive ? (
                  <>
                    <FaArrowUpLong /> +
                  </>
                ) : (
                  <>
                    <FaArrowDownLong /> -
                  </>
                )}
                {totalOrdersChange.value}%
              </span>
            </p>
        </div>
        <img src={OrderSvg} alt="Order image" className="w-72 h-62  md:h-52  m-auto" />
      </div>

      {/*Revenue*/}
      <div
        className={`flex flex-col  md:h-62 lg:h-72   p-5 lg:col-span-1 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
           <p className="text-xs">REVENUE</p>
          <p className="flex gap-5 md:justify-between lg:justify-start items-center ">
              <span
                className={`text-2xl font-bold  ${
                  theme ? "headerDark" : "headerLight"
                } `}
              >
                {totalRevenue}
              </span>
              <span
                className={`text-xs flex items-center ${
                  totalRevenueChange.isPositive ? "text-green-500" : "text-red-500"
                } `}
              >
                {totalRevenueChange.isPositive ? (
                  <>
                    <FaArrowUpLong /> +
                  </>
                ) : (
                  <>
                    <FaArrowDownLong /> -
                  </>
                )}
                {totalRevenueChange.value}%
              </span>
            </p>
             <p className="text-[10px] text-gray-400 italic">
            on all orders
          </p>
        </div>
        <img
          src={RevenueSvg}
          alt="Revenue image"
          className="w-62 h-62  m-auto md:w-45 lg:w-55"
        />
      </div>

      {/*Customers*/}
      <div
        className={`flex flex-col md:flex-row lg:flex-col  md:h-62 lg:h-72  p-5 lg:col-span-1 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <div>
           <p className="text-xs">CUSTOMERS</p>
          <p className="flex gap-5 md:justify-between lg:justify-start items-center ">
              <span
                className={`text-2xl font-bold  ${
                  theme ? "headerDark" : "headerLight"
                } `}
              >
                {totalCustomers}
              </span>
              <span
                className={`text-xs flex items-center ${
                  totalCustomersChange.isPositive ? "text-green-500" : "text-red-500"
                } `}
              >
                {totalCustomersChange.isPositive ? (
                  <>
                    <FaArrowUpLong /> +
                  </>
                ) : (
                  <>
                    <FaArrowDownLong /> -
                  </>
                )}
                {totalCustomersChange.value}%
              </span>
            </p>
            
        </div>

        <img
          src={CustomersSvg}
          alt="customer image"
          className="w-72 h-62 md:h-42 m-auto md:w-52 "
        />
      </div>

      <DashboardCharts theme={theme} orders={orders} />
    </div>
  );
};

export default DashboardStats;
