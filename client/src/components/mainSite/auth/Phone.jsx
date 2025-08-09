import {useState,useEffect} from 'react'
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import { toast } from "react-toastify";
import {useParams} from 'react-router-dom';
import {fetchGoogleAuth} from '../utils/fetchGoogleAuth.js'
import ImageTimer from '../../reuseable/ImageTimer'

const Phone = () => {
	const [phone, setPhone] = useState("")
	const [errors, setErrors] = useState("")
 const [submitting, setIsSubmitting] = useState(false);
 const {token} = useParams()
	const handleChange = (e)  => {
		setPhone(e)
	}

useEffect(()=> {
	if(!token){
		toast.error("Missing token. Please try again.");
		navigate("/sign-up")
	}
},[token])


const validation = () => {
	let isValid = true
	setErrors("")
	if (phone.trim() === "") {
      alert("Phone number is required")
      isValid = false;
    }
    return isValid

}

const handleSubmit = async(e) => {
	e.preventDefault()
	if(!validation()) return;

setIsSubmitting(true)
	try{
		const res = await fetchGoogleAuth("/auth/tel-phone", {
			method:"PUT",
			headers:{
				"Content-Type":"application/json"
			},
			body:JSON.stringify({phone})
		})
		const data = await res.json();

		if(!res){
			if(data.error){
				return toast.error(`${data.error}`)
			}
		}
		if(data.message){
			toast.success(`${data.message}`);
			localStorage.removeItem('onboardingToken')
			localStorage.setItem("sessionToken", data.token)

			setTimeout(()=> {
				window.location.href = "/";
			},2000)
		}

	}catch(error){
		console.log("Error updating number: ", error);
		toast.error("Something went wrong while saving your information, please try again!")
	}finally{
		setIsSubmitting(false)
	}


}











return(
<div  className=" h-screen overflow-hidden">
 <div className="flex flex-col md:flex-row   items-stretch">
            <ImageTimer/>


<div className="  bg-[rgba(248,248,255,0.5)] md:w-1/2 lg:w-4/12 h-screen overflow-y-auto">
 {/*icon */}
      <div  className=" pt-20 md:mb-7  ">
         <div className="flex justify-center" >
      <ShopsphereLogo className="  text-3xl font-medium headerLight" />
        </div>
	
	
{/**forgot password*/}
        <div className="p-4 mt-5 mx-10 md:mx-5 border border-gray-200 bg-[rgb(245,243,243)]  rounded-lg ">
          <h2 className="text-center font-bold mb-5 text-xl headerLight">Add your phone number</h2>
         
         
	<form onSubmit={handleSubmit} >
	 <PhoneInput
            country={"us"}
            value={phone || ""}
            onChange={handleChange}
           containerStyle={{
              width: "100%",
              
            }}
            inputStyle={{
              width: "100%",
             background:"ghostwhite",
            }}
          />

          {errors && (
            <p className="text-red-500 text-xs">{errors}</p>
          )}


<button
              type="submit"
              className="bg-amber-700 cursor-pointer 
          text-white w-full p-2 rounded text-center flex  items-center 
          justify-center h-10 hover:bg-amber-800 active:scale-95 transition-transform duration-100 "
            >
              {submitting ? <AnimatedLogo /> : "Create new account"}
            </button>

	</form>

</div>
</div>
</div>
</div>
</div>


	)

}
export default Phone

