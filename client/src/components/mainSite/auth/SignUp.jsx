import React, { useState, useEffect } from "react";
import PasswordInput from "../../reuseable/showPassword";
import { useNavigate } from "react-router-dom";
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import { toast } from "react-toastify";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import ImageTimer from '../../reuseable/ImageTimer'
import {fetchPublic} from '../utils/fetchPublic.js'


const baseUrl = import.meta.env.VITE_API_BASE_URL;

const Register = () => {
  const [formInput, setFormInput] = useState({
    firstName: "",
    lastName: "",
    phone:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    phone:"",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [submitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  //for google
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const type = params.get("type")
    const error = params.get("error");//*/
if (error) {
      alert(decodeURIComponent(error));
      return;
    }

    if (token && type === "onboarding") {
      localStorage.setItem("onboardingToken", token); //store the JWT
      navigate(`/tel-phone/${token}`)
    }else if(token && type === "session"){
       // navigate to dashboard
      localStorage.setItem("sessionToken", token);
      toast.success("Logging in...")
        setTimeout(()=> {
        navigate("/")
       },2000)
      // */
      console.log("Google Auth Token:", token);
    }
     
    

    
  }, []);

  const validateForm = () => {
    const { firstName, lastName, email,phone, password, confirmPassword } = formInput;
    const error = {
      firstName: "",
      lastName: "",
      email: "",
      phone:"",
      password: "",
      confirmPassword: "",
    };
    let isValid = true;
    if (firstName.trim() === "") {
      error.firstName = "First name is required";
      isValid = false;
    } else if (!/^[A-Za-z]{2,30}$/.test(firstName.trim())) {
      error.firstName = "First name must be 2-30 letters only";
      isValid = false;
    }

    if (lastName.trim() === "") {
      error.lastName = "Last Name is required";
      isValid = false;
    } else if (!/^[A-Za-z]{2,30}$/.test(lastName.trim())) {
      error.lastName = "Last name must be 2-30 letters only";
      isValid = false;
    }

    if (email.trim() === "") {
      error.email = "Email is required";
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())
    ) {
      error.email = "Please enter a valid email address";
      isValid = false;
    }

     if (!phone || phone.trim() === "") {
      error.phone = "Phone number is required";
      isValid = false;
    }

    if (password === "") {
      error.password = "Password is required";
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&.,#^+=_-]{8,}$/.test(
        password
      )
    ) {
      error.password =
        "Password must be at least 8 characters and contain uppercase, number and special character";
      isValid = false;
    }

    if (confirmPassword === "") {
      error.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      error.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(error);
    return isValid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let isValid = validateForm();
    if (!isValid) return;

    const { confirmPassword, ...dataToSend } = formInput;
    setIsSubmitting(true);

    try {
      const res = await fetchPublic("/auth/sign-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.exist) {
          alert(`${data.exist}`);
        } else if (data.error) {
          alert(`${data.error}`);
        } else {
          alert("Registration failed, please try again.");
        }
      }

      if (data.user) {
        toast.success(`${data.user}`);
        setTimeout(() => {
        navigate("/sign-in");
      }, 2000);
      }
      setFormInput({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone:"",
        confirmPassword: "",
      });
      
    } catch (error) {
      console.log("Error connecting to server: ", error.message);

      toast.error("Cannot register, Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };






  return (
    <div
      className="relative h-screen overflow-hidden
   ">

            <div className="flex flex-col md:flex-row   items-stretch">

            <ImageTimer/>

      <div className="  bg-[rgba(248,248,255,0.5)] md:w-1/2 lg:w-4/12 h-screen overflow-y-auto">
        {/*icon */}
        <div className=" pt-20 md:mb-7  ">
        <div className="flex justify-center" >
      <ShopsphereLogo className="  text-3xl font-medium headerLight" />
        </div>
          
          <hr className="hidden mt-7 text-gray-300 md:hidden" />
        </div>

        {/*Register*/}
        <div className="p-3 mt-5 mx-10 md:mx-5 border border-gray-200 bg-[rgb(245,243,243)]  rounded-lg">
          <h1 className=" text-xl text-center font-bold mb-3 headerLight  flex flex-col">
            Create new account{" "}
            <span className="font-medium text-xs text-gray-600">Choose how you'd like to sign up </span>
          </h1>
          
          {/*Google sign up*/}
          <button
            className=" cursor-pointer border border-amber-700 my-5 w-full p-3 rounded
          font-bold flex items-center justify-center bg-[ghostwhite] hover:bg-amber-600 headerLight
           active:scale-95 transition-transform duration-100 text-sm"
            onClick={() =>
              (window.location.href = `${baseUrl}/google?origin=sign-up`)
            }
          >
            <span className="text-blue-500 mr-1">
             <img 
             src={"https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"}
              alt="google"
              className="w-7"

              />
            </span>
            Sign up with Google
          </button>

          {/*OR*/}
          <div className="mt-7 flex items-center gap-2">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          <form onSubmit={handleSubmit} className=" mt-5">
            {/**firstName */}
            <label 
            htmlFor="firstName"
            className="headerLight text-sm"
            >First Name </label>
            
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formInput.firstName}
              placeholder="Solomon"
              onChange={handleChange}
              className="regInput bg-[ghostwhite] placeholder:italic "
            />
            
            {errors.firstName && (
              <span className="forErrors text-red-600">
                {" "}
                {errors.firstName}
              </span>
            )}
            <br />
            {/**lastName */}
            <label 
            htmlFor="lastName"
 className="headerLight text-sm"
            >Last Name </label>
            
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formInput.lastName}
              placeholder="Shelby"
              onChange={handleChange}
              className="regInput bg-[ghostwhite] placeholder:italic"
            />
          
            {errors.lastName && (
              <span className="forErrors text-red-600"> {errors.lastName}</span>
            )}
            <br />
            {/**Email */}
            <label 
            htmlFor="email"
             className="headerLight text-sm"
            >Email Address</label>
            <br />
            <input
              type="email"
              id="email"
              name="email"
              value={formInput.email}
              placeholder="solomonshebly@example.com"
              onChange={handleChange}
              className="regInput bg-[ghostwhite] placeholder:italic"
            />
        
            {errors.email && (
              <span className="forErrors text-red-600 "> {errors.email}</span>
            )}
            <br />
              {/**Phone*/}
          <label 
          htmlFor="phone"
           className="headerLight text-sm"
          >Phone</label>
          <PhoneInput
            country={"us"}
            value={formInput.phone || ""}
            onChange={(value) =>
              setFormInput((prev) => ({
                ...prev,
                phone: value,
              }))
            }
           containerStyle={{
              width: "100%",
              
            }}
            inputStyle={{
              width: "100%",
             // background:"",
             // color: theme ? "#fff" : "#000",
             // cursor: !isEditing ? "not-allowed" : "text",
            }}
          />

          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}


            {/**password */}
            <PasswordInput
              label="Password"
              name="password"
              value={formInput.password}
              onChange={handleChange}
              error={errors.password}
              className="regInput bg-[ghostwhite] placeholder:italic"
            />
          

            {/**confirm Password */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={formInput.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              className="regInput bg-[ghostwhite] placeholder:italic"
            />
        <br/>
            <button
              type="submit"
              className="bg-amber-700 cursor-pointer 
          text-white w-full p-3 rounded text-center flex 
           items-center justify-center h-14 active:scale-95 transition-transform duration-100 "
            >
              {submitting ? <AnimatedLogo /> : "Create new account"}
            </button>
          </form>
        </div>
        <p className="text-center text-grey-600 my-3 font-medium">
          Already have account?{" "}
          <a href="/sign-In" className="text-amber-700 ">
            Sign In
          </a>
        </p>
      </div>
</div>
    </div>
  );
};

export default Register;
