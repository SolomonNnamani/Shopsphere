import {useState, useEffect,useRef} from 'react'
import {gsap} from 'gsap'
import FeaturedProducts from './FeaturedProducts'
import GridLink from './GridLink'
import {useNavigate} from 'react-router-dom'



const images = [
	"https://res.cloudinary.com/diwn1spcp/image/upload/w_1920,h_1080,c_fill,g_auto,q_auto,f_auto,dpr_auto/v1753899749/img1_iir8p0.jpg",
	"https://res.cloudinary.com/diwn1spcp/image/upload/w_1920,h_1080,c_fill,g_auto,q_auto,f_auto,dpr_auto/v1753899743/img4_ytzv3b.jpg", 
	"https://res.cloudinary.com/diwn1spcp/image/upload/w_1920,h_1080,c_fill,g_auto,q_auto,f_auto,dpr_auto/v1753899706/img2_x7gco9.jpg", 
	"https://res.cloudinary.com/diwn1spcp/image/upload/w_1920,h_1080,c_fill,g_auto,q_auto,f_auto,dpr_auto/v1753899703/img3_x3kqsi.jpg"]
const Hero = ({setLoading,setError}) => {
	const [index, setIndex] = useState(()=> Math.floor(Math.random() * images.length))
	const imagesRef = useRef(null)
	 const navigate = useNavigate();

	

	useEffect(() => {
  // 🔄 Start by setting a loading state to true
  // This tells your app that we’re currently doing some work (in this case, preloading images)
  setLoading(true);

  // 🖼️ We use Promise.all to run multiple image preloading tasks at the same time
  // Each image is loaded into memory using the browser's Image() constructor
  Promise.all(
    images.map((src) => {
      // 🔄 For each image URL in the array, return a Promise
      return new Promise((resolve) => {
        const img = new Image();     // Create a new image element in memory (not on the DOM)
        img.src = src;               // Set the image source so the browser starts loading it

        img.onload = resolve;        // ✅ If the image loads successfully, resolve the promise
        img.onerror = resolve;      // ❌ If it fails (e.g. broken link), still resolve
        // Note: We resolve on both success and error to avoid the entire thing hanging forever
      });
    })
  ).then(() => {
    // ✅ When all images finish loading (or error out), stop the loading indicator
    setLoading(false);
  });

// 📦 This useEffect runs **only once** on component mount (because of the empty dependency array [])
}, []);


	//change image every 7s randomly through index
	useEffect(()=> {
		
		const next = setInterval(()=> {
			setIndex(prev => {
				let random = Math.floor(Math.random() * images.length)
				//keep rolling if same
				if(random === prev){
					random = ( random + 1)% images.length
				}
				return random;
			})
		},7000)
		return ()=> clearInterval(next)//*/
	},[images.length])

	//makes the changes more smoother throught animated fadein

	useEffect(()=> {
		gsap.fromTo(imagesRef.current,
			{opacity:0.5},
			{ opacity: 1, duration: 1, ease: "power2.out", delay: 0.2 }


			)

	},[index])

const handleHeroClick = () => {
    window.location.href = "/products/category/all";; 
  };


	return(
  <div className="min-h-screen "
  
  >
      {/* Hero Section */}
      <div className="relative overflow-hidden h-[70vh] md:h-screen cursor-pointer"
        onClick={handleHeroClick}
      >
        <img
          ref={imagesRef}
          src={images[index]}
          alt="background Image"
          className="w-full h-full object-cover absolute -z-10"
        />
<div className="absolute top-0  h-full w-full hover:bg-black/10 z-10 "/>

        <div className="text-white h-full flex flex-col items-center justify-center px-4 text-center max-w-4xl mx-auto">
      
          <h1 className="font-bold text-xl md:text-4xl lg:text-6xl text-center px-4">
            “Tailored for the Modern Gentleman.”
          </h1>
          <p className="text-sm md:text-base lg:text-lg font-medium text-center px-4">
            Suits. Shoes. Style. Built for presence.
          </p>
         <p className="mt-6 inline-block text-sm md:text-base lg:text-lg font-medium tracking-wide bg-amber-700 hover:bg-amber-800 transition-colors duration-300 text-white px-6 py-3 rounded-full shadow-sm">
  Shop the Collection
</p>

        </div>
      </div>

      {/* The rest should flow normally */}
      <div className="">
        <FeaturedProducts setLoading={setLoading} setError={setError} />
        <GridLink setLoading={setLoading} />
      </div>
    </div>





		)
}
export default Hero