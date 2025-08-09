import React, { useState,useEffect } from "react";
import DashboardStats from "./DashboardStats";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'
import {toast} from 'react-toastify'

const Dashboard = ({ theme }) => {
  const [orders, setOrders] = useState([ ]);
  const  [previousCount, setPreviousCount] = useState(0)
  const  [todaySales, setTodaySales] = useState(0)
  const  [yesterdaySales, setYesterdaySales] = useState(0)
  const  [todayRevenue, setTodayRevenue] = useState(0)
  const  [yesterdayRevenue, setYesterdayRevenue] = useState(0)
  const [customers, setCustomers] = useState([])
  const [previousCustomersCount, setPreviousCustomersCount] = useState(0)


  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchWithAuth('/dashboard/orders'); 
        const data = await res.json();
        setOrders(data?.orders || []);
        setPreviousCount(data?.previousCount || 0)
        setTodaySales(data?.todaySales || 0)
        setYesterdaySales(data?.yesterdaySales || 0)
        setTodayRevenue(data?.todayRevenue || 0)
        setYesterdayRevenue(data?.yesterdayRevenue || 0)
        
      } catch (err) {
        console.error("Failed to fetch orders", err);
        toast.error('Failed to load your order, please check your network')
      }
    };

    fetchOrders();
  }, []);

   useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchWithAuth('/dashboard/customers'); 
        const data = await res.json();
        console.log(data.customers)
        setCustomers(data.customers || []);
        setPreviousCustomersCount(data?.previousCustomersCount || 0)
        

        
      } catch (err) {
        console.error("Failed to fetch Customer details", err);
        toast.error('Failed to fetch customer datails, please check your network')
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className=" py-5 px-3 md:px-2 lg:px-30">
      <div>
        <p className="text-xs">OVERVIEW </p>
        <h2
          className={`text-2xl font-bold  ${
            theme ? "headerDark" : "headerLight"
          }`}
        >
          Dashboard
        </h2>
      </div>

      <DashboardStats 
        theme={theme}
         orders={orders} 
         previousCount = {previousCount}
         todaySales={todaySales}
         yesterdaySales={yesterdaySales}
         todayRevenue={todayRevenue}
         yesterdayRevenue={yesterdayRevenue}
         customers = {customers}
         previousCustomersCount = {previousCustomersCount}

       />
    </div>
  );
};

export default Dashboard;
