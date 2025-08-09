import React,{useState,useEffect} from "react";
import AnimatedLogo from "../reuseable/AnimatedLogo";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import {fetchWithAuth} from './utils/fetchWithAuth.js'

const MainDash = ({ children}) => {
   const [loading, setLoading] = useState(false);
   const [error,setError] = useState(null)
   const [themes] = useState({
    light: {
      background: "ghostwhite",
      color: "#666666",
    },
    dark: {
      background: "rgb(23, 29, 33)",
      color: "#B0B0B0",
    },
  });
  const [theme, setTheme] = useState(false);

  useEffect(() => {
  const fetchTheme = async () => {
   // const token = localStorage.getItem("authToken");
   // if (!token) return; // ⛔ Don't fetch if user is not logged in

    try {
      const res = await fetchWithAuth("/api/dashboard/settings/theme");
      if (!res) return;
      const data = await res.json();
      setTheme(typeof data.theme === "boolean" ? data.theme : false);
    } catch (err) {
      toast.error("Couldn't load theme, Please try again");
    }
  };

  fetchTheme();
}, []);



  return (
    <div className="relative "
     style={{
        background: `${
          theme ? themes.dark.background : themes.light.background
        }`,
        color: `${theme ? themes.dark.color : themes.light.color}`,
        transition: "background 0.3s, color 0.3s",
      }}
    >
          {loading && (
        <div className="fixed inset-0 flex items-center justify-center  w-full text-5xl bg-black/30 backdrop-blur-sm z-50">
          <AnimatedLogo className="text-orange-500" />
        </div>
      )}
          
            {error &&(
                <div className="bg-red-100 text-red-700 text-sm font-medium p-3 rounded shadow-md my-2 mx-4">{error}</div>
              ) }
          
      <Sidebar theme={theme} setTheme={setTheme} loading={loading} setLoading={setLoading} />

      <div className="">
  {React.Children.map(children, (child) =>
    React.isValidElement(child)
      ? React.cloneElement(child, {theme,setTheme, loading, setLoading, setError})
      : child
  )}
</div>   

 </div>
  );
};

export default MainDash;
