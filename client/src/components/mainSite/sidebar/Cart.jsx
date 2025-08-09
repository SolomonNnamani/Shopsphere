import React,{useState, useEffect, useRef} from 'react'
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { FaBoxOpen } from "react-icons/fa";
import {Link,useNavigate} from 'react-router-dom'
import {fetchAuth} from '../utils/fetchAuth.js'
import {toast} from 'react-toastify'




const Cart = ({toggleCart, setToggleCart,cartItems,setCartItems}) => {
	const [orders, setOrders] = useState([])
	const [activeTab, setActiveTab] = useState('cart')
	const cartRef = useRef()	
	const navigate = useNavigate()
	const isLoggedIn = Boolean(localStorage.getItem("sessionToken"))

	useEffect(()=> {
		const handleOutsideClick = (e) => {
			if(cartRef.current && !cartRef.current.contains(e.target)){
				setToggleCart(false)
			}
		}

		if(toggleCart){
			document.addEventListener('mousedown', handleOutsideClick);
		}

		return ()=> {
			document.removeEventListener('mousedown', handleOutsideClick)
		}
	},[toggleCart, setToggleCart])

//summing up the quatity values
	const totalQty = cartItems.reduce((acc,item)=> acc + item.qty, 0)
	

//for the qty form, updating new values
	const handleQtyChange = (index, newQty) => {
		const updatedItems = [...cartItems];
		updatedItems[index].qty = parseInt(newQty)//replace current qty with new qty
		//save to state(re-render)
		setCartItems(updatedItems);

		//save to ls
		localStorage.setItem('cart',JSON.stringify(updatedItems))

	}

//re-calculate product price * qty then sum up the totals
	const overAllTotal = cartItems.reduce((acc, item)=> {
		return acc + item.price * item.qty;
	},0)
	

	//delete product in ls by index
	const handleDelete = (index) => {
		const updatedItems = cartItems.filter((_,idx) => idx !== index);//remove by index
		setCartItems(updatedItems);
		localStorage.setItem('cart', JSON.stringify(updatedItems))
	}


//emmm fetch all orders
	  useEffect(() => {
	  	if (!isLoggedIn) return;
    const fetchOrders = async () => {
      try {
        const res = await fetchAuth('/api/orders'); // Ideally filter by user
        const data = await res.json();
        
        setOrders(data || []);
      } catch (err) {
        console.error("Failed to fetch orders", err);
        toast.error('Failed to load your order, please check your network')
      }
    };

    fetchOrders();
  }, []);


	  const handleCheckoutClick = () => {
	  	if(!isLoggedIn){
	  		// Redirect to login and include redirect param
	  		navigate('/sign-in?redirect=checkout')
	  	}else{
	  		// User already logged in
	  		navigate('/checkout')
	  	}
	  }



	  //active orders
	  const active = orders.filter(order => order && order.orderStatus !== "delivered" ).length

	return(
		<>

<div className={`fixed inset-0 z-20 bg-black/40 transition-opacity duration-300 ${
			toggleCart ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
		}`}>
<div 
ref={cartRef}
className={`absolute right-0 top-0  w-3/4  md:w-1/2  lg:w-1/4  h-dvh  bg-slate-200 
${toggleCart ? "translate-x-0" : "translate-x-full  "} 
transition-transform duration-300 ease-in-out  flex flex-col
 `}>

{/*header*/}
<div className="relative bg-[ghostwhite] h-18 flex  items-center  ">

<div className="flex justify-center gap-3 md:gap-15 lg:gap-10 w-full">
{/*Cart btn*/}
<button 
className="relative"
onClick={() => setActiveTab('cart')}
>
<HiOutlineShoppingCart className="text-slate-400 text-3xl mx-auto"/>
<p className="text-xs text-slate-400">Your shopping cart </p>
{cartItems && cartItems.length > 0 &&
<span className="absolute top-0 right-10 bg-amber-700 rounded-full border-2 border-[ghostwhite] headerfont numberLength">
    {totalQty}
</span>
}
</button>

{/*order history btn*/}
{isLoggedIn && (
<button
onClick={() => setActiveTab('orders')}
className="relative"
>
<FaBoxOpen className="text-slate-400 text-3xl mx-auto"/>
<p className="text-xs text-slate-400">Order History </p>
{orders && orders.length > 0 && 
<span className="absolute top-0 right-10 bg-amber-700 rounded-full border-2 border-[ghostwhite] headerfont numberLength">
    {active}
</span>
}
</button>
	)}

</div>


{/*close*/}
<div className=" absolute top-2 right-0 p-0">
<button 
onClick={()=> setToggleCart((prev) => !prev)}
className="p-4"
> 
<IoMdClose className="text-slate-400 text-2xl p-0"/>
</button>
</div>
</div>


{/*Scroll container*/}
<div className="overflow-y-auto flex-1 px-2 hide-scrollbar-lg  ">
{
	activeTab === 'cart' ? (
	cartItems.length > 0 ?( cartItems.map((item, index) => (
		<div key={index} className="relative p-4 border-b border-slate-300 flex gap-5">
		<div className=" pt-1">
			<img src={item.image.replace(
                  "/upload/",
                  "/upload/w_1200,q_85,f_auto,dpr_auto/"
                )} 
			alt={item.productName} 
			className="w-20 h-20 object-cover rounded" 
			/>
			</div>



			<div className="font-medium text-xs leading-relaxed">
			<p className="text-sm headerfont text-black/80 lg:w-45 "> {item.productName}</p>
			<p className="text-slate-400">Size: {item.size}</p>
			<p className="text-slate-400">Color: {item.color}</p>

			<div className="flex items-center gap-1 mb-1">
			<small 
			htmlFor="qty"
			className="block text-xs text-slate-400 "
			>Qty: </small>
			<select

			value={item.qty}
			onChange={(e) => handleQtyChange(index, e.target.value)}
			className="border border-slate-400 bg-[ghostwhite] h-7 w-12 headerfont outline-none "
			>
			{
				Array.from({length: item.stock}, (_, i) => (
					<option key={i+1} value={i+1}>
					{i+1}
					</option>
					))
			}
			</select>
				</div>
			<button 
			className="p-1  absolute right-2 top-4"
			onClick={()=> handleDelete(index)}
			>
			<IoMdClose className="text-slate-400 text-2xl p-0"/>
		</button>

		<p className="absolute right-3 bottom-5 headerfont">${(item.price * item.qty).toFixed(2)} USD </p>	
			</div>
		</div>
	))
	):(
	<div  className="p-4 text-slate-500  h-full w-full flex flex-col items-center justify-center text-sm">
		<HiOutlineShoppingCart className="text-6xl"/>
	<p className="">	You have no items in your shopping cart. </p>

	</div>)

): (
		isLoggedIn && (orders.length > 0 ? (
					orders.map((order) => (
						<div key={order._id} className={`my-3 headerfont border-b border-amber-300 mx-3 ${order.orderStatus === "delivered" ? "opacity-50" : 'opacity-100'}`}> 
						<div className=" border-b border-stone-100 pb-3 ">
						{/*Order No*/}
						<div className="flex justify-between leading-relaxed text-xs">
						<p className="font-medium text-base text-black/80"> Order #{order.orderNumber}</p>
						<Link
						to={`/track-order/${order.orderNumber}`}
						className={`text-amber-600 text-base ${order.orderStatus === "delivered" ? "pointer-events-none " : ''} `}
		
						>
						Track Order
						</Link>
						</div>
						<p className="text-black/80 text-xs">Placed on {new Date(order.createdAt).toLocaleDateString('en-US',{
							year:'numeric',
							month:'short',
							day: 'numeric'
						})} </p>
						</div>
		
		
						 {/* Status + Summary */}
						<div className="py-3  border-b border-stone-100 text-xs leading-relaxed">
						{/*Status info*/}
						<p>Status: <span className="capitalize font-medium">{order.orderStatus}</span> </p>
		
						{/*payment*/}
						<p className="flex justify-between ">
					<span>Payment: {order.paymentStatus}  </span>	
					<span className="font-medium">${order.totalAmount} USD </span>
						</p>
						</div>
		
		 {/* Product List */}
		    <div className="py-">
		      {order.cartItems.map((item, index) => (
		        <div key={index} className="flex items-center gap-3 pb-5 py-2 ">
		          <img
		            src={item.image.replace("/upload/", "/upload/w_300,q_80,f_auto/")}
		            alt={item.productName}
		            className="w-12 h-12 object-cover rounded"
		          />
		          <div className="text-xs">
		            <p className="font-medium">{item.productName}</p>
		            <p className="text-gray-500">Qty: {item.qty}</p>
		            <p className="text-gray-500">Price: ${item.price} USD</p>
		          </div>
		          
		        </div>
		      ))}
		    </div>
		
		
						</div>
						))
					):(
						<div  className="p-4 text-slate-500 h-full w-full flex items-center justify-center text-sm">You have no active orders.</div>
					))



)}
	


</div>
 {/* Footer / Checkout */}

    {activeTab === 'cart' && cartItems.length > 0 && (
      <div className="bg-[ghostwhite] px-4 py-2 border-t border-slate-300">
        <div className="flex justify-between headerfont font-medium text-sm">
          <p>SUBTOTAL</p>
          <p>${overAllTotal.toFixed(2)} USD</p>
        </div>
        <button 
        	className="bg-amber-600 w-full text-white p-2 font-bold rounded-lg active:scale-95 transition-transform duration-100 my-3"
        	onClick={handleCheckoutClick}
        >
         GO TO CHECKOUT
        </button>
      </div>
    )}






</div>

</div>
			

</>
		)
}

export default Cart