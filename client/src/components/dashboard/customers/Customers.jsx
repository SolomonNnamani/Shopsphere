import React, { useState, useEffect } from "react";
import CustomerStats from "./CustomerStats";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../reuseable/Pagination";
import {toast} from 'react-toastify'
import {fetchWithAuth} from '../utils/fetchWithAuth.js';


const Customers = ({ theme, setLoading }) => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(customers);
    const [currentPage, setCurrentPage] = useState(1)
    const [previousCustomersCount, setPreviousCustomersCount] = useState(0)
    const [newCustomersThisMonth, setNewCustomersThisMonth] = useState(0)
    const [newCustomersLastMonth, setNewCustomersLastMonth] = useState(0)

     useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      try {
        const res = await fetchWithAuth('/dashboard/customers'); 
        const data = await res.json();
        
        setCustomers(data?.customers || []);
        setPreviousCustomersCount(data?.previousCustomersCount || 0)
        setNewCustomersThisMonth(data?.currentNewCustomersCount || 0)
        setNewCustomersLastMonth(data?.previousNewCustomersCount || 0)

        
      } catch (err) {
        console.error("Failed to fetch Customer details", err);
        toast.error('Failed to fetch customer datails, please check your network')
      }finally{
        setLoading(false)
      }
    };

    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1)
  };

  useEffect(() => {
    const filterCustomers =
      search.trim() === ""
        ? customers
        : customers.filter((cust) => {
            const regex = new RegExp(search, "i");
            return (
              cust._id.match(regex) ||
              cust.firstName.match(regex) ||
              cust.lastName.match(regex) ||
              cust.email.match(regex)
            );
          });
    
    setFiltered(filterCustomers);
  }, [customers, search]);

//Pagination
  const itemsPerPage = 10; //  Customize how many items per page
  const indexOfLastItem = currentPage * itemsPerPage; //1 * 10 = 10
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 10-10 = 0
  const currentCustomers = filtered.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); //slice(0,10)
  const totalPages = Math.ceil(filtered.length / itemsPerPage); //Math.ceil(15/10) = 2 paginated pages


function formatInternationalPhone(rawPhone) {
// Use regex to split into likely country code (up to 4 digits) and the rest
  const match = rawPhone.match(/^(\d{1,3})(\d{6,})$/);
  if (!match) return rawPhone; // fallback if unexpected format

  const countryCode = match[1];
  const localNumber = match[2];

  // Optional: space out the local number for readability
  const formattedLocal = localNumber.replace(/(\d{3})(?=\d)/g, '$1 ');

  return `(+${countryCode}) ${formattedLocal.trim()}`;
}

  return (
    <div className="py-5 px-3 md:px-2 lg:px-30">
      <div>
        <p className="text-xs">Know Your Customers </p>
        <h2
          className={`text-2xl font-bold  ${
            theme ? "headerDark" : "headerLight"
          }`}
        >
          Customer Insights
        </h2>
      </div>

      <CustomerStats 
        customers={customers} 
        theme={theme} 
        previousCustomersCount={previousCustomersCount}
         newCustomersThisMonth = { newCustomersThisMonth}  
         newCustomersLastMonth = { newCustomersLastMonth}
      />

      <div
        className={`my-5 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <h2
          className={`text-lg font-bold p-3 ${
            theme ? "headerDark " : "headerLight "
          }`}
        >
          Customers
        </h2>

        {/**Search input */}
        <div
          className={`flex items-center gap-2   p-2 border-y ${
            theme ? "border-[#3d4b55]" : "border-gray-300  "
          }  `}
        >
          <input
            type="text"
            name="search"
            value={search}
            placeholder=" search customers..."
            onChange={handleChange}
            className={`w-[12rem] md:w-[15rem] h-[2.4rem] p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${
              theme ? "placeholder:text-white " : "placeholder:text-slate-300"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />
          <FaSearch className="text-2xl " />
        </div>

        <div className="relative w-full  overflow-x-scroll hide-scrollbar-lg">
          <table className="table-fixed min-w-[800px] w-full    border-collapse ">
            <thead>
              <tr className="text-center">
                <th className="p-3 w-[180px] break-words ">CUSTOMER ID</th>
               <th className="w-[120px] break-words">NAME</th>
               <th className="w-[200px] break-words">EMAIL</th>
               <th className="w-[130px] break-words">PHONE</th>
                <th className="p-3 w-[120px] break-words">JOIN DATE</th>
              </tr>
            </thead>
            <tbody>
              {currentCustomers.length > 0 ? (
                currentCustomers.map((user) => {
                  const date = new Date(user.createdAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  );
                  return (
                    <tr
                      key={user._id}
                      className={` border-y  ${
                        theme ? "border-[#3d4b55]" : "border-gray-300 "
                      }`}
                    >
                      <td className="p-3 w-[180px] break-words font-bold text-center ">
                        {user._id}{" "}
                      </td>
                      <td
                        className={` font-medium w-[120px] break-words text-sm text-center  ${
                          theme ? "headerDark" : "headerLight"
                        }`}
                      >
                        {user.firstName} {user.lastName}
                      </td>
                      <td
                        className={` font-medium w-[200px] break-words text-sm text-center  ${
                          theme ? "headerDark" : "headerLight"
                        }`}
                      >
                        {user.email}{" "}
                      </td>
                      <td
                        className={` font-medium w-[130px] break-words text-sm text-center  ${
                          theme ? "headerDark" : "headerLight"
                        }`}
                      >
                        {formatInternationalPhone(user.phone)}
                      </td>
                      <td
                        className={` font-medium w-[130px] break-words text-sm text-center  ${
                          theme ? "headerDark" : "headerLight"
                        }`}
                      >
                        {date}{" "}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-gray-500">
                    {" "}
                    No customer accounts found{" "}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
       <Pagination
    currentPage = {currentPage}
    total = {totalPages}
    setCurrentPage={setCurrentPage}
     />
     
    </div>
  );
};

export default Customers;
