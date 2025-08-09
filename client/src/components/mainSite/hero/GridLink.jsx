import {useEffect, useState} from 'react'



const GridLink = () => {
	

	

return(
	<div className="pt-10">
	<div className="grid grid-cols-1 md:grid-cols-2">
	{/*All product div*/}
	<div className="relative">
	<a href="/products/category/all">
	<div className="relative">
	<div> 
	<img src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737405/All_shop_gjrqaa.jpg"
	alt="Shop all product"
	className="w-full h-[25rem] object-cover"
	 />
	 	</div>
	 	<div className="absolute top-0  h-full w-full hover:bg-black/20 z-10 "/>

	</div>

	{/*Context*/}
	<div className="lg:absolute lg:top-2 font-medium text-black/80  px-4 py-3 lg:text-white ">
	<h3 className="text-xl md:text-2xl lg:text-3xl">Refined pieces, built for presence </h3>
	<small className="headerfont lg:text-xl">Shop the Full Collection &gt; </small>
	</div>
	</a>
	</div>



	{/*All suits & jackets div*/}
	<div className="relative">
	<a href="/products/category/Suits & Jackets">
	<div className="relative">
	<div> 
	<img src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737402/Suit_jacket_xqps12.jpg"
	alt="Shop all product"
	className="w-full h-[25rem] object-cover"
	 />
	 	</div>
	 	<div className="absolute top-0  h-full w-full hover:bg-black/20 z-10 "/>

	</div>

	{/*Context*/}
	<div className="lg:absolute lg:top-2 font-medium text-black/80 lg:text-black/100 px-4 py-3 ">
	<h3 className="text-xl md:text-2xl lg:text-3xl">The gentleman’s first impression. </h3>
	<small className="headerfont lg:text-xl">Browse Suits & Jackets &gt;</small>

	</div>
	</a>
	</div>


	{/*All shoes div*/}
	<div className="relative">
	<a href="/products/category/Shoes">
	<div className="relative">
	<div> 
	<img src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737398/shoes_levagy.jpg"
	alt="Shop all product"
	className="w-full h-[25rem] object-cover"
	 />
	 	</div>
	 	<div className="absolute top-0  h-full w-full hover:bg-black/20 z-10 "/>

	</div>

	{/*Context*/}
	<div className="lg:absolute lg:top-2 font-medium text-black/80 px-4 py-3 lg:text-black/100">
	<h3 className="text-xl md:text-2xl lg:text-3xl">Every step, well considered.</h3>
	<small className="headerfont lg:text-xl">Browse Footwear &gt;</small>

	</div>
	</a>
	</div>


	{/*All bags div*/}
	<div className="relative">
	<a href="/products/category/Bags">
	<div className="relative">
	<div> 
	<img src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737395/bags_noz7fm.jpg"
	alt="Shop all product"
	className="w-full h-[25rem] object-cover"
	 />
	 	</div>
	 	<div className="absolute top-0  h-full w-full hover:bg-black/20 z-10 "/>

	</div>

	{/*Context*/}
	<div className="lg:absolute lg:top-2 font-medium text-black/80 px-4 py-3 ">
	<h3 className="text-xl md:text-2xl lg:text-3xl">Carry less. Carry well. </h3>
	<small className="headerfont lg:text-xl">Shop Bags &gt; </small>

	</div>
	</a>
	</div>


	{/*All trousers div*/}
	<div className="relative">
	<a href="/products/category/Trousers">
	<div className="relative">
	<div> 
	<img src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737404/trousers_j8p0kp.png"
	alt="Shop all product"
	className="w-full h-[25rem] object-cover"
	 />
	 	</div>
	 	<div className="absolute top-0  h-full w-full hover:bg-black/20 z-10 "/>

	</div>

	{/*Context*/}
	<div className="lg:absolute lg:top-2 font-medium text-black/80 px-4 py-3 ">
	<h3 className="text-xl md:text-2xl lg:text-3xl">Tailored comfort. Timeless structure. </h3>
	<small className="headerfont lg:text-xl">Browse Trousers &gt;</small>

	</div>
	</a>
	</div>


	{/*All watches div*/}
	<div className="relative">
	<a href="/products/category/Watches">
	<div className="relative">
	<div> 
	<img src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737395/watch_e9ww4w.jpg"
	alt="Shop all product"
	className="w-full h-[25rem] object-cover"
	 />
	 	</div>
	 	<div className="absolute top-0  h-full w-full hover:bg-black/20 z-10 "/>

	</div>

	{/*Context*/}
	<div className="lg:absolute lg:top-2 font-medium text-black/80 px-4 py-3 lg:text-white">
	<h3 className="text-xl md:text-2xl lg:text-3xl">Every second, styled right. </h3>
	<small className="headerfont lg:text-xl">View All Watches &gt; </small>

	</div>
	</a>
	</div>


	{/*All Accesories div*/}
	<div className="relative">
	<a href="/products/category/Accessories">
	<div className="relative">
	<div> 
	<img src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737403/accessories_rz73uz.png"
	alt="Shop all product"
	className="w-full h-[25rem] object-cover"
	 />
	 	</div>
	 	<div className="absolute top-0  h-full w-full hover:bg-black/20 z-10 "/>

	</div>

	{/*Context*/}
	<div className="lg:absolute lg:top-2 font-medium text-black/80 px-4 py-3 lg:text-white">
	<h3 className="text-xl md:text-2xl lg:text-3xl">The little things, done right. </h3>
	<small className="headerfont lg:text-xl">Shop Accessories &gt; </small>

	</div>
	</a>
	</div>


	{/*All shirt div*/}
	<div className="relative">
	<a href="/products/category/Shirts">
	<div className="relative">
	<div> 
	<img src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737395/shirts_ushk9s.jpg"
	alt="Shop all product"
	className="w-full h-[25rem] object-cover"
	 />
	 	</div>
	 	<div className="absolute top-0  h-full w-full hover:bg-black/20 z-10 "/>

	</div>

	{/*Context*/}
	<div className="lg:absolute lg:top-2 font-medium text-black/80 px-4 py-3 lg:text-black/100">
	<h3 className="text-xl md:text-2xl lg:text-3xl">Crisp. Clean. Always in season.</h3>
	<small className="headerfont lg:text-xl">Browse Shirts &gt; </small>

	</div>
	</a>
	</div>
</div>{/*grid end*/}




{/*Section 2*/}

	<div className="grid grid-cols-1 md:grid-cols-4 gap-5 w-full lg:px-30 mt-10 lg:mt-0  py-15 bg-stone-100">

{/*about us*/}
	<div className="">
		<div className="overflow-hidden rounded-full w-[10rem] h-[10rem] mx-auto">
  <img
    src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753747061/hamid-tajik-adkLGUz1gAI-unsplash_lo3rw6.jpg"
    alt="about us"
    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
    style={{
      objectPosition: "50% 0%"
    }}
  />
</div>
		<div className="text-center">
		<h3 className="py-3 text-xl font-medium text-black/90">Designed with Purpose </h3>
		<p className="text-xs w-90 lg:w-[13rem] md:w-[10rem]  mx-auto  font-medium">We don’t just create clothing, we craft identity.
Every jacket, shirt, and trouser is made to reflect the quiet strength of the man who wears it. </p>

		</div>
	</div>


	{/*tailor*/}
	<div className="">
		<div className="overflow-hidden rounded-full w-[10rem] h-[10rem] mx-auto">
  <img
    src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753747062/khang-nguyen-I_niNcbya1Y-unsplash_dasf1t.jpg"
    alt="about us"
    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
   
  />
</div>
		<div className="text-center">
		<h3 className="py-3 text-xl font-medium text-black/90">Tailoring That Speaks </h3>
		<p className="text-xs w-90 mx-auto lg:w-[13rem] md:w-[10rem] font-medium">Fit is more than a measurement, it’s a language.
Our garments are shaped with precision and intention, for men who carry themselves with clarity and confidence. </p>

		</div>
	</div>


	{/*watch*/}
	<div className="">
		<div className="overflow-hidden rounded-full w-[10rem] h-[10rem] mx-auto">
  <img
    src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753747061/stefan-hoogstrate-bIIXiN9udj4-unsplash_c9dtob.jpg"
    alt="about us"
    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
   
  />
</div>
		<div className="text-center">
		<h3 className="py-3 text-xl font-medium text-black/90">Time Honored, Time Tested </h3>
		<p className="text-xs w-90 mx-auto lg:w-[13rem] md:w-[10rem] font-medium">Watches aren’t just accessories, they mark presence, memory, and movement.
We design timepieces that are understated, enduring, and built to hold meaning. </p>

		</div>
	</div>


	{/*accesory*/}
	<div className="">
		<div className="overflow-hidden rounded-full w-[10rem] h-[10rem] mx-auto">
  <img
    src="https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,q_85,f_auto,dpr_auto/v1753737403/accessories_rz73uz.png"
    alt="about us"
    className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
   
  />
</div>
		<div className="text-center">
		<h3 className="py-3 text-xl font-medium text-black/90"> The Details That Define </h3>
		<p className="text-xs w-90 mx-auto font-medium md:w-[10rem] lg:w-[13rem] ">A gentleman’s impression often rests in the smallest details.
From leather finishes to brushed metals, we obsess over the pieces most overlook. </p>

		</div>
	</div>





	</div>{/*grid2 end */}




	</div>

	)
}
export default GridLink