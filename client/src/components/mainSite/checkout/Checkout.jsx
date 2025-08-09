import {useState,useEffect} from 'react'
import CheckoutForm from './CheckoutForm'
import { Elements } from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js'
import { useNavigate } from "react-router-dom";
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import { IoIosArrowBack } from "react-icons/io";
import {fetchPublic} from '../utils/fetchPublic.js'
import { HiOutlineShoppingCart } from "react-icons/hi2";

//const publishableKey = import.meta.env.VITE_PUBLISH_KEY
//const stripePromise = loadStripe(`${publishableKey}`)

const Checkout = ({cartItems,setCartItems,setError,setLoading}) => {
	const [publishableKey, setPublishablekey] = useState(null)
	  const [stripePromise, setStripePromise] = useState(null);
	 const navigate = useNavigate();

	 useEffect(()=> {
		const fetchKey = async () => {
			setLoading(true)
			try{
			const res = await fetchPublic(`/api/dashboard/settings/payment`);
			const data = await res.json();
			
			setPublishablekey(data.stripeKey)
			 const stripe = await loadStripe(data.stripeKey);
        setStripePromise(stripe);
		}catch(err){
			console.log("Error :", err)
			
		}finally{
			setLoading(false)
		}
		}
		fetchKey()
	},[])


	//checks if cart is empty
	const isCartEmpty = !Array.isArray(cartItems) || cartItems.length === 0
	const handleBack = () => {
    navigate(-1); 
  };



	return(
	<div className=" bg-stone-200 min-h-screen " >
	<div className="flex bg-[ghostwhite] relative py-4">
	 <button onClick={handleBack} className="absolute  w-20 md:w-40 top-3 left-1 md:left-10 lg:left-45 flex items-center text-xs font-medium text-stone-400  ">
       <IoIosArrowBack className="size-10  "/>Continue shopping
    </button>

    	<div className="relative mx-auto   ">
			<ShopsphereLogo 
				className="text-2xl md:text-3xl font-medium text-slate-eaderfont"
				links={"/"}
			/>
			<small className="hidden font-medium headerfont text-xs absolute -right-28 top-4 lg:block ">
			SECURE CHECKOUT </small>
			</div>


	</div>




{/*for mobile*/}
			<div className=" text-xl bg-stone-200 w-full text-center py-4  lg:hidden ">
			Secure Checkout
			</div>

			<div className="">
			{isCartEmpty ? (
	<div className="p-10 flex flex-col items-center justify-center h-dvh  text-gray-500">
		<HiOutlineShoppingCart className="text-7xl"/>
         <p>   You have no items in your shopping cart. </p>
          <button onClick={handleBack} className=" bg-amber-700 hover:bg-amber-600 p-3 my-3 rounded-md text-white  ">
      Go back to shopping
    </button>

          </div>
	):(
	<Elements stripe={stripePromise}>
        <CheckoutForm
        cartItems={cartItems}
        setCartItems={setCartItems}
        setError={setError}
        setLoading={setLoading}
        />
         </Elements>

	)}
	</div>
</div>
		)
}
export default Checkout