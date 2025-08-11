import {useState, useEffect} from 'react'
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import { FaInstagram } from "react-icons/fa";
import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";
import {fetchPublic} from '../utils/fetchPublic.js'

const Footer = ({setError,setLoading}) => {
const [products, setProducts] = useState([])
const [storeInfo, setStoreInfo] = useState([])

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
		

		const fetchStoreInfo = async()=> {
			setLoading(true)
			try{
				const res = await fetchPublic('/api/dashboard/settings/storeInfo')
				if(!res.ok) {
					throw new Error("Failed to fetch storeInfo")
				}
			const data = await res.json()
				
				setStoreInfo(data || []) //Add fallback to empty array
		}catch(error){
			console.log("Error", error)
			setError("Failed to fetch data, please check your network!")
			setStoreInfo([])

		}finally{
			setLoading(false)
		}
		}

		fetchContents()
		fetchStoreInfo()
	},[])

	const categories = [...new Set(products.map(p => p.category))]
	const about = ["Our Story", "Our Materials", "Customer Care", "Shipping & Returns", "Contact Us"]
	const socials = [<FaInstagram />,<FaFacebookF />,<FaLinkedinIn />,<FaXTwitter />,<FaTiktok /> ]
	const year = new Date().getFullYear()
	
	return(
		<div className="bg-black/90 text-stone-400 overflow-hidden ">
		
		<div className="flex justify-between md:justify-start md:gap-8 lg:hidden px-5  py-10 border-b border-stone-400">
		{
			socials.map((soc,index) => (
<div 
key={index}
className="hover:text-amber-700 text-2xl md:text-xl">
{soc}
	</div>
				))
		}
		</div>{/*flex end*/}


		<div className="flex justify-between headerfont gap-3 py-5 px-10 lg:px-40">
<div className="  leading-loose ">
		<h3 className="mb-3">SHOP PRODUCTS </h3>
		<p className="text-sm text-sm mb-3 hover:text-amber-700"><a href="/products/category/all">Shop All Products</a></p>

		{
			 categories.map(category => (
			 	<p key={category} className=" text-sm mb-3 hover:text-amber-700"><a href={`/products/category/${category}`}>{category} </a></p>
			 	))
		}

		</div>


{/*About us*/}
		<div className="leading-loose ">
			<h3 className="mb-3">ABOUT US</h3>
			{
			 about.map(info => (
			 	<p key={info} className=" text-sm mb-3 hover:text-amber-700">{info}</p>
			 	))
		}

		</div>

		

{/*logo*/}
		<div className="   justify-center hidden md:flex md:flex-col">
		<ShopsphereLogo
	className="font-medium text-xl md:text-4xl lg:text-6xl text-stone-400 headerfont"
		links={"/"}
/>
<small className="text-center my-3"> {storeInfo.description} </small>
</div>

{/*Socials*/}
<div className=" hidden gap-5 lg:flex py-5  ">
		{
			socials.map((soc,index)=> (
<div 
key={index}
className="hover:text-amber-700 text-xl ">
{soc}
	</div>
				))
		}
		</div>

		</div>


		<div className="headerfont px-10 border-t border-stone-400 text-sm text-center py-5 md:text-center">
All rights reserved &copy; {year} Shopsphere Ltd
		</div>

		</div>

		)
}
export default Footer
