import React, {useState} from 'react'
import ReusableInput from "../../reuseable/ReusableInput";
import PasswordInput from "../../reuseable/showPassword";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ShopsphereLogo from '../../reuseable/ShopsphereLogo.jsx'
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import {fetchExternal} from '../utils/fetchExternal.js';



const DashboardLogin = ({theme}) => {
	const [form, setForm] = useState({
		email:"",
		password:"",

	})
	 const [error, setError] = useState({
    email: "",
    password: "",
  });
   const [loading, setLoading] = useState(false);
	 const navigate = useNavigate();

	 const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

    const validateForm = () => {
    const { email, password } = form;
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

//----Admin---------
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;
  
    const { ...dataToSend } = form;
     setLoading(true);
    try {
      const res = await fetchExternal("/api/dashboard/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.error) {
          toast.error(`${data.error}`);
        }
      }
      if (data.token) {
        localStorage.setItem("authToken", data.token);
        localStorage.setItem('name', data.user.name)
        localStorage.setItem("role", data.user.role)
        localStorage.setItem("email", data.user.email)
        localStorage.setItem("date", data.user.createdAt)

        toast.success(data.message || 'Login sucessful');
        //navigate to dashboard
        setTimeout(() => {
          navigate("/dashboard", {
    state: {
      name: data.user.name,
      role: data.user.role,
      email: data.user.email,
      date: data.user.createdAt,
    },
  });
        }, 2000);
      }
      setForm({
        email: "",
        password: "",
      });
    } catch (error) {
      console.log("Error connecting to server:", error.message);
      toast.error("Cannot login, Please try again");
    } finally {
      setLoading(false);
    }
  };


//Guest login
  const handleGuestLogin = async () => {
    setLoading(true);
  try {
    const res = await fetchExternal("/api/dashboard/auth/guest", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("authToken", data.token);
       localStorage.setItem('name', data.user.name)
      localStorage.setItem("role", data.user.role)
      localStorage.setItem("date", data.user.createdAt)
      localStorage.setItem("email", "no registered email")

      toast.success("Logged in as Viewer");
        setTimeout(() => {
          navigate("/dashboard", {
  state: {
    name: data.user.name,
    role: data.user.role,
    email: "no registered email",
    date: data.user.createdAt,
  },
  });
        }, 2000);
    }
  } catch (error) {
    console.log("Guest login error", error.message);
    toast.error("Error logging in as guest");
  } finally {
setLoading(false);
  }
  }



return(
<div className=" bg-red-500 top-0 w-full min-h-screen px-10"
style={{
        background: `${theme ? "rgb(23, 29, 33)" : "ghostwhite"} `,
      }}
>
  {loading && (
        <div className="fixed inset-0 flex items-center justify-center  w-full text-5xl bg-black/30 backdrop-blur-sm z-50">
          <AnimatedLogo className="text-orange-500" />
        </div>
      )}
<div className="flex justify-center pt-30 pb-10">
<ShopsphereLogo className={`text-3xl md:text-3xl ${
              theme ? "headerDark" : "headerLight"
            }`}/>

</div>


<div className={`flex flex-col   px-3 py-2 rounded-lg md:w-1/2 md:m-auto border ${
            theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
          } `}
          style={{
            background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
          }}>
<h2 className="text-center font-bold text-xl pt-5">Login to your Dashboard</h2>

<div className="flex justify-center text-center gap-5 w-full">
<p className=" px-4 py-3 rounded-lg text-sm font-medium text-orange-500 bg-transparent
             duration-100 mt-5 w-35 border border-orange-400 hover:bg-orange-500 hover:text-white "> Admin </p>
<button 
onClick={handleGuestLogin}
className=" px-4 py-3 rounded-lg text-sm font-medium text-white bg-orange-400
            hover:bg-orange-500 active:scale-95 transition-transform
             duration-100 mt-5  w-35 "
>Viewer(Guest)</button>
</div>

<form onSubmit={handleSubmit} className="py-5">
{/*email*/}
<ReusableInput
      label="Email address"
      type="email"
      name="email"
      id="email"
      placeholder="solomonshelby@example.com"
      value={form.email}
       onChange={handleChange}
      className="flex flex-col"
      classNameLabel={`text-sm font-medium ${theme ? "text-gray-300" : "text-gray-700"}`}
      classNameInput={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-orange-400  border 
            ${theme ? " text-white " : " text-black border-gray-300   "}
         
       `}
        style={{
              background: theme ? "rgb(23, 29, 33)" : "ghostwhite",
              borderColor: theme ? "#2d3a43" : undefined, // subtle dim border in dark mode
            }}
            error={error.email}
    />
{/**password */}
            <PasswordInput
              label="Password"
              name="password"
              value={form.password}
             onChange={handleChange}
              error={error.password}
              className={`p-2  rounded-lg flex flex-col w-full border outline-none
            ${theme ? " text-white " : " text-black border-gray-300 " }
       `}
        style={{
              background: theme ? "rgb(23, 29, 33)" : "ghostwhite",
                borderColor: theme ? "#2d3a43" : undefined,
            }}
            />

<button 
type="submit"
className=" px-4 py-3 rounded-lg text-sm font-medium text-white bg-orange-400
            hover:bg-orange-500 active:scale-95 transition-transform
             duration-100 mt-5  w-full "
> Login as admin </button>

</form>




</div>

</div>


	)
}
export default DashboardLogin