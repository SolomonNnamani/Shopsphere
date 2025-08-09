import { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { RiArrowDropDownLine } from "react-icons/ri";
import {useSearchParams} from 'react-router-dom'
import {fetchPublic} from '../utils/fetchPublic.js'
import NotFound from "../notFound/NotFound.jsx"

const ItemPage = ({setLoading,setError, setToggleCart,setCartItems}) => {
	const {slug} = useParams() // 👈 grabs the dynamic part of the URL
	const [product, setProduct] = useState(null)
	const [formData, setFormData] = useState({
		size:"",
		color:""
	})
	const [errorText, setErrorText] =useState({
		size:"",
		color:"",
	})
	const [submitted, setSubmitted] = useState(false)
	const [outOfStock, setOutOfStock] = useState(null)
	const [relatedProducts, setRelatedProducts] = useState([])
	const [loadingProduct, setLoadingProduct] = useState(true);
	const [searchParams, setSearchParams] = useSearchParams()
	
	

	useEffect(()=> {
	const fetchContents = async()=> {
			setLoading(true)
			setLoadingProduct(true); // Start loading
			try{
				const res = await fetchPublic(`/api/dashboard/products`)
				if(!res.ok) {
					throw new Error("Failed to fetch products")
				}
			const data = await res.json()
			 const found = data.products.find((item) => item.slug === slug);
			 setProduct(found)

			 if(!found){
			 	setProduct(null)
			 	return;
			 }

			 if (found){
			 const related = data.products.filter((item) => {
			 	if(item.slug === slug) return false; //Exclude current product

			 	const hasCommonTag = item.tags.some(tag => found.tags.includes(tag)); //check if any tags in all the product matchs the some of the current item tags
			 	const sameSubCategory = item.subCategory === found.subCategory;
			 	const sameCategory = item.category === found.category;

			 	return hasCommonTag || sameSubCategory || sameCategory
			 })
			 //shuffle using sort and random
			 const shuffleRelated = related.sort(()=> Math.random() - 0.5)
			 setRelatedProducts(shuffleRelated.slice(0,8))
			}

		}catch(error){
			console.log("Error", error)
			setError("Error loading contents, please check your network")
			

		}finally{
			setLoading(false)
			setLoadingProduct(false); // Done loading
		}
		}
		fetchContents()
	},[slug,setLoading])


	const size = product?.size.split(",").map(size =>size.trim() )
	
	
	const color = product?.color.replace("and", "").split(", ").map(color =>color.trim() )
	

	const validate= ()=> {
		let isValid = true
		setErrorText({ size: "", color: "" });
		if(!formData.size){
			setErrorText(prev => ({...prev, size:"size must not be empty!" }))
			isValid=false
		}
		if(!formData.color){
			
			setErrorText(prev => ({...prev, color:"Please select a color!" }))
			isValid=false
		}
		return isValid

	}

	const handleClick = () => {
		if(!validate()) {
			
			return
		}
		const cartItem = {
			productName: product?.productName,
			image: product?.mainImage,
  			size: formData.size,
  			color: formData.color,
  			price:product?.price,
  			stock:product?.stkQuantity,
  			weight:product?.weight,
  			qty:1,
		};

		let existingCart = JSON.parse(localStorage.getItem('cart')) || [];//the getItem means, get the already existing item in the ls and resave it along with the new one. because ls cant really remeber what was saved on it before
		//check if item with the pname,size and color already exist
		const existingItemIndex = existingCart.findIndex(item => 
			item.productName === cartItem.productName &&
			item.image === cartItem.image &&
			item.size === cartItem.size &&
			item.color === cartItem.color &&
			item.price === cartItem.price &&
			item.stock === cartItem.stock &&
			item.weight === cartItem.weight
			)
		
		const currentQtyInCart = existingItemIndex !== -1 ? existingCart[existingItemIndex].qty : 0;
		const stockQty = Number(product?.stkQuantity) || 0;

//check if qty is higher than the product stock quantity
		if(currentQtyInCart >=stockQty){
			setOutOfStock(true);
			return; //dont add more to cart
		}

//litrate qty number if user clicks for more
		if(existingItemIndex !== -1){
			//if item exists, increase the quantity
			existingCart[existingItemIndex].qty += 1

		}else{
			//if it doesnt exist, then add it as new item
			existingCart.push(cartItem)
		}

		//Save back to localStorage
		localStorage.setItem('cart', JSON.stringify(existingCart))
		setCartItems(existingCart) // this triggers Cart to re-render
		setToggleCart(true)

	}


//Params
	useEffect(()=> {
		const params = {}
		if(formData.size) params.size = formData.size
			if(formData.color) params.color = formData.color
				setSearchParams(params)
	},[formData.size, formData.color])

useEffect(()=> {
const sizeFromUrl = searchParams.get("size") || ""
const colorFromUrl = searchParams.get("color") || ""
setFormData({
	size:sizeFromUrl,
	color: colorFromUrl
})

},[])



if (!loadingProduct && !product) {
  return <NotFound />;
}


return(
	



<div className="pt-15 lg:pt-22 h-[100%] bg-slate-100 min-h-screen ">
<div className="">
  {product && (

    <div className="grid lg:grid-cols-2  lg:gap-5  px-5  ">
            <div className=" mt-5 mb-7 lg:hidden ">
          <h1 className="font-bold text-2xl headerfont  text-black/80">
            {product.productName}
          </h1>
          <p className="text-2xl headerfont mb-4 text-black/70">${product.price}</p>
          <hr className="block text-slate-300 "/>
          <p className="text-sm  leading-relaxed mt-4 text-black md:text-base">
            {product.description}
          </p>

        </div>
      

      {/**images*/}
<div className="overflow-hidden  lg:h-[38rem] ">
      <div className="w-full overflow-x-scroll hide-scrollbar-lg  scroll-smooth ">
        <div className="flex gap-2 min-w-[600px]  ">
          {product.galleryImages.map((image, index) => (
            <div key={index} className=" mx-auto min-w-[400px] shrink-0  md:min-w-[550px] lg:min-w-[29rem] lg:overflow-hidden lg:h-[38rem] ">

              <img
                src={image.replace(
                  "/upload/",
                  "/upload/w_1200,q_85,f_auto,dpr_auto/"
                )}
                alt="Product images"
                className="w-full h-[40rem] md:h-[45rem] lg:h-[45rem]  object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>
      </div>
      {/**image ends*/}


 
      

      {/*Mini container*/}


         <div className="flex flex-col   pt-5  md:h-full ">
          
          <div className="hidden lg:block "> 
{/*caption*/}
        <h1 className="font-bold text-2xl headerfont  text-black/80">
            {product.productName}
          </h1>
          <p className="text-2xl headerfont mb-4 text-black/70">${product.price}</p>
          <hr className="block text-slate-300 "/>
          <p className="text-sm leading-relaxed mt-4 text-black/85 md:text-base">
            {product.description}
          </p>
          </div>
     


          {/*size*/}
          <p className="text-black/80 font-medium mb-2 text-sm lg:mt-5 ">Available Size:</p>
          <div className="relative">
          <select
            className="border border-black/30 w-full outline-none p-2 headerfont text-black/70
             text-sm appearance-none bg-no-repeat pr-10 font-medium"
            value={formData.size}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, size: e.target.value }))
            }
          >
            <option value="">Please select a size</option>
            {size.map((s, index) => (
              <option key={index} value={s}>
                {s}
              </option>
            ))}
          </select>

          <div  className="pointer-events-none absolute top-0 right-3 flex items-center text-black/70">
<RiArrowDropDownLine className="text-4xl" />
           </div>

          </div>
          {errorText.size && (
            <small className="text-red-500">{errorText.size}</small>
          )}
          
          
          {/*color*/}
          <p className="text-black/80 font-medium mb-2 text-sm mt-5 ">Color:</p>
          <div className="relative">
          <select
            className="border border-black/30 w-full outline-none p-2 headerfont text-black/70
             text-sm appearance-none bg-no-repeat pr-10 font-medium"
            value={formData.color}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, color: e.target.value }))
            }
          >
            <option value="">Please select a color</option>
            {color.map((c, index) => (
              <option key={index} value={c}>
                {c}
              </option>
            ))}
          </select>
               <div  className="pointer-events-none absolute top-0 right-3 flex items-center text-black/70">
<RiArrowDropDownLine className="text-4xl" />
           </div>

          </div>
          {errorText.color && (
            <small className="text-red-500">{errorText.color}</small>
          )}
          


          <div className="grid grid-cols-2 md:grid-cols-3  gap-3 mt-5 lg:mt-7 ">
          {/*stock quantity*/}
          <div className=" text-center text-xs" >
          <p className="text-black/80 font-medium ">Available Stock: </p>
          <p className="text-amber-600 font-medium  ">{product.stkQuantity}</p>
         </div>
          
          {/*Gender*/}
         <div className=" text-center text-xs ">
          <p className="text-black/70 font-medium ">Gender: </p>
          <p className="font-medium text-black/90  ">{product.gender}</p>
         </div>
 {/*Brand*/}
          <div className=" text-center text-xs ">
            <p className="text-black/70 font-medium   ">Brand:</p>
            <p className="font-medium text-amber-600 headerfont ">{product.brand}</p>
          </div>

           <div className=" text-center text-xs ">
            <p className="text-black/70 font-medium   ">Material:</p>
            <p className="font-medium text-amber-600 headerfont">{product.material}</p>
          </div>

          {product.fitType &&(
          <div className=" text-center text-xs ">
            <p className="text-black/70 font-medium  ">Fit Type:</p>
            <p className="font-medium text-amber-600  headerfont">{product.fitType}</p>
          </div>
          	) }
           

          <div className=" text-center text-xs">
            <p className="text-black/70 font-medium text-sm  ">Style:</p>
            <p className="font-medium text-amber-600 headerfont">{product.style}</p>
          </div>

          </div>

          
          
         
         
          
<button
  className={`bg-amber-800 text-white mt-4 lg:mt-8  py-3 rounded-lg font-bold   transition-transform duration-100  ${
    outOfStock ? "opacity-50 !cursor-not-allowed " : "active:scale-95 hover:bg-amber-700"
  }`}
  onClick={handleClick}
  disabled={outOfStock}
>
  {outOfStock ? "OUT OF STOCK" : "ADD TO CART"}
</button>

        </div>
        

      
    </div>
  )}


	<div className="  ">
	<h3 className="text-2xl md:text-3xl headerfont font-medium text-center text-black/90 my-10 ">
	You might also like: </h3>


<div className="px-5 carousel-fade-right">
	<div 
className="w-full overflow-x-scroll hide-scrollbar-lg  scroll-smooth  "

>
<div className="flex min-w-[800px] gap-3 py-4  ">
{
	relatedProducts.map(item => (
			<div 
			key={item._id} 
			className="min-w-[250px] shrink-0 headerfont   shadow-[0_9px_8px_-3px_rgba(0,0,0,0.3)] "
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
	</div>


	</div>



</div>
</div>

	)
}
export default ItemPage