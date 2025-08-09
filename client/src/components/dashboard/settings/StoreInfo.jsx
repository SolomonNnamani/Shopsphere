import React, { useState, useEffect } from "react";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import { toast } from "react-toastify";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'

const StoreInfo = ({ theme, setLoading }) => {
  const [storeInfo, setStoreInfo] = useState({
    storeName: "",
    lightLogo: null,
    darkLogo: null,
    description: "",
    supportEmail: "",
    phone: "",
    storeAddress: "",
    edit: false,
    lastUpdated: "",
  });
  const [errors, setErrors] = useState({
    storeName: "",
    lightLogo: "",
    darkLogo: "",
    description: "",
    supportEmail: "",
    phone: "",
    storeAddress: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [preview, setPreview] = useState({
    lightLogo: null,
    darkLogo: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;
    setStoreInfo((prev) => ({
      ...prev,
      [name]: file,
    }));

    if (name === "lightLogo") {
      const lightImageUrl = URL.createObjectURL(file);
      setPreview((prev) => ({
        ...prev,
        lightLogo: lightImageUrl,
      }));
    }

    if (name === "darkLogo") {
      const darkImageUrl = URL.createObjectURL(file);
      setPreview((prev) => ({
        ...prev,
        darkLogo: darkImageUrl,
      }));
    }
  };
  useEffect(() => {
    return () => {
      if (preview.lightLogo) URL.revokeObjectURL(preview.lightLogo);
      if (preview.darkLogo) URL.revokeObjectURL(preview.darkLogo);
    };
  }, [preview]);

  const validateForm = () => {
    const {
      storeName,
      lightLogo,
      darkLogo,
      supportEmail,
      phone,
      description,
      storeAddress,
    } = storeInfo;
    const error = {
      storeName: "",
      lightLogo: "",
      darkLogo: "",
      supportEmail: "",
      phone: "",
      description: "",
      storeAddress: "",
    };
    let isValid = true;

    //Store Name
    if (storeName.trim() === "") {
      error.storeName = "Store name is required";
      isValid = false;
    }

    //image
    if (!lightLogo) {
      error.lightLogo = "Logo image is required";
      isValid = false;
    }
    if (!darkLogo) {
      error.darkLogo = "Logo image is required";
      isValid = false;
    }

    //email
    if (supportEmail.trim() === "") {
      error.supportEmail = "Enter a valid email address";
      isValid = false;
    }

    //phone
    if (!phone || phone.trim() === "") {
      error.phone = "Phone number is required";
      isValid = false;
    }

    if (description.trim() === "") {
      error.description = "Description is required";
      isValid = false;
    }

    if (storeAddress.trim() === "") {
      error.storeAddress = "Store Address is required";
      isValid = false;
    }

    setErrors(error);
    return isValid;
  };

  const handleSave = async (e) => {
    e.preventDefault();
     const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{
    if (!validateForm()) return;

    setLoading(true);
    try {
      //lightLogo
      const lightImageInfo = new FormData();
      lightImageInfo.append("file", storeInfo.lightLogo);
      lightImageInfo.append("upload_preset", "shopSphere_upload");

      const lightImageResponse = await fetch(
        "https://api.cloudinary.com/v1_1/diwn1spcp/image/upload",
        {
          method: "POST",
          body: lightImageInfo,
        }
      );
      const lightImageData = await lightImageResponse.json();
      const lightImageUrl = lightImageData.secure_url;

      //darkLogo
      const darkImageInfo = new FormData();
      darkImageInfo.append("file", storeInfo.darkLogo);
      darkImageInfo.append("upload_preset", "shopSphere_upload");

      const darkImageResponse = await fetch(
        "https://api.cloudinary.com/v1_1/diwn1spcp/image/upload",
        {
          method: "POST",
          body: darkImageInfo,
        }
      );
      const darkImageData = await darkImageResponse.json();
      const darkImageUrl = darkImageData.secure_url;

      const updatedStoreInfo = {
        storeName: storeInfo.storeName,
        lightLogo: lightImageUrl,
        darkLogo: darkImageUrl,
        description: storeInfo.description,
        supportEmail: storeInfo.supportEmail,
        phone: storeInfo.phone,
        storeAddress: storeInfo.storeAddress,
        edit: true,
        lastUpdated: new Date().toISOString().slice(0, 10),
      };

      const response = await fetchWithAuth(
        "/api/dashboard/settings/storeInfo",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            storeName: updatedStoreInfo.storeName,
            lightLogo: updatedStoreInfo.lightLogo,
            darkLogo: updatedStoreInfo.darkLogo,
            description: updatedStoreInfo.description,
            supportEmail: updatedStoreInfo.supportEmail,
            phone: updatedStoreInfo.phone,
            storeAddress: updatedStoreInfo.storeAddress,
            edit: updatedStoreInfo.edit,
            lastUpdated: updatedStoreInfo.lastUpdated,
          }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(
          data.error || "Failed to update settings, Please try again."
        );
      } else {
        toast.success(data.message || "Store settings updated successfully");
        setStoreInfo(updatedStoreInfo);
        setIsEditing(false);
        setPreview({ lightLogo: null, darkLogo: null });
      }
    } catch (error) {
      console.log("update failed:", error);
      toast.error("Network error: could not update store settings.");
    } finally {
      setLoading(false);
    }
  }
  };

  const handleToggle = () => {
    if (isEditing) handleSave();
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchStoreInformation = async () => {
      setLoading(true);
      try {
        const res = await fetchWithAuth(
          "/api/dashboard/settings/storeInfo"
        );
        const data = await res.json();
        setStoreInfo(data);
      } catch (error) {
        toast.error("Couldn't load store information, Please try again later!");
      } finally {
        setLoading(false);
      }
    };
    fetchStoreInformation();
  }, []);

  return (
    <div
      className={`mt-5 py-5 border-y ${
        theme ? "border-[#3d4b55]" : "border-gray-300  "
      }`}
    >
      <div>
        <h2 className="text-sm font-medium mb-2">🏬 Store Information</h2>
        <form className="flex flex-col" onSubmit={handleSave}>
          {/**Store info */}
          <label
            htmlFor="storeName"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Store name
          </label>
          <input
            type="text"
            id="storeName"
            name="storeName"
            value={storeInfo.storeName}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`p-2  rounded-lg 
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
          <br />
          {errors.storeName && (
            <p className="text-red-500 text-xs">{errors.storeName}</p>
          )}

          <div className="flex gap-8 md:gap-30">
            {/**Logo */}
            <div>
              <label htmlFor="lightLogo">Light Logo Upload</label>
              <div className="relative w-full">
                <label
                  htmlFor="lightLogo"
                  className={`inline-block cursor-pointer w-40 text-center px-4 py-2 rounded-lg text-sm font-medium ${
                    theme ? "text-white" : ""
                  }
    border border-orange-400 bg-transperant hover:bg-orange-500 hover:text-white active:scale-95 transition-transform duration-100
     ${!isEditing ? "opacity-70 pointer-events-none " : "cursor-text"} `}
                >
                  Choose image
                </label>
                <input
                  type="file"
                  id="lightLogo"
                  name="lightLogo"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  disabled={!isEditing}
                  className="hidden"
                />
              </div>

              {errors.lightLogo && (
                <p className="text-red-500 text-xs">{errors.lightLogo}</p>
              )}
              {(preview.lightLogo ||
                typeof storeInfo.lightLogo === "string") && (
                <div className="">
                  <img
                    src={preview.lightLogo || storeInfo.lightLogo.replace(
    "/upload/",
    "/upload/w_1200,q_85,f_auto,dpr_auto/"
  )}
                    alt="Logo Preview"
                    className="w-32 h-32 object-contain border-none rounded mx-auto"
                  />
                </div>
              )}
            </div>

            <div>
              <label htmlFor="darkLogo">Dark Logo upload</label>
              <div className="relative w-full">
                <label
                  htmlFor="darkLogo"
                  className={`inline-block cursor-pointer w-40 text-center px-4 py-2 rounded-lg text-sm font-medium ${
                    theme ? "text-white" : ""
                  }
    border border-orange-400 bg-transperant hover:bg-orange-500 hover:text-white active:scale-95 transition-transform duration-100
     ${
       !isEditing
         ? "opacity-70 pointer-events-none cursor-not-allowed"
         : "cursor-text"
     } `}
                >
                  Choose image
                </label>
                <input
                  type="file"
                  id="darkLogo"
                  name="darkLogo"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  disabled={!isEditing}
                  className="hidden"
                />
              </div>
              {errors.darkLogo && (
                <p className="text-red-500 text-xs">{errors.darkLogo}</p>
              )}
              {(preview.darkLogo || typeof storeInfo.darkLogo === "string") && (
                <div className="">
                  <img
                    src={preview.darkLogo || storeInfo.darkLogo.replace(
    "/upload/",
    "/upload/w_1200,q_85,f_auto,dpr_auto/"
  )}
                    alt="Logo Preview"
                    className="w-32 h-32 object-contain border-none rounded mx-auto "
                  />
                </div>
              )}
            </div>
          </div>

          {/**Description */}
          <label
            htmlFor="description"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={storeInfo.description}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none w-full resize-none
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
          <br />
          {errors.description && (
            <p className="text-red-500 text-xs">{errors.description}</p>
          )}

          {/**Support Email */}
          <label htmlFor="SupportEmail">Support Email</label>
          <input
            type="email"
            id="SupportEmail"
            name="supportEmail"
            value={storeInfo.supportEmail}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none
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
          {errors.supportEmail && (
            <p className="text-red-500 text-xs">{errors.supportEmail}</p>
          )}

          {/**Phone*/}
          <label htmlFor="phone">Phone</label>
          <PhoneInput
            country={"us"}
            value={storeInfo.phone || ""}
            onChange={(value) =>
              setStoreInfo((prev) => ({
                ...prev,
                phone: value,
              }))
            }
            disabled={!isEditing}
            containerStyle={{
              width: "100%",
              opacity: !isEditing ? 0.6 : 1, // visually dimmed when disabled
              cursor: !isEditing ? "not-allowed" : "text",
            }}
            inputStyle={{
              width: "100%",
              background: !isEditing
                ? "rgba(200,200,200,0.3)"
                : theme
                ? "rgb(32, 42, 49)"
                : "rgba(128,128,128,0.3)",
              color: theme ? "#fff" : "#000",
              cursor: !isEditing ? "not-allowed" : "text",
            }}
          />

          {errors.phone && (
            <p className="text-red-500 text-xs">{errors.phone}</p>
          )}

          {/**Address*/}
          <label htmlFor="address">Store Address</label>
          <input
            type="text"
            id="address"
            name="storeAddress"
            value={storeInfo.storeAddress}
            onChange={handleChange}
            readOnly={!isEditing}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none
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
          <br />
          {errors.storeAddress && (
            <p className="text-red-500 text-xs">{errors.storeAddress}</p>
          )}

          <button
            type="button"
            className="text-sm w-20 bg-amber-700 hover:bg-amber-600 rounded-lg text-white  md:text-sm flex items-center justify-center p-2 font-bold 
         active:scale-95 transition-transform duration-100 "
            onClick={isEditing ? handleSave : handleToggle}
          >
            {isEditing ? "Save" : "Edit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StoreInfo;
