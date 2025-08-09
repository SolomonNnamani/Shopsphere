import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";
import { toast } from "react-toastify";
import ReusableInput from "../reuseable/ReusableInput";
import {useNavigate} from 'react-router-dom'
import {fetchWithAuth} from './utils/fetchWithAuth.js'
import {useLocation} from 'react-router-dom'

const MAX_IMAGE_SIZE_MB = 2;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

const Profile = ({theme,setLoading}) => {
  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);
  const [hasChanged, setHasChanged] = useState(false);
  const [info, setInfo] = useState({
    name: "",
    role: "",
    email: "",
    createdAt: "",
  });
  const [toggle, setToggle] = useState(false)
  const dropDownRef = useRef(null)
  const fileInputRef = useRef(null);
  let navigate = useNavigate()
  const location = useLocation();// 1. get route info

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Only PNG, JPEG, or WEBP images are allowed.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
      toast.error(`Image must be smaller than ${MAX_IMAGE_SIZE_MB}MB`);
      return;
    }

    setProfilePic(file);

    const imageUrl = URL.createObjectURL(file);
    setPreview(imageUrl);
    setHasChanged(true);
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleSave = async (e) => {

     const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{

    e.preventDefault();
    if (!profilePic) return;

 setLoading(true)
    try {
      const imageInfo = new FormData();
      imageInfo.append("file", profilePic);
      imageInfo.append("upload_preset", "shopSphere_upload");

      const imageResponse = await fetch(
        "https://api.cloudinary.com/v1_1/diwn1spcp/image/upload",
        {
          method: "POST",
          body: imageInfo,
        }
      );

      const imageData = await imageResponse.json();
      const imageUrl = imageData.secure_url;

     
      const res = await fetchWithAuth("/api/dashboard/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profilePicture: imageUrl }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(
          data.error || "Failed to update profile picture, Please try again."
        );
      } else {
        toast.success(data.message || "Profile picture updated successfully");
        setProfilePic(null);
        setHasChanged(false);
        setPreview(null);
      }
    } catch (error) {
      toast.error("Network error: Please check yout network connection");
    }finally{
      setLoading(false)
    }
  }
  };

  const handleToggle = () => {
    setToggle((prev) => !prev)
  }

  const handleLogOut = () => {
 localStorage.removeItem('authToken');
  localStorage.removeItem('name');
  localStorage.removeItem('role');
  localStorage.removeItem('email');
  localStorage.removeItem('date');

    

  toast.success("Logging out");

  setTimeout(() => {
    navigate("/dashboard/dashboard-login");
  }, 2000);
 
}

  useEffect(()=> {

      const handleInfo = () => {
   //  const role = localStorage.getItem("role");
        const user = location.state; //  2. get any data passed during login

    if(user){
      const isAdmin = user.role === "admin";
       // 3. If data was passed via navigation
      setInfo({
        name:user.name,
        role:user.role,
        email: isAdmin ? user.email : "no registered email",
        createdAt:user.date.slice(0,10) || "",
      })

    }else{
      // 4. Fallback if no data passed (use localStorage)
    const role = localStorage.getItem("role");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const date = localStorage.getItem("date");

    const isAdmin = role === "admin";

    setInfo({
      name,
      role,
      email: isAdmin ? email : "no registered email",
      createdAt: date?.slice(0, 10) || "",
    });
    }

      }
      handleInfo()

     const fetchPicture = async()=> {
      const token = localStorage.getItem("authToken");
    if (!token) return; // ⛔ Don't fetch if user is not logged in
 
      setLoading(true)
      try{
        const res = await fetchWithAuth('/api/dashboard/profile')
        const data = await res.json()
        setProfilePic(data.profilePicture)

      }catch(error){
        toast.error(`Couldn't load profile picture, please check your network!`)
      }finally{
        setLoading(false)
      }

    }
    fetchPicture()

    const handleClickOutside = (e) => {
      if(dropDownRef.current && !dropDownRef.current.contains(e.target)){
        setToggle(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }

  }, [location.state])






  return (
    <div
     className="relative"
     ref={dropDownRef}
     >
     <div
     className="cursor-pointer "
     onClick={handleToggle}
     >
      {preview || typeof profilePic === "string" ? (
        <img
          src={preview || profilePic.replace(
    "/upload/",
    "/upload/w_1200,q_85,f_auto,dpr_auto/"
  )}
          alt="Preview"
          className="w-9 h-9 rounded-full object-cover borde "
        />
      ) : (
        <FaUserCircle className="text-4xl text-slate-300" />
      )}
      </div>

      {/**Hover menu */}
 <div
  className={`absolute z-20 right-0 top-[49px] md:top-[115px] w-96 ${
    toggle ? "block" : "hidden"
  } rounded-2xl p-6 transition-all duration-200 ${
    theme ? "border border-[#3d4b55] bg-[rgb(23,29,33)]" : "bg-white border border-gray-200 shadow-md"
  }`}
>
  {/* Top Section: Avatar + Name + Role */}
  <div className="flex items-center gap-4 mb-6">
    {preview || typeof profilePic === "string" ? (
      <img
        src={preview || profilePic.replace(
    "/upload/",
    "/upload/w_1200,q_85,f_auto,dpr_auto/"
  )}
        alt="Preview"
        className="w-20 h-20 rounded-full object-cover"
      />
    ) : (
      <FaUserCircle className="w-20 h-20 text-slate-300" />
    )}
    <div className="space-y-1">
      <h2 className={`text-xl font-bold ${theme ? "text-white" : "text-gray-900"}`}>
        {info.name}
      </h2>
      <p className={`text-sm ${theme ? "text-gray-400" : "text-gray-600"}`}>
        {info.role}
      </p>
    </div>
  </div>

  {/* Buttons */}
  <div className="flex flex-col gap-2 mb-6">
    <button
      onClick={handleClick}
      className="bg-amber-800 text-white font-bold py-2 rounded-lg md:text-sm 
        flex items-center justify-center 
        active:scale-95 transition-transform duration-100 
        hover:bg-amber-700 focus:bg-amber-600"
    >
      Upload new picture
    </button>

    {hasChanged && (
      <button
        onClick={handleSave}
        className="text-amber-700 border border-orange-500 rounded-lg font-bold py-2 md:text-sm 
          flex items-center justify-center 
          active:scale-95 transition-transform duration-100 
          hover:bg-orange-100 focus:bg-orange-100"
      >
        Save Changes
      </button>
    )}
  </div>

  <input
    type="file"
    name="profilePic"
    accept="image/png, image/jpeg, image/webp"
    onChange={handleFileChange}
    ref={fileInputRef}
    className="hidden"
  />

  {/* User Info Fields */}
  <div className="space-y-4 mb-6">
    <ReusableInput
      label="Email"
      type="email"
      name="email"
      value={info.email}
      readOnly={true}
      className="flex flex-col"
      classNameLabel={`text-sm font-medium ${theme ? "text-gray-300" : "text-gray-700"}`}
      classNameInput={`p-2 rounded-lg bg-opacity-20 
        focus:outline-none focus:ring-2 focus:ring-blue-400 
        cursor-not-allowed opacity-70 
        ${theme ? "bg-gray-600 text-white" : "bg-gray-200 text-black"}`}
    />

    <ReusableInput
      label="Role"
      type="text"
      name="role"
      value={info.role}
      readOnly={true}
      className="flex flex-col"
      classNameLabel={`text-sm font-medium ${theme ? "text-gray-300" : "text-gray-700"}`}
      classNameInput={`p-2 rounded-lg bg-opacity-20 
        focus:outline-none focus:ring-2 focus:ring-blue-400 
        cursor-not-allowed opacity-70 
        ${theme ? "bg-gray-600 text-white" : "bg-gray-200 text-black"}`}
    />

    <ReusableInput
      label="Account Created"
      type="text"
      name="accountCreated"
      value={info.createdAt}
      readOnly={true}
      className="flex flex-col"
      classNameLabel={`text-sm font-medium ${theme ? "text-gray-300" : "text-gray-700"}`}
      classNameInput={`p-2 rounded-lg bg-opacity-20 
        focus:outline-none focus:ring-2 focus:ring-blue-400 
        cursor-not-allowed opacity-70 
        ${theme ? "bg-gray-600 text-white" : "bg-gray-200 text-black"}`}
    />
  </div>

  {/* Logout Button */}
  <button
    className="w-full bg-amber-800 text-white font-bold py-2 rounded-lg md:text-sm 
      flex items-center justify-center 
      active:scale-95 transition-transform duration-100 
      hover:bg-amber-700 focus:bg-amber-600"
      onClick={handleLogOut}
  >
    Log Out
  </button>
</div>


    </div>
  );
};

export default Profile;
