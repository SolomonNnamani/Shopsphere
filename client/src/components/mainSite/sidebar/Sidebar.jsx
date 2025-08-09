import {useState,useEffect, useRef} from 'react'
import { SlMenu } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import Mobile from './Mobile'
import Cart from './Cart'
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import { IoMdSearch } from "react-icons/io";
import { HiOutlineShoppingCart } from "react-icons/hi2";
import { IoIosAddCircleOutline } from "react-icons/io";
import { IoPersonOutline } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import {toast} from 'react-toastify'
import gsap from 'gsap'
import {fetchPublic} from '../utils/fetchPublic.js'


const Sidebar = ({setLoading,setError,toggleCart, setToggleCart, cartItems, setCartItems }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [products,setProducts] = useState([])
	const [hoveredCategory, setHoveredCategory] = useState(null)
	const hoverRef = useRef()

const isLoggedIn = Boolean(localStorage.getItem("sessionToken"))
	useEffect(()=> {
	const fetchContents = async()=> {
			setLoading(true)
			try{
				const res = await fetchPublic('/api/dashboard/products')
				if(!res.ok) {
					throw new Error("Failed to fetch products")
				}
			const data = await res.json()
				setProducts(data.products || []) //Add fallback to empty array
		}catch(error){
			console.log("Error", error)
			setError("Error loading contents, please check your network")
			setProducts([])

		}finally{
			setLoading(false)
		}
		}
		fetchContents()
	},[])

	useEffect(() => {
  if (hoveredCategory && hoverRef.current) {
    // Set initial state and animate in
    gsap.fromTo(hoverRef.current, 
      {
        opacity: 0,
        y: -10 // Optional: add a slight slide effect
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      }
    );
  }
}, [hoveredCategory]);

  const handleLogout = () => {
  const confirmDelete = window.confirm("Are you sure you want to logout?");
  if (!confirmDelete) return;

  localStorage.removeItem("sessionToken");
  toast.success("Logging out...");

  setTimeout(() => {
    window.location.href = "/sign-in"; // <-- force redirect
  }, 2000);
};

	
	
//summing up the quatity values
	const totalQty = cartItems.reduce((acc,item)=> acc + item.qty, 0)


	const categories = [...new Set(products.map(p => p.category))]
	return (
		<div>
<div className=" fixed lg:absolute  w-full z-20 bg-[ghostwhite] 
py-3 lg:py-5 px-2 md:px-5 border-b shadow-sm  border-slate-300"
onMouseEnter={()=> setHoveredCategory(categories[0])}
onMouseLeave={()=> setHoveredCategory(null)}
>

<div className="flex items-center justify-between " >
	<div className="relative flex gap-3 md:gap-0 items-center w-full lg:hidden"> 
{/*menu icon*/}
<button
data-sidebar-toggle
onClick={()=>
 setIsOpen((prev)=> !prev ) }
className="lg:hidden"
>
{isOpen ? <IoClose className="text-slate-400 text-lg md:text-xl"/> : <SlMenu className="text-slate-400 text-lg md:text-xl"/>}
</button>

<div className="md:absolute md:left-1/2 md:-translate-x-1/2">
	<ShopsphereLogo
	className="font-medium lg:hidden   text-xl md:text-2xl lg:text-4xl text-slate-800 headerfont"
	links={"/"}
/>
</div>
</div>


<div className=" lg:flex lg:items-center  lg:gap-10">
<ShopsphereLogo
	className="font-medium hidden lg:block text-xl md:text-2xl lg:text-4xl text-slate-800 headerfont"
	links={"/"}
/>

{/*Contents*/}
<Mobile setLoading={setLoading}
 isOpen={isOpen} 
 setIsOpen={setIsOpen} 
 setError={setError}
 products={products}
   />

{/* For large screens only */}
<div className=" hidden lg:block w-full">
<div className="flex gap-10">
{categories.map(category => (
<div
key={category}
className="text-slate-800 text-sm font-medium cursor-pointer headerfont"
onMouseEnter={() => setHoveredCategory(category)} // Switch to this category's subs
>
<a href={`/products/category/${category}`} //
className="hover:text-amber-600 transition">
{category}
</a>
</div>
	))}
</div>


{hoveredCategory && (
<div 
className="absolute left-0 right-0 top-[81px] w-screen bg-[ghostwhite] py-6  transition-all duration-300 ease-in-out"

ref={hoverRef}
> 
<div className="flex flex-wrap gap-5 pl-[22%] transition-all duration-300 ease-in-out ">
{[...new Set(products.filter(p => p.category === hoveredCategory)
.map(p => p.subCategory)
	)].map(subCategory=> (
		<div 
		key={subCategory}
		className="text-sm text-black/60 font-medium hover:text-amber-600 px-4 py-2 "
		>
		<a href={`/products/category/${hoveredCategory}?category=${encodeURIComponent(subCategory)}`} className="block">
		<img
		src={products.find(p => p.subCategory === subCategory)?.mainImage.replace(
    "/upload/",
    "/upload/w_1200,q_85,f_auto,dpr_auto/"
  ) }
		alt={`${subCategory} products`}
		className="w-20 h-30 object-cover rounded-lg mx-auto "
		/>
		 <p  className="block text-center text-xs pt-1" >{subCategory}</p>
	 </a>
		</div>
	))}
{/* "All" link */}
            <div className="text-sm text-black/60 font-medium hover:text-amber-600 px-4 py-2  text-center ">
            <a href={`/category/${hoveredCategory}`}>
            <IoIosAddCircleOutline className="w-20 h-30 font-light text-slate-300 hover:text-slate-300-600 text-center  mx-auto " /></a>
             <a href={`/category/${hoveredCategory}`} className="">All {hoveredCategory}</a>
            </div>
</div>
</div>
	)}


</div>



</div>




<div className="flex items-center gap-2 md:gap-3 ">
	{
		!isLoggedIn ? (
<a href="/sign-in"> <IoPersonOutline className="text-slate-400 text-xl md:text-2xl"/> </a>
			):(
<button onClick={handleLogout}> <MdOutlineLogout className="text-slate-400 text-xl md:text-2xl"/> </button>
			)
	}

<a href="/products/category/all"> <IoMdSearch className="text-slate-400 text-xl md:text-2xl"/> </a>


<div className="relative flex items-center  p-1">
<button 
onClick={()=> setToggleCart((prev) => !prev)}
 >
 <HiOutlineShoppingCart className="text-slate-400 text-xl md:text-2xl mx-auto"/> 
 </button>{cartItems && cartItems.length > 0 &&
<small className="absolute top-0 right-0 bg-amber-700 rounded-full border-2 border-[ghostwhite] headerfont numberLength">
    {totalQty}
</small>
}
</div>

</div>
</div>
</div>
<Cart 
toggleCart={toggleCart} 
setToggleCart={setToggleCart}
cartItems={cartItems}
setCartItems={setCartItems}
/>

</div>
		)

}
export default Sidebar