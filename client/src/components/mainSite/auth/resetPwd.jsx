import React, { useState } from "react";
import PasswordInput from "../../reuseable/showPassword";
import { useParams } from "react-router-dom";
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import { IoSettingsOutline } from "react-icons/io5";
import ImageTimer from '../../reuseable/ImageTimer'

const resetPwd = () => {
  const [passwordField, setPasswordField] = useState({
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
  });
  const [submitting, setIsSubmitting] = useState(false);
  const { token } = useParams();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordField((prev) => ({
      ...prev,
      [name]: value,
    }));
   
  };

  const validateForm = () => {
    const { password, confirmPassword } = passwordField;
    let errors = {
      password: "",
      confirmPassword: "",
    };

    let isValid = true;

    if (password === "") {
      errors.password = "Password is required";
      isValid = false;
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d@$!%*?&.,#^+=_-]{8,}$/.test(
        password
      )
    ) {
      errors.password =
        "Password must be at least 8 characters and contain uppercase, number and special character";
      isValid = false;
    }

    if (confirmPassword === "") {
      errors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    setIsSubmitting(true);

    try {
      const res = await fetch("http://localhost:5000/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: passwordField.password, token }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error) {
          return alert(`${data.error}`);
        }
      }
      if (data.message) {
        alert(`${data.message}`);
        setTimeout(() => {
          window.location.href = "/sign-in";
        }, 2000);
      }
    } catch (error) {
      console.log("Error reseting password: ", error);
      alert(
        "Something went wrong while resetting your password. Please try again shortly."
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className=" h-screen overflow-hidden">
     <div className="flex flex-col md:flex-row   items-stretch">
            <ImageTimer/>

<div className="  bg-[rgba(248,248,255,0.5)] md:w-1/2 lg:w-4/12 h-screen overflow-y-auto ">
      {/*icon */}
      
       <div  className=" pt-20 md:mb-7  ">
         <div className="flex justify-center" >
      <ShopsphereLogo className="  text-3xl font-medium headerLight" />
        </div>

{/**reset password*/}
        <div className="p-4 mt-5 mx-10 md:mx-5 border border-gray-200 bg-[rgb(245,243,243)] rounded-lg">
          <h2 className="text-center font-bold mb-5 text-xl headerLight">Reset password</h2>
          <p className="text-xs">
            Please enter a new password below, make sure it's something secure
            and easy for you to remember.{" "}
          </p>

          <form onSubmit={handleSubmit}>
            {/**password */}
            <PasswordInput
              label="Password"
              name="password"
              value={passwordField.password}
              onChange={handleChange}
              error={error.password}
              className="regInput"
            />
       

            {/**confirm Password */}
            <PasswordInput
              label="Confirm Password"
              name="confirmPassword"
              value={passwordField.confirmPassword}
              onChange={handleChange}
              error={error.confirmPassword}
              className="regInput"
            />
            <br />
            <button
              type="submit"
              className="bg-amber-700 cursor-pointer 
          text-white w-full p-2 rounded text-center flex  items-center 
          justify-center h-10 hover:bg-amber-800 active:scale-95 transition-transform duration-100"
            >
              {submitting ? (
                <AnimatedLogo/>
              ) : (
                <span className="flex items-center">
                  <IoSettingsOutline className="mr-1 " /> Reset password
                </span>
              )}
            </button>
          </form>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
};

export default resetPwd;
