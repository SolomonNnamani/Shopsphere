import React from "react";
import { toast } from "react-toastify";
import { FaToggleOn } from "react-icons/fa6";
import { FaToggleOff } from "react-icons/fa6";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'

const MaintenanceSetting = ({ theme, maintenance, setMaintenance }) => {
  const handleUpdate = async (newValue) => {
    
     const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{

    try {
      await fetchWithAuth("/api/dashboard/settings/maintenance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ maintenance: newValue }),
      });
    } catch (err) {
      console.log("Error updating theme: ", err);
      // toast.error("Failed to update theme");
    }
  }
  };

  const handleToggle = async () => {
    const updatedValue = !maintenance;
    setMaintenance(updatedValue); //update UI immediately
    await handleUpdate(updatedValue); //then save it to the API
  };

  return (
    <div
      className={` py-5 border-b w-full ${
        theme ? "border-[#3d4b55]" : "border-gray-300  "
      }`}
    >
      <h2 className="text-sm font-medium mb-2">🛠️ Maintenance Mode</h2>
      <p className="text-sm text-gray-600 mb-4">
        Toggle this to temporarily disable the website for maintenance. When
        enabled, all users will see a “We’ll be back soon” message.
      </p>

      <div className="flex items-center gap-3">
        <span className="text-md font-medium">
          {maintenance ? "Enabled" : "Disabled"}
        </span>
        <button
          onClick={handleToggle}
          className="text-3xl text-orange-500 hover:text-orange-600 transition"
          aria-label="Toggle maintenance mode"
        >
          {maintenance ? <FaToggleOn /> : <FaToggleOff />}
        </button>
      </div>
    </div>
  );
};

export default MaintenanceSetting;
