import {useState, useEffect, useRef} from 'react'
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {toast} from 'react-toastify';

import gsap from 'gsap'
//import {fetchAuth} from '../utils/fetchAuth.js'


const Mobile = ({products,setLoading,isOpen,setIsOpen, setError}) => {
	const [isDropDownId, setIsDropDownId] = useState(null)
	const sidebarRef = useRef()
	const dropdownRef = useRef({})
  



	


	const handleToggle = (category) => {
    const dropdown = dropdownRef.current[category]
		if(isDropDownId === category){
		//	setIsDropDownId(null) // Close the dropdown if it's already open

        //Close the dropdown
        gsap.to(dropdown, {
          height:0,
          opacity:0,
          duration:0.3,
          ease:"power2.out",
          onComplete: ()=> {
            setIsDropDownId(null)//close the div if the animation is ready, if this was before the animation the div will close suddenly before the animation runs
          }
        })

		}else{
        //1. React creates the dropdown html but its invisible (height: 0, opacity: 0)
			setIsDropDownId(category) // Creates the div but user cant see it

//Use setTimeout to ensure the DOM is updated before animating, react needs a little time to create the div html which is why we use the setTimeout to give it a split second 
            setTimeout(()=> {
              const dropdown = dropdownRef.current[category]
              if(dropdown){
                 //2. we secretly ask it "Hey div, how tall will u be bro if you were visible?"
      gsap.set(dropdown, {
      height: "auto",//Temporarily make it natural size
      opacity:1, // Make it visible so padding is included in measurement

      })
      const height = dropdown.offsetHeight //Measure: "Oh, you'd be 150px tall bro"
      //NB: all this happens super fast

//3. Now we quickly hide it again and animate it to visible
      gsap.fromTo(dropdown,
          {height:0, opacity:0}, //Start: invisible again
          {//End: visible with the height we measured
            height:height, 
            opacity:1,
            duration:0.3,
            ease: "power2.out"

          }
        )

              }

            },0)
     

		}
		
	}

	useEffect(()=> {
		const handleOutsideClick = (e) => {
			// This prevents the sidebar from auto-closing when the menu toggle button is clicked.
// We added `data-sidebar-toggle` to the button, so we can detect and ignore it here.
			const clickedToggle = e.target.closest('[data-sidebar-toggle]')
			if(sidebarRef.current && !sidebarRef.current.contains(e.target) && !clickedToggle){
				setIsOpen(false)
			}
		};

		if(isOpen){
			document.addEventListener('mousedown', handleOutsideClick);
		}

		return ()=> {
			document.removeEventListener('mousedown', handleOutsideClick)
		}

	},[isOpen, setIsOpen])

	

	return(
<>
<div className={`fixed inset-0 -z-10 bg-black/40 top-[63px] transition-opacity duration-300 ${
      isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
    } `} >
<div 
ref={sidebarRef}
className={`h-dvh  bg-[ghostwhite] absolute
 transition-all duration-300 linear -z-10  lg:hidden
           ${isOpen ? "left-0 w-3/4" : "-left-full w-3/4"}
 `}>
<div className="flex flex-col">

{products.length > 0 ?(
  <div> 
	{[...new Set(products.map((items)=> items.category))].map(category=> (
      <div key={category}>
        <button
        
        onClick={()=> handleToggle(category)}
        className="flex items-center justify-between w-full px-8  bg-slate-300/30 font-medium cursor-pointer
         text-left text-base py-3 mb-[1px] text-slate-800  headerfont"
  
        >
        {category} 
        {isDropDownId === category
         ?( <IoIosArrowDown className="text-2xl"/>) :
          (<IoIosArrowUp className="text-2xl"/> )
        }
        </button>
    {isDropDownId === category && (
      <div 
      ref={el => dropdownRef.current[category] = el}//this is like attaching each category to its subcategories for easy manupulation
      style={{ height: 0, overflow: 'hidden', opacity: 0 , background:"ghostwhite"}}
  >
    {[...new Set(
      products
        .filter(p => p.category === category)
        .map(p => p.subCategory)
    )].map(subCategory => (
      <div key={subCategory} className="px-10 py-3 mb-[1px]  font-medium text-black/60 text-sm hover:bg-slate-200 focus:bg-slate-300 headerfont ">
        <a href={`/${subCategory}`} > {subCategory} </a>
      </div>
    ))}
    <div className="px-10 py-3 mb-[1px] font-medium text-black/60 text-sm hover:bg-slate-200 focus:bg-slate-300 headerfont">
      <a href={`/category/${category}`}>All {category}</a>
    </div>
  
      </div>
  
      )}
    </div>
    ))
  }

  <p className="px-10 py-3 mb-[1px]  text-slate-900 text-sm hover:bg-slate-200 headerfont"><a href="/products/category/all"> Search </a> </p>
 
</div>


	):(
		<div className="p-4 text-center text-gray-500">
						No categories available
					</div>

)}
</div>
</div>
</div>







</>

		)

}
export default Mobile

