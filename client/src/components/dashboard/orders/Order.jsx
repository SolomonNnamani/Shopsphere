import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import OrderStats from "./OrderStats.jsx";
import { FaCircle } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { FaSearch } from "react-icons/fa";
import Pagination from "../../reuseable/Pagination";
import {fetchWithAuth} from '../utils/fetchWithAuth.js';
import { IoMdClose } from "react-icons/io";



const Order = ({ theme, setLoading }) => {
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEditingId, setIsEditingId] = useState(null);
  const [orderStatus, setOrderStatus] = useState("");
  const [isDropDownId, setIsDropDownId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [previousCount, setPreviousCount] = useState(0)
  const [previousDeliveredCount, setPreviousDeliveredCount] = useState(0)
  const [previousPendingCount, setPreviousPendingCount] = useState(0)
  const [previousProcessingCount, setPreviousProcessingCount] = useState(0)
  const [previousCancelledCount, setPreviousCancelledCount] = useState(0)
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState(orders);
  const [currentPage, setCurrentPage] = useState(1)
  const [modalLoading, setModalLoading] = useState(false)


    useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetchWithAuth('/dashboard/orders'); 
        const data = await res.json();
       
        setOrders(data?.orders || []);
        setPreviousCount(data?.previousCount || 0)
        setPreviousDeliveredCount(data?.previousDeliveredCount || 0)
        setPreviousPendingCount(data?.previousPendingCount || 0)
        setPreviousProcessingCount(data?.previousProcessingCount || 0)
        setPreviousCancelledCount(data?.previousCancelledCount || 0)
      } catch (err) {
        console.error("Failed to fetch orders", err);
        toast.error('Failed to load your order, please check your network')
      }
    };

    fetchOrders();
  }, []);


  const handleChange = (e) => {
    setOrderStatus(e.target.value);
    
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1)
  }

  const handleSave = async (order) => {
     const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{
    
    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `/dashboard/order/updateOrder/${order._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderStatus }),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        toast.error(
          data.error || "Something went wrong while updating this order."
        );
      } else {
        toast.success(data.message || "Order updated successfully");
        setOrders((prev) => prev.map((o) => o._id === order._id ? {...o, orderStatus:orderStatus} : o ))

      }
    } catch (error) {
      console.log(error);
      toast.error("Couldn't update this order, please check your network!");
    } finally {
      setLoading(false);
    }
  }
  };

  const handleEditToggle = (order) => {
    if (isEditingId === order._id) {
      handleSave(order);
      setIsEditingId(null);
    } else {
      setIsEditingId(order._id);
      setOrderStatus(orderStatus );
    }
  };
  const toggleDropDown = (order) => {
    if (isDropDownId === order._id) {
      setIsDropDownId(null);
    } else {
      setIsDropDownId(order._id);
    }
  };


 


   useEffect(() => {
    const filterOrders =
      search.trim() === ""
        ? orders
        : orders.filter((o) => {
            const regex = new RegExp(search, "i");
            return (
              o.customer.match(regex) ||
              o.status.match(regex) ||
              o.country.match(regex) ||
               o.shippingAddress.match(regex)||
               o.items.some((item) => regex.test(item.product))
            );
          });
    //console.log(filterOrders);
    setFiltered(filterOrders);
  }, [orders, search]);





  //Pagination
  const itemsPerPage = 10; //  Customize how many items per page
  const indexOfLastItem = currentPage * itemsPerPage; //1 * 10 = 10
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 10-10 = 0
  const currentOrders = filtered.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); //slice(0,10)
  const totalPages = Math.ceil(filtered.length / itemsPerPage); //Math.ceil(15/10) = 2 paginated pages


//This uses the browser's built-in internationalization API and works for all ISO country codes. It will automatically convert "NG" to "Nigeria", "US" to "United States"
const regionNames = new Intl.DisplayNames(['en'], {type:'region'});

//for formating country numbers
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

//sum the order price
const sumOrder = (items) => {
 return items.reduce((acc,item)=> acc + item.price * item.qty,0).toFixed(2)

}

// Modify your View Details button click handler
const handleViewDetails = async(order) => {
  try{
    // STEP 1: Immediately show loading spinner to give user feedback
    // This prevents the "nothing happening" feeling when user clicks
    setModalLoading(true)

        // STEP 2: THE MAGIC 100ms DELAY - This is the key to fixing mobile issues!
    // WHY THIS WORKS: Gives React time to complete the first render cycle
    // (showing the loading spinner) before we proceed to the next steps.
    // Without this, state changes happen too fast and mobile browsers
    // can't keep up, resulting in white screens.

    await new Promise(resolve => setTimeout(resolve, 100));

    //Verify order has required data
    if(!order || !order._id || !order.cartItems || !order.deliveryData){
      throw new error('incomplete order data')
    }

// STEP 4: Finally set the order data - this triggers modal content to show
    setSelectedOrder(order)

  }catch(error){
    console.log('Error opening order details:', error)
    toast.error('Error loading order details');
  }finally{
    setModalLoading(false)
  }
}


  return (
    <div className="py-5 px-3 md:px-2 lg:px-30">
      <div>
        <p className="text-xs">Manage Orders Seamlessly </p>
        <h2
          className={`text-2xl font-bold  ${
            theme ? "headerDark" : "headerLight"
          }`}
        >
          Order Management
        </h2>
      </div>
      <OrderStats 
        orders={orders} 
        theme={theme} 
        previousCount={previousCount}
        previousDeliveredCount={previousDeliveredCount}
        previousPendingCount={previousPendingCount}
        previousProcessingCount={previousProcessingCount}
        previousCancelledCount={previousCancelledCount}



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
          className={`text-lg font-bold p-3  ${
            theme
              ? "headerDark border-[#3d4b55]"
              : "headerLight border-gray-300  shadow-sm "
          }`}
        >
          Orders
        </h2>

         {/**Search input */}
        <div
          className={`flex items-center gap-2  p-2 border-y ${
            theme ? "border-[#3d4b55]" : "border-gray-300  "
          }  `}
        >
          <input
            type="text"
            name="search"
            value={search}
            placeholder=" search customers..."
            onChange={handleSearchChange}
            className={`searchInput p-2  rounded-lg 
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



        {/**Order table */}
        <div className="relative min-h-screen w-full overflow-x-scroll hide-scrollbar-lg">
          <table className="table-fixed min-w-[800px] w-full text-left border-collapse ">
            <thead>
              <tr>
                <th className="p-3 ">ORDER ID</th>
                <th className="py-3">CUSTOMER</th>
                <th className="py-3 text-center">PRODUCT</th>
                <th className="py-3 w-30 text-center">STATUS</th>
                <th className="py-3 text-center">AMOUNT</th>
                <th className="py-3 text-center ">DETAILS</th>
                <th className="p-3 text-center w-40">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders?.length > 0 ? (
                currentOrders?.map((order) => (
                  <tr
                    key={order._id}
                    className={` border-y  ${
                      theme ? "border-[#3d4b55]" : "border-gray-300 "
                    }`}
                  >
                    <td className="p-3 font-bold "> {order.orderNumber} </td>
                    <td
                      className={` font-medium text-sm  ${
                        theme ? "headerDark" : "headerLight"
                      }`}
                    >
                      
                      {order.deliveryData.firstname} {order.deliveryData.lastname}
                    </td>

                    <td
                      className={` font-medium text-sm  py-3 text-center ${
                        theme ? "headerDark" : "headerLight"
                      }`}
                    >
                      {order.cartItems.map((item) => item.productName).join(", ")}
                    </td>

                    <td >
                      {/**Status */}
                      {isEditingId === order._id ? (
                        <select
                          value={orderStatus}
                          onChange={handleChange}
                          style={{
                            background: `${
                              theme
                                ? "rgb(23, 29, 33)"
                                : "rgba(128,128,128,0.3) "
                            } `,
                          }}
                        >
                          <option value="delivered">Delivered</option>
                          <option value="shipped">Shipped </option>
                          <option value="processing">Processing</option>
                         <option value="cancelled">Cancelled </option> 
                          <option value="pending" >Pending </option>
                        </select>
                      ) : order.orderStatus === "delivered" ? (
                        <span
                          className={`flex items-center gap-2 text-sm  font-medium justify-center   ${
                            theme ? "headerDark" : "headerLight"
                          }`}
                        >
                          <FaCircle className="text-green-500 text-xs" />
                          Delivered
                        </span>
                      ) : order.orderStatus === "pending" ? (
                        <span
                          className={`flex items-center gap-2 text-sm  font-medium  justify-center ${
                            theme ? "headerDark" : "headerLight"
                          }`}
                        >
                          <FaCircle className="text-yellow-500 text-xs" />
                          Pending
                        </span>
                      ) : order.orderStatus === "processing" ? (
                        <span
                          className={`flex items-center gap-2 text-sm  font-medium  justify-center ${
                            theme ? "headerDark" : "headerLight"
                          }`}
                        >
                          <FaCircle className="text-slate-500 text-xs" />
                          Processing
                        </span>
                      ) : order.orderStatus === "confirmed" ? (
                        <span
                          className={`flex items-center gap-2 text-sm  font-medium  justify-center ${
                            theme ? "headerDark" : "headerLight"
                          }`}
                        >
                          <FaCircle className="text-yellow-200 text-xs" />
                          Confirmed
                        </span>
                      ) : order.orderStatus === "shipped" ? (
                        <span
                          className={`flex items-center gap-2 text-sm  font-medium  justify-center ${
                            theme ? "headerDark" : "headerLight"
                          }`}
                        >
                          <FaCircle className="text-green-400 text-xs" />
                          Shipped
                        </span>
                      ): order.orderStatus === "cancelled" ? (
                        <span
                          className={`flex items-center gap-2 text-sm  font-medium  justify-center ${
                            theme ? "headerDark" : "headerLight"
                          }`}
                        >
                          <FaCircle className="text-red-500 text-xs" />
                          Cancelled
                        </span>
                      ) : (
                        <span className="text-gray-500">Unknown</span>
                      )}
                    </td>
                    <td
                      className={` font-medium text-sm text-center  ${
                        theme ? "headerDark" : "headerLight"
                      }`}
                    >
                      ${order.totalAmount.toFixed(2)}{" "}
                    </td>

                    <td
                      className={` font-medium text-sm text-center  ${
                        theme ? "headerDark" : "headerLight"
                      }`}
                    >
                      <button
                        className="text-blue-600 underline hover:text-blue-800 transition "
                        onClick={() => handleViewDetails(order)}// Uses our safe handler instead of direct state setting
                      >
                        View Details
                      </button>
                    </td>
                    <td
                      className={` font-medium text-sm text-center p-3  ${
                        theme ? "headerDark" : "headerLight"
                      }`}
                    >
                      <div className="relative inline-block text-left">
                        <button
                          onClick={() => toggleDropDown(order)}
                          className={`flex items-center justify-center border text-center px-4 py-2 rounded-lg ${
                            isDropDownId === order._id ? "text-orange-400" : ""
                          } `}
                        >
                          Actions
                          {isDropDownId === order._id ? (
                            <RiArrowDropDownLine className="font-medium text-lg" />
                          ) : (
                            <RiArrowDropUpLine className="font-medium text-lg" />
                          )}
                        </button>
                        {isDropDownId === order._id && (
                          <div
                            className={`absolute right-0 mt-2 w-32 bg-red border 
                 rounded shadow-md z-10  `}
                            style={{
                              background: `${
                                theme
                                  ? "rgb(32, 42, 49) "
                                  : "rgb(245, 243, 243)"
                              } `,
                            }}
                          >
                            <div>
                              {isEditingId === order._id ? (
                                <>
                                  <button
                                    onClick={() => handleEditToggle(order)}
                                    className={`w-full px-4 py-2 text-center hover:bg-gray-300 focus:text-orange-400`}
                                  >
                                    Save
                                  </button>
                                  <hr/>
                                  <button
                                    onClick={() => {
                                      setOrderStatus(order.orderStatus);
                                      setIsEditingId(null);
                                      setIsDropDownId(null);
                                    }}
                                    className={`w-full px-4 py-2  text-center hover:bg-gray-300 text-red-500`}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <button
                                  onClick={() => handleEditToggle(order)}
                                  className={`w-full px-4 py-2  text-center hover:bg-gray-300 hover:text-black focus:text-orange-400`}
                                >
                                  Edit
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="h-dvh w-full text-center text-2xl py-4 text-gray-500 ">
                    No availabe Order
                  </td>
                </tr>
              )}
            </tbody>
          </table>

        
  
{/**order Details modal */}
{/**
 * MODAL CONDITIONAL RENDERING - The Critical Logic
 * 
 * CONDITION BREAKDOWN: {(selectedOrder || modalLoading) && (
 * 
 * WHY WE USE "OR" (||): 
 * - selectedOrder: Shows modal when we have order data to display
 * - modalLoading: Shows modal when we're loading (even if selectedOrder is null)
 * 
 * WHY BOTH ARE NEEDED:
 * Without modalLoading: Modal won't show during loading because selectedOrder is null
 * Without selectedOrder: Modal won't show after loading completes
 * 
 * THE SEQUENCE:
 * 1. User clicks → modalLoading=true, selectedOrder=null → Modal shows (loading)
 * 2. After delay → modalLoading=false, selectedOrder=data → Modal shows (content)
 * 3. User closes → modalLoading=false, selectedOrder=null → Modal hides
 */}          
{(selectedOrder || modalLoading) && ( 
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
    {modalLoading ? (
      // Loading state
      <div className={`p-8 rounded-lg shadow-2xl ${
        theme ? 'bg-[rgb(32,42,49)] text-white' : 'bg-white text-black'
      }`}>
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span>Loading order details...</span>
        </div>
      </div>
    ) : selectedOrder && Object.keys(selectedOrder).length > 0 && selectedOrder.cartItems ? (
    /**
       * MAIN CONTENT STATE: Shows when we have valid order data
       * 
       * TRIPLE VALIDATION:
       * 1. selectedOrder exists (not null/undefined)
       * 2. Object.keys(selectedOrder).length > 0 (not empty object {})
       * 3. selectedOrder.cartItems exists (has the items we need to display)
       * 
       * This prevents rendering a modal with missing/broken data
       */
      <div 
        className={`shadow-2xl w-full max-w-3xl overflow-y-auto mx-auto max-h-[90vh] hide-scrollbar-lg rounded-lg ${
          theme ? 'bg-[rgb(32,42,49)] text-white' : 'bg-white text-black'
        }`}
        style={{
          background: theme ? "rgb(32, 42, 49)" : "rgb(255, 255, 255)"
        }}
      >
        <div className="relative">
          <button
            onClick={() => {
              setSelectedOrder(null);
              setModalLoading(false);// Prevents any lingering loading states
            }}
            className={`absolute right-3 top-6 z-10 hover:opacity-70 transition-opacity ${
              theme ? 'text-amber-400 hover:text-red-400' : 'text-amber-700 hover:text-red-700'
            }`}
          >
            <IoMdClose className="size-5"/>
          </button>
        </div>

        <div className={`py-4 px-3 leading-loose border-b headerfont ${
          theme ? 'border-[#3d4b55] text-white' : 'border-stone-200 text-black'
        }`}>
          <p className={`font-medium ${theme ? 'text-white' : 'text-black'}`}>
            #{selectedOrder?.orderNumber}
          </p> 
          <p className={`text-xs headerfont ${theme ? 'text-gray-300' : 'text-stone-500'}`}>
            Order details
          </p>
        </div>

        <div className={`px-3 py-3 border-b headerfont ${
          theme ? 'border-[#3d4b55]' : 'border-stone-300'
        }`}>
          <p className={`font-medium mb-3 ${theme ? 'text-white' : 'text-black'}`}>
            Items
          </p>  
          <div className="grid gap-6 md:grid-cols-2">
            {selectedOrder?.cartItems.map((item, idx) => (
              <div key={idx} className="flex gap-3">
                <img
                  src={item.image.replace(
                    "/upload/",
                    "/upload/w_1200,q_85,f_auto,dpr_auto/"
                  )}
                  alt={item.productName}
                  className="w-17 h-19 object-cover rounded-xs"
                />
                <div>
                  <p className={`text-xs font-medium mb-1 ${
                    theme ? 'text-white' : 'text-black'
                  }`}>
                    {item.productName}
                  </p>
                  <p className={`text-[11px] grid grid-cols-2 font-medium ${
                    theme ? 'text-gray-300' : 'text-stone-700'
                  }`}>
                    <span>Color:</span> <span className={theme ? 'text-white' : 'text-black'}>{item.color}</span>
                  </p>
                  <p className={`text-[11px] grid grid-cols-2 font-medium ${
                    theme ? 'text-gray-300' : 'text-stone-700'
                  }`}>
                    <span>Size:</span> <span className={theme ? 'text-white' : 'text-black'}>{item.size}</span>
                  </p>
                  <p className={`text-[11px] grid grid-cols-2 font-medium ${
                    theme ? 'text-gray-300' : 'text-stone-700'
                  }`}>
                    <span>Quantity:</span> <span className={theme ? 'text-white' : 'text-black'}>{item.qty}pcs</span>
                  </p>
                  <p className={`text-[11px] grid grid-cols-2 font-medium ${
                    theme ? 'text-gray-300' : 'text-stone-700'
                  }`}>
                    <span>Price:</span> <span className={theme ? 'text-white' : 'text-black'}>${item.price}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="py-5 grid gap-6">
          <div className={`headerfont px-3 border-b pb-5 w-full overflow-hidden whitespace-normal break-words ${
            theme ? 'border-[#3d4b55]' : 'border-stone-300'
          }`}>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Customer name:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.deliveryData.firstname} {selectedOrder?.deliveryData.lastname}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Email:
              </span>  
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.deliveryData.email}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Phone:
              </span>  
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {formatInternationalPhone(selectedOrder?.deliveryData.telephone)}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Country:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {regionNames.of(selectedOrder?.deliveryData.country)}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                State:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.deliveryData.state}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Town/LGA:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.deliveryData.lga}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Address:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.deliveryData.deliveryAddress}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Postal code:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.deliveryData.zipCode}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Created at:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {new Date(selectedOrder?.updatedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>

          <div className={`headerfont px-3 border-b pb-5 ${
            theme ? 'border-[#3d4b55]' : 'border-stone-300'
          }`}>
            <p className={`font-medium mb-3 ${theme ? 'text-white' : 'text-black'}`}>
              Billing information
            </p>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Billing name:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.billData.firstname || "-"} {selectedOrder?.billData.lastname || "-"}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Country:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {regionNames.of(selectedOrder?.billData.country) || "--"}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                State:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.billData.state || "--"}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Town/LGA:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.billData.lga || "--"}
              </span>
            </div>
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Billing address:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.billData.billingAddress || "--"}
              </span>
            </div>
            <div className="grid grid-cols-2">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Postal code:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.billData.zipCode || "--"}
              </span>
            </div>
          </div>

          <div className={`headerfont px-3 pb-5`}>
            <p className={`font-medium mb-3 ${theme ? 'text-white' : 'text-black'}`}>
              Shipping information
            </p>
            
            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Shipping address:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.deliveryData.deliveryAddress}, {selectedOrder?.deliveryData.lga}, {selectedOrder?.deliveryData.state}, {regionNames.of(selectedOrder?.deliveryData.country)} - {selectedOrder?.deliveryData.zipCode}
              </span>
            </div>

            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Payment status:
              </span>   
              <span className={`text-sm font-medium capitalize ${
                selectedOrder.paymentStatus === "paid" ? "text-amber-600" : "text-red-600"
              }`}>
                {selectedOrder?.paymentStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Order status:
              </span>   
              <span className={`text-sm font-medium capitalize ${theme ? 'text-white' : 'text-black'}`}>
                {selectedOrder?.orderStatus}
              </span>
            </div>

            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Subtotal:
              </span>
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                ${sumOrder(selectedOrder?.cartItems)}
              </span>
            </div>

            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Shipping Fee:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                ${selectedOrder?.shippingCost}
              </span>
            </div>

            <div className="grid grid-cols-2 mb-1">
              <span className={`text-sm font-medium ${theme ? 'text-gray-300' : 'text-stone-700'}`}>
                Total:
              </span>   
              <span className={`text-sm font-medium ${theme ? 'text-white' : 'text-black'}`}>
                ${selectedOrder?.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>
    ) : (
      /**
       * FALLBACK STATE: Shows when outer condition passes but inner conditions fail
       * 
       * WHEN THIS HAPPENS:
       * - modalLoading is false (we're done loading)
       * - But selectedOrder is invalid/incomplete
       * - This gives users a way out instead of being stuck
       */
      <div className={`p-8 rounded-lg shadow-2xl ${
        theme ? 'bg-[rgb(32,42,49)] text-white' : 'bg-white text-black'
      }`}>
        <p>Unable to load order details. Please try again.</p>
        <button 
          onClick={() => setSelectedOrder(null)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    )}
  </div>
)}

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

export default Order;
