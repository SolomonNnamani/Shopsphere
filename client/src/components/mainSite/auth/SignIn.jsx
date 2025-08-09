import React, { useState,useEffect } from "react";
import PasswordInput from "../../reuseable/showPassword";
import { useNavigate,useLocation } from "react-router-dom";
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import { FaGoogle } from "react-icons/fa";
import ImageTimer from '../../reuseable/ImageTimer'
import { toast } from "react-toastify";


const SignIn = () => {
  const [formInput, setFormInput] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState({
    email: "",
    password: "",
  });
  const [submitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
 
{/*google*/}
  useEffect(()=> {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");
  const redirectTo = params.get('redirect')

    if(token){
      localStorage.setItem('sessionToken',token);
      toast.success('Sigining in...')
      setTimeout(() => {
        if (redirectTo) {

          navigate(`/${redirectTo}`);
        } else {
          navigate("/");
        }
      }, 1500);
     
    }

    if(error){
      toast.error(decodeURIComponent(error))
    }

  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { email, password } = formInput;
    const error = {
      email: "",
      password: "",
    };
    let isValid = true;

    if (email.trim() === "") {
      error.email = "Email is required";
      isValid = false;
    }

    if (password === "") {
      error.password = "Password is required";
      isValid = false;
    }

    setError(error);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

   
    
    const isValid = validateForm();
    if (!isValid) return;
    setIsSubmitting(true);

     

    const { ...dataToSend } = formInput;
     const params = new URLSearchParams(location.search);
    const redirectTo = params.get('redirect')
    try {
      const res = await fetch("http://localhost:5000/auth/sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      console.log("LOGIN RESPONSE:", data);

      if (!res.ok) {
        if (data.error) {
          toast.error(`${data.error}`);
        }
      }
      //if user already exist
      if (data.exist) {
        return toast.error(
          `${data.exist}\n\nPlease use "Login with Google" instead.`
        );
      }

      if (data.sessionToken) {
        localStorage.setItem("sessionToken", data.sessionToken);
        toast.success(`${data.message}`);
     
     
    }
      setFormInput({
        email: "",
        password: "",
      });

      // ✅ Navigate after login success  
 setTimeout(() => {
        if (redirectTo) {

          navigate(`/${redirectTo}`);
        } else {
          navigate("/");
        }
      }, 1500);

    } catch (error) {
      console.log("Error connecting to server:", error.message);
      toast.error("Cannot login, Pleae try again");
    } finally {
      setIsSubmitting(false);
    }
  
  };
  return (
    <div className="  h-screen overflow-hidden">


 <div className="flex flex-col md:flex-row   items-stretch">

            <ImageTimer/>





      <div className="bg-[rgba(248,248,255,0.5)] md:w-1/2 lg:w-4/12 h-screen overflow-y-auto">

      {/* icon*/ }
        <div className=" pt-20 md:mb-7 ">
          <div className="flex justify-center" >
      <ShopsphereLogo className="  text-3xl font-medium headerLight" />
        </div>
        </div>
{/*Login*/}
        <div className="p-3 mt-5 mx-10 md:mx-5 border border-gray-200 bg-[rgb(245,243,243)]  rounded-lg">
          <h2 className="text-center font-bold text-xl headerLight">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit} className="mt-2 relative">
            <label
             htmlFor="email"
             className="headerLight"
             >Email address</label>
            <br />
            <input
              type="email"
              //id="email"
              name="email"
              value={formInput.email}
              placeholder="solomonshelby@example.com"
              onChange={handleChange}
              className="logInput bg-[ghostwhite] placeholder:italic"
            />
            {error.email && (
              <span className="forErrors text-red-500  p-0">{error.email} </span>
            )}
            <br />
            {/**password */}
            <PasswordInput
              label="Password"
              name="password"
              value={formInput.password}
              onChange={handleChange}
              error={error.password}
              className="logInput"
            />

            {/*forgot password*/}
            <p className="absolute text-sm text-amber-600 right-0 top-25">
              <a href="/forgot-password">Forgot password?</a>
            </p>
            <br />
            {/*submit*/}
            <button
              type="submit"
              className="bg-amber-700 cursor-pointer 
          text-white w-full p-3 rounded text-center flex 
           items-center justify-center h-14 hover:bg-amber-800 active:scale-95 transition-transform duration-100"
            >
              {submitting ? <AnimatedLogo /> : "Sign in"}
            </button>
          </form>

          {/*OR*/}
          <div className="mt-7 flex items-center gap-2">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="text-sm text-gray-500">OR</span>
            <hr className="flex-grow border-t border-gray-300" />
          </div>

          {/*Google */}
          <button
            className=" cursor-pointer border border-amber-700 bg-[ghostwhite] mb-5 w-full p-3 rounded
          font-bold flex items-center justify-center mt-5 hover:bg-amber-600 headerLight active:scale-95 transition-transform duration-100 "
            onClick={() =>
              (window.location.href =
                "http://localhost:5000/auth/google?origin=sign-in")
            }
          >
           <span className="text-blue-500 mr-1">
             <img 
             src={"https://img.icons8.com/?size=100&id=V5cGWnc9R4xj&format=png&color=000000"}
              alt="google"
              className="w-7"
              />
            </span>
            Login with Google
          </button>
        </div>

        {/*Sign in*/}
        <div className="text-center mt-5 font-medium">
          <p>
            Don't have account yet?{" "}
            <a href="sign-up" className="text-amber-700">
              Sign up
            </a>
          </p>{" "}
        </div>
      </div>
      </div>
    </div>
  );
};

export default SignIn;
