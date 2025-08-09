import {useState, useEffect} from 'react'
import { IoMdClose } from "react-icons/io";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaDotCircle } from "react-icons/fa";

const CartItems = ({cartItems,setCartItems, isShipping}) => {
	const [toggleCart, setToggleCart] = useState(false)
	const [isMediumScreen, setIsMediumScreen] =useState(false)


	//for the qty form, updating new values
	const handleQtyChange = (index, newQty) => {
		const updatedItems = [...cartItems];
		updatedItems[index].qty = parseInt(newQty)//replace current qty with new qty
		//save to state(re-render)
		setCartItems(updatedItems);

		//save to ls
		localStorage.setItem('cart',JSON.stringify(updatedItems))

	}
	//summing up the quatity values
	const totalQty = cartItems.reduce((acc,item)=> acc + item.qty, 0)

//re-calculate product price * qty then sum up the totals
	const overAllTotal = cartItems.reduce((acc, item)=> {
		return acc + item.price * item.qty;
	},0)
	

//Calculate total weight
	const totalWeight = cartItems.reduce((acc,item)=> {
		return acc + (item.weight || 0) * item.qty;
	},0)


//caculate shipping cost
	const baseFee = parseFloat(isShipping?.baseFee || 0)
	const perKgFee = parseFloat(isShipping?.perKgFee || 0);
	const shippingCost = baseFee + (totalWeight * perKgFee)





	//delete product in ls by index
	const handleDelete = (index) => {
		const updatedItems = cartItems.filter((_,idx) => idx !== index);//remove by index
		setCartItems(updatedItems);
		localStorage.setItem('cart', JSON.stringify(updatedItems))
	}

//for lg screen
	useEffect(()=>{
		const checkScreenSize = () => {
			setIsMediumScreen(window.innerWidth >= 768); // Tailwind 'md' breakpoint
		}

		checkScreenSize(); //initial check
		window.addEventListener('resize', checkScreenSize); //Update on resize

		return () => window.removeEventListener('resize', checkScreenSize); //cleanup

	},[])


 


	return (
		<>
<div className="">
<div
 onClick={()=> setToggleCart(prev => !prev) }
 className="flex justify-between w-full text-sm py-2 px-5 font-medium text-black/80 outline-none bg-[ghostwhite]"
> 
1. REVIEW YOUR ORDER ({totalQty} ITEMS)  
{toggleCart ? (<IoIosArrowDown className="text-xl text-black/70 md:hidden"/>) : (<IoIosArrowUp className="text-xl text-black/70 md:hidden"/>)}
</div>

<div className="bg-stone-200  md:bg-[ghostwhite] ">
{/*Scroll container*/}
{(toggleCart || isMediumScreen) && (
<div >
<div className="overflow-y-auto flex-1 px-2 hide-scrollbar-lg  ">
{
	cartItems.length > 0 ?( cartItems.map((item, index) => (
		<div key={index} className="relative p-4 border-b border-slate-400 flex gap-5">
		<div className=" pt-1">
			<img src={item.image.replace(
                  "/upload/",
                  "/upload/w_1200,q_85,f_auto,dpr_auto/"
                )} 
			alt={item.productName} 
			className="w-20 h-20 object-cover rounded" 
			/>
			</div>



			<div className="font-medium text-xs leading-loose">
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
	<div  className="p-4 text-slate-500">
		You have no items in your shopping cart.

	</div>


	)
}
</div>
</div>
)}



 {/* Footer / Checkout */}
    {cartItems.length > 0 && (
      <div className=" px-4 py-3 ">
        <div className="flex justify-between headerfont font-medium text-sm">
          <p>SUBTOTAL</p>
          <p>${overAllTotal.toFixed(2)} USD</p>
        </div>
      
      </div>
    )}




{/*Select Delivery*/}
<div className="px-4 py-3  bg-[ghostwhite]">
<p className="text-sm font-medium">Select delivery</p>
<div className="border rounded-lg border-amber-600 flex justify-between 
items-center px-3 py-2 text-sm font-medium headerfont my-3 bg-amber-50/60 ">

<div className="flex gap-10">
<p>${shippingCost.toFixed()} USD</p>
<div>
<p className="text-black/80">Express</p>
<p className="text-black/70">(4-6 business days, tracking) </p>
</div>
</div>

<FaDotCircle className="text-amber-600 text-xl" />

</div>
</div>

</div>









</div>

		</>
		)
}
export default CartItems