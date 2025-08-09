import {useState, useEffect, useRef} from "react"
import {gsap} from 'gsap'


const images =  [
	"https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,h_1600,c_fill,g_auto,q_95,f_auto/v1753913250/img_1_ade93g.jpg",
	"https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,h_1600,c_fill,g_auto,q_95,f_auto/v1753913252/img_3_uhzhxo.jpg",
	"https://res.cloudinary.com/diwn1spcp/image/upload/w_1200,h_1600,c_fill,g_auto,q_95,f_auto/v1753913250/img_2_cbw9jt.jpg"]
const ImageTimer = () => {
	const [indexValue, setIndexValue] = useState(0)
	const imagesRef = useRef(null)
	

 /* useEffect(()=> {
    let i = 0;
    const id = setInterval(()=> {
     
      setIndexValue(i)//this is here because so it can start reading from 1, this will run in this order 1,2,1,2,1,2,1
     i = (i + 1) % images.length;// if we placed this before the console or state then 2 will run first in this order 2,1,2,1,2,1
    },2000)
  
return () => clearInterval(id)
  },[]) //*/

	// Preload all images once when component mounts to avoid loading delays during transitions
	useEffect(()=> {
		images.forEach(src => {
			const image = new Image()
			
			image.src = src
			

		})
	}, [])


// Change image every 5s by cycling indexValue (loops back to 0 when reaching end)

	useEffect(()=> {
		const id = setInterval(()=> {
			setIndexValue(prev => (prev + 1) % images.length)
		},5000);

		return ()=> clearInterval(id)

	},[])

// When indexValue updates (new image), fade in the image smoothly
	useEffect(()=> {
		gsap.fromTo(
			imagesRef.current,
			{opacity:0.4},
			{opacity:1,duration:1}
			);
	}, [indexValue])



  


	return (
 <div className="absolute -z-10 md:static md:w-1/2 lg:w-8/12 h-screen w-full">
 <div className="w-full h-screen overflow-hidden relative">
   <img 
   ref={imagesRef}
   src={images[indexValue]}
   alt="background"
 className=" object-cover w-full h-full "
 style={{
  objectPosition: "50% 20%"
 }}

   />
   </div>

    
  </div>
		)
}
export default ImageTimer