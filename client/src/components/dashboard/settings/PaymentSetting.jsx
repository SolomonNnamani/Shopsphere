import { useState, useEffect } from "react";
import ReusableInput from "../../reuseable/ReusableInput";
import { toast } from "react-toastify";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'

const PaymentSetting = ({ theme, setLoading }) => {
  const [payment, setPayment] = useState({
    stripeKey: "",
  });
  const [error, setError] = useState({
    stripeKey: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPayment((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    let isValid = true;
    let error = {
      stripeKey: "",
    };
    if (payment.stripeKey.trim() === "") {
      error.stripeKey = "field must not be empty!";
      isValid = false;
    }
    setError(error);
    return isValid;
  };

  const handleSave = async (e) => {
    e.preventDefault();
     const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{
    if (!validate()) return;
    setLoading(true);
    try {
      const response = await fetchWithAuth(
        "/api/dashboard/settings/payment",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ payment: payment.stripeKey }),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        toast.error(
          data.error || "Failed to update settings, Please try again."
        );
      } else {
        toast.success("New payment key added");
        setPayment(payment);
        setIsEditing(false);
      }
    } catch (error) {
      console.log("update failed:", error);
      toast.error("Network error: could not update payment settings.");
    } finally {
      setLoading(false);
    }
  }
  };

  const handleToggle = () => {
    setIsEditing(true);
  };

  useEffect(() => {
    const fetchPaymentSetting = async () => {
      setLoading(true);
      try {
        let res = await fetchWithAuth(
          "/api/dashboard/settings/payment"
        );
        let data = await res.json();
        setPayment(data);
      } catch (error) {
        toast.error("Couldn't load key, please try again later!");
      } finally {
        setLoading(false);
      }
    };
    fetchPaymentSetting();
  }, []);

  return (
    <div
      className={` py-5 border-b w-full ${
        theme ? "border-[#3d4b55]" : "border-gray-300  "
      }`}
    >
      <small className="text-sm font-medium mb-2">💳 Payment Setting </small>
      <ReusableInput
        label="Stripe Public Key"
        type="text"
        name="stripeKey"
        value={payment.stripeKey}
        onChange={handleChange}
        readOnly={!isEditing}
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
        error={error.stripeKey}
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

export default PaymentSetting;
