import React, { useState } from "react";
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import { FaRegEnvelope } from "react-icons/fa";
import ImageTimer from '../../reuseable/ImageTimer'
import {fetchPublic} from '../utils/fetchPublic.js'




const ForgotPwd = () => {
  const [email, setEmail] = useState("");
  const [submitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setEmail(e.target.value);
  };

  const validateForm = () => {
    if (email.trim() === "") {
      setError("Enter a registered email address!");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);
    try {
      const res = await fetchPublic("/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error) {
          alert(`${data.error}`);
        }
      }
      if (data.message) {
        alert(`${data.message}`);
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 2000);
      }
      setEmail("");
    } catch (error) {
      console.log("Error sending link: ", error.message);
      alert("Server busy! please try again later");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className=" h-screen overflow-hidden">
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
          <h2 className="text-center font-bold mb-5 text-xl headerLight">Forgot password</h2>
          <p className="text-xs">
            Enter your registered email address and we’ll send you a link to
            reset your password.
          </p>

          <form onSubmit={handleSubmit}>
            <label 
            htmlFor="email"
             className="headerLight"
            >Email address</label>
            <br />
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              placeholder="solomonshelby01@example.com"
              onChange={handleChange}
              className="regInput  bg-[ghostwhite] placeholder:italic"
            />
            <br />
            {error && (
              <span className="forErrors text-red-500  p-0">{error} </span>
            )}
            <br />
            <button
              type="submit"
              className="bg-amber-700 cursor-pointer 
          text-white w-full p-2 rounded text-center flex  items-center 
          justify-center h-10 hover:bg-amber-800 active:scale-95 transition-transform duration-100"
            >
              {submitting ? (
                <AnimatedLogo />
              ) : (
                <span className="flex items-center">
                  <FaRegEnvelope className="mr-1 " />
                  Send Reset Link
                </span>
              )}
            </button>
          </form>
        </div>

        <div className="text-center text-sm mt-5 font-medium">
          Changed your mind?
          <a href="/sign-in" className="text-amber-700 ml-1">
            Return to the sign-in page
          </a>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default ForgotPwd;
