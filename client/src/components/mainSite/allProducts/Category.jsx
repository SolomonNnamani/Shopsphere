import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import {useSearchParams} from 'react-router-dom'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaSearch } from "react-icons/fa";
import { CiFilter } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import {fetchPublic} from '../utils/fetchPublic.js'

const filterArrays = ["Category","Size","Material","Price","Color"]
const Category = ({setLoading,setError}) => {
	const {category} = useParams()
	const [productCategory, setProductCategory] = useState([])
	
	const [filteredProducts, setFilteredProducts] = useState([])
	
	const [toggleFilterBtn, setToggleFilterBtn] = useState(false) //for filter btn
	const [openSections, setOpenSections] = useState({
			Category:true,
			Size:false,
			Material:false,
			Price:false,
			Color:false
	})
	const [isMediumScreen, setIsMediumScreen] = useState(false)

	const [selectedCategory, setSelectedCategory] = useState([])
	const [selectedSize, setSelectedSize] = useState([])
	

	const [selectedMaterial, setSelectedMaterial] = useState([])
	
	const [selectedPrices, setSelectedPrices] = useState([])
	const [selectedColors, setSelectedColors] = useState([])
	const [search, setSearch] = useState("")
	const [searchParams, setSearchParams] = useSearchParams();


	//Hardcoded price ranges that user can filter with
	const priceRanges = [
			{label: "Less than $70", min:0, max:70},
			{label: "$70 to $170", min:70, max:170},
			{label: "$170 and more", min:170, max:Infinity}

		]



	useEffect(()=> {
		const fetchProductCategory = async() => {
			setLoading(true)
			try{
				const res = await fetchPublic(`/api/dashboard/products`)
				if(!res.ok) {
					throw new Error("Failed to fetch products")
				}
			const data = await res.json()
			 const foundCategory = data.products.filter((item) => item.category.toLowerCase() === category.toLowerCase());
			
			 setProductCategory(foundCategory)

		}catch(error){
			console.log("Error", error)
			setError("Error loading contents, please check your network")
			

		}finally{
			setLoading(false)
		}
		}
		fetchProductCategory()
	},[category])


		//get unique tags
		const allCategory = [...new Set(productCategory.flatMap(product => product.subCategory))]
		

	   //get unique colors
	   const  allColors = [...new Set(productCategory.flatMap(product => product.color
		.replace(/ and /gi, ",")  // Replace " and " with ","
		.split(",") // Split into array
		.map((color)=> color.trim()) //trim whitespace
		.filter(Boolean)// remove empty strings

		))]	

	   //get unique size
	   const allSize = [...new Set(productCategory.flatMap(product=>product.size
	   	.split(",") // Split into array
		.map((size)=> size.trim()) //trim whitespace
		.filter(Boolean)// remove empty strings

	   	))]
	  

	   //get unique Material
	   const allMaterial = [...new Set(productCategory.flatMap(product => product.material))]
	   		


//for sectionsBtn....
	const toggleSection = (btnValue) => {
		setOpenSections(prev => ({
			...prev,
			[btnValue]: !prev[btnValue] //for instance tag is passed. is gonna look like [tag]: !prev[tag], which means if its tag then open/close it
		}))
	}


//check screen size so we can disable scrolling
	useEffect(() => {
  const checkScreenSize = () => {
    setIsMediumScreen(window.innerWidth >= 768) // md breakpoint in Tailwind is 1024px
  }

  // Check immediately and on resize
  checkScreenSize()
  window.addEventListener("resize", checkScreenSize)

  return () => {
    window.removeEventListener("resize", checkScreenSize)
  }
}, [])



//disbale background scroll in screen less than lg screen if filter div is active
	useEffect(()=> {
		if(toggleFilterBtn && !isMediumScreen){
		  // Disable background scroll
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup in case component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };

	},[toggleFilterBtn, isMediumScreen])





	useEffect(() => {
		//Start with all products first
		let filtered = [...productCategory]

		// Step 1: If user selected any sub category, only keep products that have at least one of those tags
		if(selectedCategory.length > 0){
			console.log("category called")
			filtered = filtered.filter(product => {
				const subCategory = product.subCategory?.split(",").map(sub => sub.trim()) //"to array, then trim the extra space"
				return subCategory?.some(sub => selectedCategory.includes(sub))// For example: if selectedTags = ['Men'], it keeps product with tags like ['Men', 'Summer']

			})
				}

//Size

					if(selectedSize.length > 0){
						console.log("size called")
			filtered = filtered.filter(product => {
			const sizes = product.size
			?.split(",") // turn into array
			.map(s => s.trim()) // trim each value
			.filter(Boolean); // remove empty strings
			return sizes?.some(s => selectedSize.includes(s))
			})
				}


				//Material

					if(selectedMaterial.length > 0){
			filtered = filtered.filter(product => {
				const materials = product.material?.split(",").map(mat => mat.trim()) //"to array, then trim the extra space"
				return materials?.some(mat => selectedMaterial.includes(mat))// For example: if selectedSize = ['Leather'], it keeps product with material that include  ['Leather', 'etc']

			})
				}


			//  Step 2: If user selected price ranges, only keep products that fall into any of those ranges
			if(selectedPrices.length > 0){
				filtered = filtered.filter(product => {//
					//check if this product falls in ANY of the selected price ranges
					return selectedPrices.some(label => { //
						const range = priceRanges.find(r => r.label === label) // e.g. range = {label: "$20 - $50", min: 20, max: 50}
						return product.price >= range.min && product.price < range.max//
						
					})
				})
			}

			//Step 3
			if(selectedColors.length > 0){
				filtered = filtered.filter(product =>{ //we are going to tweark this logic cause color is not always an array. although i splited perfectly in "allColors" but it doesnt direct update to the allPrdduct. so we will have to re-write the logic here
									const colors = product.color
									?.replace(/ and /gi, ",") // Replace "and" with comma
				      				.split(",") // turn into array
				      				.map(c => c.trim()) // trim each value
				      				.filter(Boolean); // remove empty strings

				      				return colors?.some(c => selectedColors.includes(c))
									
									})
			}

			//for search
			if(search !== ""){
				filtered = filtered.filter(product => {
					return	product.productName.toLowerCase().match(search.toLowerCase())
						
				})
			}

			setFilteredProducts(filtered)

	},[search,selectedCategory,selectedSize,selectedMaterial,selectedPrices, selectedColors,productCategory])


	//This displays what ever is been filtered on the url as query string
	useEffect(()=> {
		const params = {}

		if (search) params.search = search;// like = http://localhost:5173/products/category/all?search=suit
		if (selectedCategory.length > 0) params.category = selectedCategory.join(",") //like = http://localhost:5173/products/category/all?tags=classic
		if (selectedSize.length > 0) params.size = selectedSize.join(",")
		if (selectedMaterial.length > 0) params.material = selectedMaterial.join(",")
		if (selectedPrices.length > 0) params.prices = selectedPrices.join(",")
		if (selectedColors.length > 0) params.colors = selectedColors.join(",");

		setSearchParams(params)

	},[search,selectedCategory,selectedSize,selectedMaterial,selectedPrices, selectedColors])


	// This useEffect pre-fills the checkboxes and search input 
// with values from the URL query string (e.g., ?tags=..., &search=...)
// so that filters persist after page reload or direct link access.
useEffect(()=> {
	// This effect runs ONLY ONCE when the component loads
  // It reads the query parameters in the URL

	// Get value of `tags` from URL like: ?tags=Men,Classic
	const categoryFromURL = searchParams.get("category")?.split(",") || [];//Try to get the tags from the URL.If it’s there, split them by commas into an array. If it’s not there, just give me an empty array instead.
	const sizeFromURL = searchParams.get("size")?.split(",") || [];
	const materialFromURL = searchParams.get("material")?.split(",") || [];

	const pricesFromURL = searchParams.get("prices")?.split(",") || [];

	const colorsFromURL = searchParams.get('colors')?.split(",") || [];

	const searchFromURL = searchParams.get('search') || ""; //Get search keyword: ? search=boots

	//Update your filter states with the values from URL
	setSelectedCategory(categoryFromURL);
	setSelectedSize(sizeFromURL);
	setSelectedMaterial(materialFromURL);
	setSelectedPrices(pricesFromURL);
	setSelectedColors(colorsFromURL);
	setSearch(searchFromURL) 

},[])

return(
	<div className="pt-15 lg:pt-20 ">
	<div>

		<div className=" flex justify-center my-15">
      <h2 className="text-3xl md:text-4xl font-medium ">{category} </h2>
      </div>


{/*fot btn filter and select*/}
<div className="headerfont text-sm flex items-center gap-1 md:gap-5 mb-4 md:mb-5 ml-1 md:hidden">
<button
className="border border-stone-300 px-2 py-1  rounded  flex items-center gap-1 transition-transform duration-100 active:scale-95"
onClick={()=> {setToggleFilterBtn(prev => !prev)}}
>
<CiFilter /> Filters 
</button>

<p>{filteredProducts.length} items </p>
</div>




		{/*will be flex container for filter background and grid col*/}
<div className="md:flex ">


{(toggleFilterBtn || isMediumScreen) && (

<div className="fixed md:sticky w-full md:w-1/3 lg:w-1/4 h-screen z-10 md:z-0 bg-[ghostwhite]  top-0  overflow-y-auto hide-scrollbar-lg pb-15">

	{/*header div*/}
     <div className="md:hidden">
     <div className="flex items-center justify-between px-5  text-sm py-5 border-b border-stone-300">
     {/*clear all btn*/}
     <button 
     className="  px-2 py-1  rounded text-sm"
     onClick={()=> {
      setSelectedCategory([]);
  setSelectedSize([]);
  setSelectedMaterial([]);
  setSelectedPrices([]);
  setSelectedColors([]);
  setSearch("");
  setSearchParams({});
      }}
     >
     	Clear all
     </button>

     <div className="text-xl headerfont text-black/90">
     Filters 
     </div>

	{/*close btn*/}
<button className=" px-2 py-1  rounded text-lg flex items-center justify-center  "
onClick={()=> {setToggleFilterBtn(prev => !prev)}}>
     <IoMdClose className="size-7"/> 
     </button>
     </div>
     </div>{/*End*/}


     	{/*FilterArrays*/}
     {
     	filterArrays.map((btnValue,index) => (
     		<div key={index} className="px-3">
     		<button 
     		className="flex justify-between items-center w-full border-b border-slate-200 py-4 text-sm headerfont font-medium text-black/80 "
     		onClick={() => toggleSection(btnValue)}

     		>
     			{btnValue} {openSections[btnValue] ?( <IoIosArrowDown className="size-4"/>) :
          (<IoIosArrowUp className="size-4 "/> )}
     		</button>

     		{/*for sections, Tags*/}
     		{openSections[btnValue] && btnValue === "Category" && (
     			<div>
     			<div className="p-3 bg-[ghostwhite] grid grid-cols-2 md:grid-cols-1 ">
     	{allCategory.map(cat => (
     		
     		<label key={cat}  className="!flex gap-2 !font-medium text-xs !my-1 headerfont pb-5">
     		<input
     		type="checkbox"
     		value={cat}
     		checked = {selectedCategory.includes(cat)}
     		onChange={(e) => {
     			const value = e.target.value
     			setSelectedCategory(prev => prev.includes(value)
     				? prev.filter(c => c !== value)
     				: [...prev, value]
     				)
     		}}
     		className="custom-checkbox "
     		/>
     		{cat}
     		</label>
   
     		))}
     			</div>

     			

            </div>
     			)}

     		{/*Size*/}
     		{openSections[btnValue] && btnValue === "Size" && (
     			<div>
     			<div className="p-3 bg-[ghostwhite] grid grid-cols-2 md:grid-cols-1 ">
     			{allSize.map(size => (
     				<label key={size} className="!flex gap-2 !font-medium text-xs !my-1 headerfont pb-5" >
     				<input
     				type="checkbox"
     				value={size}
     				checked = {selectedSize.includes(size)}//if selectedSize state has this size which might be ["M", "Xl" etc], then mark as checked
     				onChange = {(e) => {
     					const value = e.target.value
     					setSelectedSize(prev => prev.includes(value) //if this color already exist in the selectedColors
     						? prev.filter(s => s !== value) // then remove it
     						: [...prev, value] //else, if it does not exist then add it
     						)
     				}}
     				className="custom-checkbox "
     				/>
					{size}

     				</label>

     				))}
</div>
				
     			</div>
     			)}


     		{/*Material*/}
     		{openSections[btnValue] && btnValue === "Material" && (
     			<div>
     			<div className="p-3 bg-[ghostwhite] grid grid-cols-2 md:grid-cols-1 ">
     			{allMaterial.map( material => (
     				<label key={material} className="!flex gap-2 !font-medium text-xs !my-1 headerfont pb-5" >
     				<input
     				type="checkbox"
     				value={material}
     				checked = {selectedMaterial.includes(material)}//if selectedMaterial state has this material which might be ["Geuine Leather", "Leather" etc], then mark as checked
     				onChange = {(e) => {
     					const value = e.target.value
     					setSelectedMaterial(prev => prev.includes(value) //if this color already exist in the selectedColors
     						? prev.filter(m => m !== value) // then remove it
     						: [...prev, value] //else, if it does not exist then add it
     						)
     				}}
     				className="custom-checkbox "
     				/>
					{material}

     				</label>

     				))}
</div>
				
     			</div>
     			)}


     			{/**Price, if the current section is 'Price ' and it's open, show this */}
     		{openSections[btnValue] && btnValue === "Price" && (
     			<div className="p-3 bg-[ghostwhite] grid grid-cols-2 md:grid-cols-1 ">
     			{/*Loop through the defined price ranges and create checkboxes*/}
     			{priceRanges.map((range, index)=>(
     				<label key={index} className="!flex gap-2 !font-medium text-xs !my-1 headerfont pb-5" >
     				<input
     				type="checkbox"
     				value={range.label} //this is what we track when selected (eg...might be less than 70 or $70 to $170 etc )
     				checked={selectedPrices.includes(range.label)} // is this range already selected(in code terms, if a value in range.label already exists in the selectedPrices then mark as selected.)
     				onChange={(e) => {
     					const value = e.target.value
     					//if already selected, remove it. else, add it to selectedPrices
     					setSelectedPrices(prev => 
     						prev.includes(value)//if this particlar label is already present
     						? prev.filter(p => p !== value) //remove
     						: [...prev, value] //add

     						)

     				}}
     				className="custom-checkbox "
     				/>
     				{range.label}
     				</label>
     				))}
     			</div>	
     		)}

     		{/*Colors*/}
     		{openSections[btnValue] && btnValue === "Color" && (
     			<div>
     			<div className="p-3 bg-[ghostwhite] grid grid-cols-2 md:grid-cols-1 ">
     			{allColors.map(color => (
     				<label key={color} className="!flex gap-2 !font-medium text-xs !my-1 headerfont pb-5" >
     				<input
     				type="checkbox"
     				value={color}
     				checked = {selectedColors.includes(color)}//if selectedColors state has this color which might be ["red", "amber" etc], then mark as checked
     				onChange = {(e) => {
     					const value = e.target.value
     					setSelectedColors(prev => prev.includes(value) //if this color already exist in the selectedColors
     						? prev.filter(c => c !== value) // then remove it
     						: [...prev, value] //else, if it does not exist then add it
     						)
     				}}
     				className="custom-checkbox "
     				/>
					{color}

     				</label>

     				))}
</div>
				
     			</div>
     			)}


     		

     		</div>
     		))}

{/*clear all btn for md - lg screen*/}
     <button 
     className="  px-2 py-1  rounded text-sm border border-stone-300 mx-3 my-3"
     onClick={()=> {
      setSelectedCategory([]);
  setSelectedSize([]);
  setSelectedMaterial([]);
  setSelectedPrices([]);
  setSelectedColors([]);
  setSearch("");
  setSearchParams({});
      }}
     >
     	Clear all
     </button>
<div className="mx-1 relative  md:hidden">
     <button className="absolute  headerfont text-xs border border-black/80 w-full   py-2 rounded   "
onClick={()=> {setToggleFilterBtn(prev => !prev)}}>
     SHOW {filteredProducts.length} RESULTS
     </button>
     </div>

      </div>
	)}






	<div className="relative w-full">
<div className="absolute -top-12 right-0 flex items-center gap-2 headerfont ">
<p className="hidden md:block text-sm">{filteredProducts.length} items </p>
<label className="!flex items-center gap-2 !font-normal text-sm !my-1 headerfont ">
<input
type="text"
name="search"
value={search}
placeholder="search products..."
onChange={(e)=> {setSearch(e.target.value)} }
className="border rounded border-stone-300 px-2 py-1 outline-none"
/>
 <FaSearch className="size-5 text-black/70 " />
</label>

</div>

{/*product card*/}
      <div className=" grid grid-cols-2 lg:grid-cols-4 gap-1  w-full ">
      
      {
      	filteredProducts.length > 0 ? ( filteredProducts.map(item => (
      			<div 
			key={item._id} 
			className=" headerfont"
			>
	<a href={`/${item.slug}`} >
			<div className="">
				<img 
				src={item.mainImage.replace(
    "/upload/",
    "/upload/w_1200,q_85,f_auto,dpr_auto/"
  )} 
				alt={item.productName}
				className="w-full h-72 md:h-96 object-cover mx-auto rounded-tl rounded-tr border-r border-l border-t border-stone-300"
				 
				/>
				</div>

				<div className="px-2 bg-stone-100 border-b border-r border-l border-stone-300 rounded-bl rounded-br h-[5rem]" >
				<p className="text-[12px] font-medium leading-relaxed ">{item.productName} </p>
				<p className="font-bold text-sm leading-relaxed md:leading-loose">${item.price}</p>
				<p className="text-[12px] text-black/70 font-medium leading-relaxed md:leading-loose ">Avaliable Colors: {item.color} </p>
				</div>
				</a>

				</div>
      		))
      		):(
      		<div className="flex items-center justify-center col-span-2 lg:col-span-4 h-dvh  ">
				<p className="text-3xl font-medium text-black/70">No products found.</p>
      		</div>
      			 

      		)}

      </div>
      </div>
      </div>


	</div>	
	</div>
	)
}
export default Category