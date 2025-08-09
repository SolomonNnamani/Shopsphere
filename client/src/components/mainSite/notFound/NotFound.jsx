import React from 'react'
import notFound from "../../reuseable/svg/notFound.svg";

const NotFound = () => {



	return(
		<div className="py-15 lg:py-25">
			<div className="flex flex-col justify-center">
			<div className="mx-auto">
				<img
            src={notFound}
            alt="Not NotFound"
            className="w-62 h-62  md:w-72 lg:m-0 "
          />
			</div>
			<span className="text-center font-bold text-black/80 text-sm">ERROR 404 </span>

			<div className="headerfont text-center  ">
				<h3 className="text-2xl my-5 text-black/80 " >Hmm, there's nothing here.</h3>

				<p className="text-xs mb-5">Either this page no longer exists, or there's a typo in the web 
				address. Click below for something more interesting.  </p>
				<a href="/" className="block mx-auto bg-amber-700 hover:bg-amber-800 text-sm text-white px-3 py-2 rounded w-40">TAKE ME SHOPPING </a>
			</div>

		</div>

		</div>
		)
}


export default NotFound