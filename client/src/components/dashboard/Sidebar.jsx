import React, { useState } from "react";
import ShopsphereLogo from "../reuseable/ShopsphereLogo";
import Profile from "./Profile";
import { SlMenu } from "react-icons/sl";
import { IoClose } from "react-icons/io5";
import { TbDeviceAnalytics } from "react-icons/tb";
import { HiMiniShoppingBag } from "react-icons/hi2";
import { FaOpencart } from "react-icons/fa";
import { IoMdPeople } from "react-icons/io";
import { FiSettings } from "react-icons/fi";

import { CiBrightnessUp } from "react-icons/ci";
import { IoMoonOutline } from "react-icons/io5";
import useThemeToggle from "./settings/usethemeToggle";
import NotificationBell from "./notifications/NotificationBell";

const Sidebar = ({ theme, setTheme,loading,setLoading }) => {
  const [toggle, setToggle] = useState(false);
  const { handleToggle, isToggling } = useThemeToggle(theme, setTheme);

  const handleClick = () => {
    setToggle((prev) => !prev);
  };

  const handlehidden = () => {
    if (toggle == true) {
      setToggle(false);
    }
  };

  return (
    <div>
      <div
        className={` fixed w-full z-30  py-3  border-b border-gray-300 shadow-sm   px-3 md:px-2 lg:px-30 `}
        style={{
          background: `${theme ? "rgb(32, 42, 49)" : "rgb(245, 243, 243)"} `,
        }}
      >
        <div className="flex justify-between items-center  ">
          <div className="flex">
          <div className="md:hidden flex justify-between items-center">
            <button onClick={handleClick} className={` w-12 text-2xl `}>
              {toggle ? <IoClose /> : <SlMenu />}
            </button>
          </div>

          <div
            className={` flex flex-col  fixed h-full w-52 
           transition-all duration-300 linear text-xl 
           ${toggle ? "  left-0 w-full" : "-left-full w-full"}
              ${theme ? "sidebarMenuDark" : "sidebarMenuLight"}
            md:left-0 md:flex-row md:absolute md:w-full  md:!top-[101%]
            md:border-b md:border-gray-300 md:shadow-sm  md:gap-6
            md:px-3 lg:px-27
             


             `}
          >
            <a
              href="/dashboard"
              onClick={handlehidden}
              className={`sidebarLink text-sm border-b md:border-0 ${theme ? " border-stone-100/50 ":" border-stone-300"} `}
            >
              <span
                className={`mr-5  text-amber-700 text-xl md:hidden ${
                  theme ? "lg:text-[#B0B0B0]" : "lg:text-[#666666]"
                }  lg:text-xl lg:mr-1 lg:block`}
              >
                <TbDeviceAnalytics />
              </span>
              Dashboard
            </a>
            <a
              href="/dashboard/products "
              onClick={handlehidden}
              className={`sidebarLink text-sm border-b md:border-0 ${theme ? " border-stone-100/50 ":" border-stone-300"} `}
            >
              <span
                className={`mr-5  text-amber-700 text-xl md:hidden ${
                  theme ? "lg:text-[#B0B0B0]" : "lg:text-[#666666]"
                }  lg:text-xl lg:mr-1 lg:block`}
              >
                <HiMiniShoppingBag />
              </span>
              Products
            </a>
            <a
              href="/dashboard/orders "
              onClick={handlehidden}
              className={`sidebarLink text-sm border-b md:border-0 ${theme ? " border-stone-100/50 ":" border-stone-300"} `}
            >
              <span
                className={`mr-5  text-amber-700 text-xl md:hidden ${
                  theme ? "lg:text-[#B0B0B0]" : "lg:text-[#666666]"
                }  lg:text-xl lg:mr-1 lg:block`}
              >
                <FaOpencart />
              </span>
              Orders
            </a>
            <a
              href="/dashboard/customers "
              onClick={handlehidden}
              className={`sidebarLink text-sm border-b md:border-0 ${theme ? " border-stone-100/50 ":" border-stone-300"} `}
            >
              <span
                className={`mr-5  text-amber-700 md:hidden ${
                  theme ? "lg:text-[#B0B0B0]" : "lg:text-[#666666]"
                }  lg:text-xl lg:mr-1 lg:block`}
              >
                <IoMdPeople />
              </span>
              Customers
            </a>
            <a
              href="/dashboard/settings "
              onClick={handlehidden}
              className={`sidebarLink text-sm border-b md:border-0 ${theme ? " border-stone-100/50 ":" border-stone-300"} `}
            >
              <span
                className={`mr-5  text-amber-700 text-xl md:hidden ${
                  theme ? "lg:text-[#B0B0B0]" : "lg:text-[#666666]"
                }  lg:text-xl lg:mr-1 lg:block`}
              >
                <FiSettings />
              </span>
              Settings
            </a>
          </div>

          <ShopsphereLogo
            className={` font-medium text-2xl md:text-4xl ${
              theme ? "text-white" : "text-gray-800"
            }`}
            links="/dashboard"
          />
        </div>

          <div className="flex items-center gap-3 md:gap-10">
            <button
              onClick={handleToggle}
              className={`text-xl md:text-2xl  rounded focus:outline-none focus:ring transition `}
            >
              {theme ? <CiBrightnessUp /> : <IoMoonOutline />}
            </button>
            <div className=" ">
              <NotificationBell loading={loading} setLoading={setLoading} />
            </div>

            <Profile theme={theme} setLoading={setLoading} />
          </div>
        </div>
      </div>
      <div className="h-[64px] md:h-[8pc]" />
    </div>
  );
};

export default Sidebar;
