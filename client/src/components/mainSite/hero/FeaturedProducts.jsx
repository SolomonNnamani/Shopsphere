import {useState,useEffect,useRef} from 'react'
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {fetchPublic} from '../utils/fetchPublic.js'

const scrollAmount = 300
const FeaturedProducts = ({setLoading,setError})=> {
	const [products, setProducts] = useState([])
	const [isAtStart, setIsAtStart] = useState(true);
	const [isAtEnd, setIsAtEnd] = useState(false);
	const scrollRef = useRef()



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


	let filteredProducts = products.filter((item)=> { //all products
		//Get only the first 2 items of each category
		const category =products.filter(p => p.category === item.category)//give me all listed category in this products
		const itemIndex = category.findIndex(p => p._id === item._id) //this detemines the number of deseired product in this category, giving u the opporunity to manupulate as desired as shown below
		
		return itemIndex < 2 // only return the first 2 product in this category 
})

	

	const handlePrev = () => {
		scrollRef.current.scrollLeft -= scrollAmount
	};

	const handleNext = () => {
		scrollRef.current.scrollLeft += scrollAmount;
	}

	const checkScroll = () => {
		const scroll = scrollRef.current;
		if(!scroll) return;

		setIsAtStart(scroll.scrollLeft === 0);//if it gets to the end disable button
		setIsAtEnd(scroll.scrollLeft + scroll.clientWidth >= scroll.scrollWidth - 5)
	}

	useEffect(()=> {
		if(products.length > 0){
			const timer = setTimeout(()=> {
				checkScroll();
			},100)//wait 1s still all product is loaded then run checkScroll
			return () => clearTimeout(timer)
		}
	},[products])

	useEffect(()=> {
		const scroll = scrollRef.current;
		if(!scroll) return;

		

		// ✅ Listen for manual scrolls (mouse or touch) to update button disable state
		scroll.addEventListener("scroll", checkScroll)

			 // ✅ Clean up on unmount to avoid memory leaks
		return ()=> scroll.removeEventListener("scroll", checkScroll)

	},[])



return(
<div className="">
<p className=" text-center mt-7 mb-3 font-medium text-black/80 text-xl headerfont">
Want to polish your look? These pieces finish the job. </p>


<div className="flex md:mx-5">
<button 
className="hidden  md:block lg:flex lg:items-center lg:justify-center p-3 rounded-lg md:w-[3pc] lg:w-[12pc]  disabled:opacity-1 transition-all duration-500 ease-in-out "
onClick={handlePrev}
disabled={isAtStart}

>
<IoIosArrowBack   className="md:text-4xl lg:text-6xl text-slate-400"/>
</button>

<div 
ref={scrollRef}
className="w-full overflow-x-scroll hide-scrollbar-lg   scroll-smooth"

>
<div className="flex gap-3 min-w-[800px] py-4 ">
{
	filteredProducts.map(item => (
			<div 
			key={item._id} 
			className="min-w-[250px] shrink-0 headerfont  shadow-[0_9px_8px_-3px_rgba(0,0,0,0.3)]  "
			>
		<a href={`/${item.slug}`} >
			<div className="">
				<img 
				src={item.mainImage.replace(
    "/upload/",
    "/upload/w_1200,q_85,f_auto,dpr_auto/"
  )} 
				alt={item.productName}
				className="w-[17pc] h-[25pc] md:w-[17pc] lg:w-20pc object-cover  mx-auto rounded-tl rounded-tr border-r border-l border-t border-stone-300"
				 
				/>
				</div>

				<div className="px-2 bg-stone-100 border-b border-r border-l border-stone-300 rounded-bl rounded-br" >
				<p className="text-[12px] font-medium leading-loose ">{item.productName} </p>
				<p className="font-bold text-sm leading-loose">${item.price}</p>
				<p className="text-[12px] text-black/70 font-medium leading-loose">Avaliable Colors: {item.color} </p>
				</div>
				</a>
				</div>
		
			

		))
}
	</div>
	</div>


	<button 
	className="hidden  md:block lg:flex lg:items-center lg:justify-center p-3  rounded-lg md:w-[3pc] lg:w-[12pc]  disabled:opacity-1  transition-all duration-500 ease-in-out "
	onClick={handleNext}
	disabled={isAtEnd}

	>
<IoIosArrowForward className="md:text-4xl lg:text-6xl text-slate-400"/>
</button>
		</div>





</div>

	)
}

export default FeaturedProducts