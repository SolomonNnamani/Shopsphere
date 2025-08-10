import React, {useState,useEffect} from 'react'
import {useParams} from 'react-router-dom'
import { toast } from "react-toastify";
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import { FaRegClock, FaCog, FaTruck } from 'react-icons/fa';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import { BsHouseDoor } from 'react-icons/bs';
import { FaTimesCircle } from 'react-icons/fa';
import {fetchAuth} from '../utils/fetchAuth.js'




const TrackOrder = ({setLoading}) => {
	const [orderData, setOrderData] = useState({

	})
	
	const {orderNumber} = useParams()
const isLoggedIn = Boolean(localStorage.getItem("sessionToken"))
	useEffect(()=> {
    //if (!isLoggedIn) return;
		const fetchOrder = async () => {
			setLoading(true)
			if(!orderNumber){
					toast.error('No order number provided')
					return
			}
			try{
			const res = await fetchAuth(`/api/orders/${orderNumber}`);
			const data = await res.json();
			
			setOrderData(data)
		}catch(err){
			toast.error(`Couldn't loading tracking order, please check your network!`)
			
		}finally{
			setLoading(false)
		}
		}
		fetchOrder()
	},[orderNumber])


	//simple function to check if status is complete
	const isStatusCompleted = (statusValue) => {
    if (orderData.orderStatus === 'cancelled') {
    return statusValue === 'cancelled'
  }

		const status = ['pending', 'processing', 'shipped', 'delivered']
		const currentIndex = status.indexOf(orderData.orderStatus)// check if the value of the orderData.orderStatus is in the array and if so, then get the index value of it which is in the array
		const statusIndex = status.indexOf(statusValue); // check if the statusValue is in the array, if so then get the index number
		return statusIndex !== -1 && statusIndex <= currentIndex 
	}



//This uses the browser's built-in internationalization API and works for all ISO country codes. It will automatically convert "NG" to "Nigeria", "US" to "United States"
const regionNames = new Intl.DisplayNames(['en'], {type:'region'});

const safeCountryName = (code) => {
  try {
    if (typeof code !== "string" || code.length !== 2) return code || "Unknown";
    return regionNames.of(code.toUpperCase());
  } catch {
    return code || "Unknown";
  }
};

//for date
const formattedDate = new Date(orderData?.createdAt).toLocaleDateString('en-US');


	return(
		<div className="  min-h-screen">
		<div className="bg-slate-100 flex justify-center  py-3 " >
		<div className="relative">
			<ShopsphereLogo className=" text-xl md:text-3xl font-medium text-slate-800 headerfont"
                      links={"/"}
      />
			<small className="font-medium headerfont text-[9px] md:text-xs absolute -right-12 top-3 md:-right-16 md:top-4">TRACKING </small>
			</div>
		</div>

		<div>
				<h1 className="text-center font-medium pt-7">ORDER TRACKING PAGE </h1>
				<hr className="w-30 mx-auto my-7" />
				<p className="text-center text-sm  ">Please note that these are accurate but not guaranteed estimates. Delivery data is subject to change without advanced notice </p>
</div>


				{orderData && orderData.createdAt && (
<div>
                 <div className="flex  flex-row justify-between mt-7 px-5 md:px-15 lg:px-35 py-5 border-2 border-slate-400
                  bg-slate-100 rounded-md mx-5 md:mx-10 lg:mx-15 ">
				{/**Order Placed*/}
				<div className="text-center text-xs font-medium"> 
				<h3 >ORDER PLACED</h3>
				<p className="text-black/80">{new Date(orderData.createdAt).toLocaleDateString('en-US',{
					year:'numeric',
					month:'short',
					day: 'numeric'
				})} </p>
				</div>

				{/**Total*/}
				<div className="text-center text-xs font-medium"> 
				<h3>Total</h3>
				<p className="text-black/80">${orderData.totalAmount} USD </p>
				</div>

				{/**SHIP TO*/}
				<div className="text-center text-xs font-medium"> 
				<h3>SHIP TO</h3>
				<p className="text-black/80">{safeCountryName(orderData?.deliveryData?.country)}</p>
				</div>

				{/**ORDER*/}
				<div className="text-center text-xs font-medium"> 
				<h3>ORDER</h3>
				<p className="text-black/80">#{orderData.orderNumber} </p>
				</div>
				</div>			


			 {/* Order Status */}
          <div className="text-center my-7">
            <h1 className="font-medium">Order Status: <span className="text-amber-700">{orderData.orderStatus.toUpperCase()}</span></h1>
          </div>

          {/* FIXED Simple Progress Bar - Now Responsive */}
          <div className="relative ">
            {/* Desktop Version */}
            <div className="hidden  md:flex justify-between relative md:mx-10 lg:mx-15">
              
              {/* Gray background line - FIXED z-index */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-300 z-0"></div>

              {/* Amber progress line - FIXED z-index and transition */}
              <div 
                className="absolute top-6 left-0 h-1 bg-amber-700 z-10 transition-all duration-500"
               style={{
                      width: orderData.orderStatus === 'cancelled' ? '0%' :
                             orderData.orderStatus === 'pending' ? '25%' :
                             orderData.orderStatus === 'processing' ? '50%' :
                             orderData.orderStatus === 'shipped' ? '75%' : '100%'
}}

              />

              {/* Steps - Desktop */}
                {/*Cancelled*/}
              <div className=" relative z-20  md:w-25 lg:w-40 ">
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg 
                  ${isStatusCompleted('cancelled') ? "    bg-white border-red-500 text-red-500   " : 'bg-white border-gray-300 text-gray-400 '
                }`}>
                  <FaTimesCircle  />
                </div>
                
                <div>
                <p className="mt-2 text-sm font-semibold">Cancelled</p>
                <p className="text-xs ">This order has been cancelled and will not proceed further. Please re-order or contact Customer care. </p>
                </div>
              </div>

              {/*pending*/}
              <div className=" relative z-20  md:w-25 lg:w-40 ">
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg 
                  ${isStatusCompleted('pending') ? "bg-white border-amber-700 text-amber-700" : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <FaRegClock />
                </div>
                
                <div>
                <p className="mt-2 text-sm font-semibold">Pending</p>
                <p className="text-xs ">We're reviewing your order. This won't take long. </p>
                </div>
              </div>

             

              {/*processing*/}
              <div className=" relative z-20 md:w-25 lg:w-40">
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg 
                  ${isStatusCompleted('processing') ? "bg-white border-amber-700 text-amber-700" : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <FaCog />
                </div>
                <div>
                <p className="mt-2 text-sm font-semibold">Processing</p>
                <p className="text-xs md:w-30 lg:w-40">We're getting everything ready. Sit tight! </p>
                	</div>
              </div>

              {/*ship*/}
              <div className=" relative z-20 md:w-25 lg:w-40">
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg 
                  ${isStatusCompleted('shipped') ? "bg-white border-amber-700 text-amber-700": 'bg-white border-gray-300 text-gray-400'
                }`}>
                <FaTruck />
                </div>
                <p className="mt-2 text-sm font-semibold">Shipped</p>
                 <p className="text-xs md:w-30 lg:w-40">Your order is on the way. </p>
              </div>

              {/*Delivered*/}
              <div className=" relative z-20 md:w-25 lg:w-40">
                <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center text-lg 
                  ${isStatusCompleted('delivered') ? "bg-white border-amber-700 text-amber-700" : 'bg-white border-gray-300 text-gray-400'
                }`}>
                  <BsHouseDoor />
                </div>
                <p className="mt-2 text-sm font-semibold">Delivered</p>
                 <p className="text-xs md:w-30 lg:w-40">Your package has arrived. Enjoy! </p>
              </div>
            </div>

            {/* Mobile Version - Vertical Layout */}
            <div className="md:hidden space-y-4 mx-5">
              {/* Progress indicator for mobile */}
              <div className="w-full bg-gray-300 rounded-full h-2 mb-4 ">
                <div 
                  className="bg-amber-700 h-2 rounded-full transition-all duration-500"
                  style={{
                       width: orderData.orderStatus === 'cancelled' ? '0%' :
                              orderData.orderStatus === 'pending' ? '20%' :
                              orderData.orderStatus === 'processing' ? '60%' :
                              orderData.orderStatus === 'shipped' ? '80%' : '100%'
}}

                />
              </div>

              {/* Mobile Steps */}
             {[
  { key: 'cancelled', label: 'Cancelled', icon: <FaTimesCircle /> },
  { key: 'pending', label: 'Pending', icon: <FaRegClock /> },
  { key: 'processing', label: 'Processing', icon: <FaCog /> },
  { key: 'shipped', label: 'Shipped', icon: <FaTruck /> },
  { key: 'delivered', label: 'Delivered', icon: <BsHouseDoor /> }
].map((step, index) => {
  const isCancelled = step.key === 'cancelled';
  const isCompleted = isStatusCompleted(step.key);
  const isCurrent = orderData.orderStatus === step.key;

  const statusClass = isCancelled
    ? isCurrent
      ? 'bg-white border-red-500 text-red-500'  // if currently cancelled
      : 'bg-white border-gray-300 text-gray-400' // if not current
    : isCompleted
      ? 'bg-amber-700 border-amber-700 text-white' // normal completed
      : 'bg-white border-gray-300 text-gray-400';  // normal pending

  const textClass = isCompleted ? 'text-gray-800' : 'text-gray-500';

  return (
    <div key={step.key} className="flex items-center space-x-4 p-3 rounded-lg bg-gray-50">
      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm ${statusClass}`}>
        {step.icon}
      </div>
      <div className="flex-1">
        <p className={`font-semibold text-sm ${textClass}`}>
          {step.label}
        </p>
        {isCurrent && (
          <p className={`text-xs ${isCancelled ? 'text-red-500' : 'text-green-600'}`}>
            Current Status
          </p>
        )}
      </div>
      {!isCancelled && isCompleted && (
        <div className="text-green-500 text-sm">✓</div>
      )}
    </div>
  );
})}

            </div>
          </div>

          {/**Shipping information*/}
          <div className="my-10 mx-5 md:mx-10 lg:mx-15 leading-relaxed "> 
          <h1 className="tracking-widest font-medium  ">SHIPPING INFORMATION</h1>
          {/*Shipping country*/}
          <div className="grid grid-cols-2 ">
          <p className="font-medium text-black/70 text-sm md:text-base">Shipping Country</p>
           <p className="font-medium text-xs  md:text-sm">{regionNames.of(orderData.deliveryData.country)}</p>
            </div>

            {/*Shipping State*/}
          <div className="grid grid-cols-2">
          <p className="font-medium text-black/70 text-sm md:text-base">Shipping State: </p> 
          <p className="font-medium text-xs  md:text-sm">{orderData.deliveryData.state}</p>
           </div>

             {/*Shipping Address*/}
          <div className="grid grid-cols-2">
          <p className="font-medium text-black/70 text-sm md:text-base">Shipping Address:</p> 
          <p className="font-medium text-xs  md:text-sm">{orderData.deliveryData.deliveryAddress}</p> 
          </div>

          {/*Customer Number*/}
          <div className="grid grid-cols-2"> 
          <p className="font-medium text-black/70 text-sm md:text-base"> Customer Number: </p> 
          <p className="font-medium text-xs  md:text-sm">+{orderData.deliveryData.telephone}</p>
           </div>

           {/**Order Date*/}
          <div className="grid grid-cols-2 "> 
          <p className="font-medium text-black/70 text-sm md:text-base">Order Date: </p>
          <p className="font-medium text-xs  md:text-sm">{formattedDate} </p>
          </div>

          </div>

          </div>

					)}
				

		</div>

		)
}
export default TrackOrder




