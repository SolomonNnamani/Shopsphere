import React, { useState, useEffect } from "react";
import ReusableInput from "../../reuseable/ReusableInput";
import { toast } from "react-toastify";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'

const ShippingSetting = ({ theme, setLoading }) => {
  const [formData, setFormData] = useState({
    supportedCountries: [],
    standardDeliveryTime: "",
    baseFee: "",
    perKgFee: "",
  });
  const [error, setError] = useState({
    supportedCountries: "",
    standardDeliveryTime: "",
    baseFee: "",
    perKgFee: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  //Fetch existing settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(
          "/api/dashboard/settings/shipping"
        );
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        toast.error("Failed to load shipping settings");
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []); //*/

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value.trim() }));
  };

  const validateForm = () => {
    const { supportedCountries, standardDeliveryTime, baseFee, perKgFee } =
      formData;
    const errors = {
      supportedCountries: "",
      standardDeliveryTime: "",
      baseFee: "",
      perKgFee: "",
    };
    let isValid = true;

    if (supportedCountries.length === 0) {
      errors.supportedCountries = "Field cannot be empty";
      isValid = false;
    }

    if (standardDeliveryTime === "") {
      errors.standardDeliveryTime = "Field cannot be empty";
      isValid = false;
    }

    if (!baseFee) {
      errors.baseFee = "Field cannot be empty";
      isValid = false;
    }

    if (!perKgFee) {
      errors.perKgFee = "Field cannot be empty";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  const handleSave = async (e) => {
    e.preventDefault()
     const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{
    if (!validateForm()) return;
    const { supportedCountries, standardDeliveryTime, baseFee, perKgFee } =
      formData;
    setLoading(true);

    try {
      const res = await fetchWithAuth(
        "/api/dashboard/settings/shipping",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supportedCountries,
            standardDeliveryTime,

            baseFee: Number(baseFee),
            perKgFee: Number(perKgFee),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Failed to save settings");
      } else {
        toast.success("Shipping settings updated");
        setIsEditing(false);
      }
    } catch (err) {
      
      toast.error("Network error: Please check your network");
    } finally {
      setLoading(false);
    }
  }
  };

  const handleToggle = () => {
    setIsEditing(true);
  };

  return (
    <div
      className={` py-5 border-b w-full ${
        theme ? "border-[#3d4b55]" : "border-gray-300  "
      }`}
    >
      <small className="text-sm font-medium mb-2">📦 Shipping settings </small>

      {/*Supported Countries*/}
      <ReusableInput
        label="Supported Countries"
        type="text"
        name="supportedCountries"
        value={formData.supportedCountries.join(", ")}
        onChange={(e) =>
          setFormData({
            ...formData,
            supportedCountries: e.target.value.split(",").map((c) => c.trim()),
          })
        }
        disabled={!isEditing}
        error={error.supportedCountries}
        className="flex flex-col"
        classNameLabel={`font-medium ${theme ? "headerDark" : "headerLight"}`}
        classNameInput={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${theme ? " text-white " : " text-black"}
             ${!isEditing ? "cursor-not-allowed opacity-70" : "cursor-text"}  

            `}
        style={{
          background: isEditing
            ? theme
              ? "rgb(32, 42, 49)"
              : "rgba(128,128,128,0.3)"
            : theme
            ? "rgba(70, 70, 70, 0.5)"
            : "rgba(200, 200, 200, 0.3)",
        }}
      />

      {/*STD*/}
      <ReusableInput
        label="Standard Delivery Time"
        type="text"
        name="standardDeliveryTime"
        value={formData.standardDeliveryTime}
        onChange={handleChange}
        disabled={!isEditing}
        error={error.standardDeliveryTime}
        className="flex flex-col"
        classNameLabel={`font-medium ${theme ? "headerDark" : "headerLight"}`}
        classNameInput={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${theme ? " text-white " : " text-black"}
             ${!isEditing ? "cursor-not-allowed opacity-70" : "cursor-text"}  

            `}
        style={{
          background: isEditing
            ? theme
              ? "rgb(32, 42, 49)"
              : "rgba(128,128,128,0.3)"
            : theme
            ? "rgba(70, 70, 70, 0.5)"
            : "rgba(200, 200, 200, 0.3)",
        }}
      />

      {/*Base Fee*/}
      <ReusableInput
        label="Base Fee ($)"
        type="number"
        name="baseFee"
        value={formData.baseFee}
        onChange={handleChange}
        disabled={!isEditing}
        error={error.baseFee}
        className="flex flex-col"
        classNameLabel={`font-medium ${theme ? "headerDark" : "headerLight"}`}
        classNameInput={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${theme ? " text-white " : " text-black"}
             ${!isEditing ? "cursor-not-allowed opacity-70" : "cursor-text"}  

            `}
        style={{
          background: isEditing
            ? theme
              ? "rgb(32, 42, 49)"
              : "rgba(128,128,128,0.3)"
            : theme
            ? "rgba(70, 70, 70, 0.5)"
            : "rgba(200, 200, 200, 0.3)",
        }}
      />
      {/*perKg*/}
      <ReusableInput
        label="Fee per KG ($)"
        type="number"
        name="perKgFee"
        value={formData.perKgFee}
        onChange={handleChange}
        disabled={!isEditing}
        error={error.perKgFee}
        className="flex flex-col"
        classNameLabel={`font-medium ${theme ? "headerDark" : "headerLight"}`}
        classNameInput={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${theme ? " text-white " : " text-black"}
             ${!isEditing ? "cursor-not-allowed opacity-70" : "cursor-text"}  

            `}
        style={{
          background: isEditing
            ? theme
              ? "rgb(32, 42, 49)"
              : "rgba(128,128,128,0.3)"
            : theme
            ? "rgba(70, 70, 70, 0.5)"
            : "rgba(200, 200, 200, 0.3)",
        }}
      />

      <button
        className="text-sm w-20 bg-amber-700 hover:bg-amber-600 rounded-lg text-white  md:text-sm flex items-center justify-center p-2 font-bold 
         active:scale-95 transition-transform duration-100 "
        onClick={isEditing ? handleSave : handleToggle}
      >
        {isEditing ? "Save" : "Edit"}
      </button>
    </div>
  );
};

export default ShippingSetting;
