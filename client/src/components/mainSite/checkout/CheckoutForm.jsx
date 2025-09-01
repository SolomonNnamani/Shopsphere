import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchAuth } from "../utils/fetchAuth.js";
import { fetchPublic } from "../utils/fetchPublic.js";
import CartItems from "./CartItems";
import Delivery from "./Delivery";
import Billing from "./Billing";
import {
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

const CheckoutForm = ({ cartItems, setCartItems, setError, setLoading }) => {
  const [isShipping, setIsShipping] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [deliveryData, setDeliveryData] = useState({
    email: "",
    firstname: "",
    lastname: "",
    telephone: "",
    deliveryAddress: "",
    lga: "", //town
    state: "",
    zipCode: "",
    country: "",
  });
  const [billData, setBillData] = useState({
    //Billing Address
    firstname: "",
    lastname: "",
    billingAddress: "",
    lga: "", //town
    state: "",
    zipCode: "",
    country: "",
  });
  const [deliveryError, setDeliveryError] = useState({
    email: "",
    firstname: "",
    lastname: "",
    telephone: "",
    deliveryAddress: "",
    lga: "", //town
    state: "",
    zipCode: "",
    country: "",
  });
  const [billError, setBillError] = useState({
    //Billing Address
    firstname: "",
    lastname: "",
    billingAddress: "",
    lga: "", //town
    state: "",
    zipCode: "",
    country: "",
  });
  const [toggleBilling, setToggleBilling] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const [errorPayment, setErrorPayment] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const navigate = useNavigate();

  //fetch shipping
  useEffect(() => {
    const fetchShippingSettings = async () => {
      setLoading(true);
      try {
        const res = await fetchPublic("/api/dashboard/settings/shipping");
        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }
        const data = await res.json();

        setIsShipping(data);
      } catch (err) {
        //  toast.error("Failed to load shipping settings");
        setError("Failed to load shipping settings");
      } finally {
        setLoading(false);
      }
    };
    fetchShippingSettings();
  }, []);

  const validation = () => {
    let deliveryError = {
      email: "",
      firstname: "",
      lastname: "",
      telephone: "",
      deliveryAddress: "",
      lga: "", //town
      state: "",
      country: "",
      zipCode: "",
    };

    let billError = {
      //Billing Address
      firstname: "",
      lastname: "",
      billingAddress: "",
      lga: "", //town
      state: "",
      country: "",
      zipCode: "",
    };
    let isValid = true;

    //delivery validation //d.email
    if (deliveryData.email.trim() === "") {
      deliveryError.email = "Email is required";
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
        deliveryData.email.trim()
      )
    ) {
      deliveryError.email = "Please enter a valid email address";
      isValid = false;
    }

    //d.firstName
    if (deliveryData.firstname.trim() === "") {
      deliveryError.firstname = "First name is required";
      isValid = false;
    } else if (!/^[A-Za-z]{2,30}$/.test(deliveryData.firstname.trim())) {
      deliveryError.firstname = "First name must be 2-30 letters only";
      isValid = false;
    }

    //d.lastName
    if (deliveryData.lastname.trim() === "") {
      deliveryError.lastname = "Last name is required";
      isValid = false;
    } else if (!/^[A-Za-z]{2,30}$/.test(deliveryData.lastname.trim())) {
      deliveryError.lastname = "First name must be 2-30 letters only";
      isValid = false;
    }

    //d.phone
    if (!deliveryData.telephone || deliveryData.telephone.trim() === "") {
      deliveryError.telephone = "Phone number is required";
      isValid = false;
    }

    //d.deliveryAddress
    if (
      !deliveryData.deliveryAddress ||
      deliveryData.deliveryAddress.trim() === ""
    ) {
      deliveryError.deliveryAddress = "This is a required field";
      isValid = false;
    }

    //d.LGA
    if (!deliveryData.lga || deliveryData.lga.trim() === "") {
      deliveryError.lga = "This is a required field";
      isValid = false;
    }

    //d.state
    if (!deliveryData.state || deliveryData.state.trim() === "") {
      deliveryError.state = "This is a required field";
      isValid = false;
    }

    //d.country
    if (!deliveryData.country || deliveryData.country.trim() === "") {
      deliveryError.country = "This is a required field";
      isValid = false;
    }

    //d.zipcode
    if (!deliveryData.zipCode || deliveryData.zipCode.trim() === "") {
      deliveryError.zipCode = "ZIP code is required";
      isValid = false;
    }
    setDeliveryError(deliveryError);

    //Billing Validation - ONLY if toggleBilling is true
    if (toggleBilling) {
      let billError = {
        //Billing Address
        firstname: "",
        lastname: "",
        billingAddress: "",
        lga: "", //town
        state: "",
        country: "",
        zipCode: "",
      };

      //B.firstName
      if (billData.firstname.trim() === "") {
        billError.firstname = "First name is required";
        isValid = false;
      } else if (!/^[A-Za-z]{2,30}$/.test(billData.firstname.trim())) {
        billError.firstname = "First name must be 2-30 letters only";
        isValid = false;
      }

      //b.lastName
      if (billData.lastname.trim() === "") {
        billError.lastname = "Last name is required";
        isValid = false;
      } else if (!/^[A-Za-z]{2,30}$/.test(billData.lastname.trim())) {
        billError.lastname = "First name must be 2-30 letters only";
        isValid = false;
      }

      //b.billingAddress
      if (!billData.billingAddress || billData.billingAddress.trim() === "") {
        billError.billingAddress = "This is a required field";
        isValid = false;
      }

      //b.LGA
      if (!billData.lga || billData.lga.trim() === "") {
        billError.lga = "This is a required field";
        isValid = false;
      }

      //b.state
      if (!billData.state || billData.state.trim() === "") {
        billError.state = "This is a required field";
        isValid = false;
      }

      //b.country
      if (!billData.country || billData.country.trim() === "") {
        billError.country = "This is a required field";
        isValid = false;
      }
      //b.zipcode
      if (!billData.zipCode || billData.zipCode.trim() === "") {
        billError.zipCode = "ZIP code is required";
        isValid = false;
      }
      // Only update billing errors when billing form is active
      setBillError(billError);
    } else {
      // Clear billing errors when billing form is not active
      setBillError({
        firstname: "",
        lastname: "",
        billingAddress: "",
        lga: "",
        state: "",
        zipCode: "",
        country: "",
      });
    }

    return isValid;
  };

  //store delivery data → store in varaible → then to ls → (state) return delivery data to update state
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDeliveryData((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("delivery", JSON.stringify(updated)); //stringify it
      return updated;
    });
  };

  ///fetch delivery data from ls for delivery
  useEffect(() => {
    const stored = localStorage.getItem("delivery");
    if (stored) {
      setDeliveryData(JSON.parse(stored)); //pre fill the input with the following stored valuess upon reload
    }
  }, []);

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBillData((prev) => {
      const updated = { ...prev, [name]: value };
      localStorage.setItem("bill", JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const stored = localStorage.getItem("bill");
    if (stored) {
      setBillData(JSON.parse(stored));
    }
  }, []);

  //Calculate total weight
  const totalWeight = cartItems.reduce((acc, item) => {
    return acc + (item.weight || 0) * item.qty;
  }, 0);

  //caculate shipping cost
  const baseFee = parseFloat(isShipping?.baseFee || 0);
  const perKgFee = parseFloat(isShipping?.perKgFee || 0);

  const shippingCost = Math.round(baseFee + totalWeight * perKgFee);

  //total amount
  let subTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const sum = (subTotal + shippingCost).toFixed(2);
  const totalAmount = Number(sum);

  //const amountInCents = Math.round(totalAmount * 100)

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    if (!validation()) return;

    setLoading(true);

    const amountInCents = Math.round(totalAmount * 100); //stripe charges in cents
    try {
      // Step 1: Create PaymentIntent on backend
      const res = await fetchAuth("/api/payment/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountInCents }),
      });
      const { clientSecret } = await res.json();

      // Step 2: Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: toggleBilling
              ? `${billData.firstname} ${billData.lastname}`
              : `${deliveryData.firstname} ${deliveryData.lastname}`,
            email: deliveryData.email,
            address: {
              postal_code: toggleBilling
                ? billData.zipCode
                : deliveryData.zipCode,
            },
          },
        },
      });

      if (result.error) {
        setErrorPayment(result.error.message);
      } else {
        //payment successfull
        if (result.paymentIntent.status === "succeeded") {
          console.log("✅ Payment succeeded, creating order...");
          setPaymentSuccess(true);
          setErrorPayment("");
          setIsPlacingOrder(true);
          //create order in backend
          const orderRes = await fetchAuth("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              cartItems,
              deliveryData,
              billData,
              shippingCost,
              totalAmount:
                cartItems.reduce(
                  (acc, item) => acc + item.price * item.qty,
                  0
                ) + shippingCost,
              orderStatus: "pending",
              paymentIntentId: result.paymentIntent.id,
            }),
          });

          const data = await orderRes.json();

          setTimeout(() => {
            navigate(`/track-order/${data.orderNumber}`);
          }, 1000);

          //Clear cart and localStorage
          setCartItems([]);
          localStorage.removeItem("bill");
          localStorage.removeItem("delivery");
          localStorage.removeItem("cart");
        }
      }
    } catch (err) {
      setErrorPayment("Payment failed. please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-3 lg:grid-cols-3 lg:mx-45 lg:gap-5 lg:mt-5 md:mx-3"
    >
      {/**Cartitems*/}
      <CartItems
        cartItems={cartItems}
        setCartItems={setCartItems}
        isShipping={isShipping}
      />

      <div className="bg-[ghostwhite] ">
        {/**Delivery address*/}
        <Delivery
          isShipping={isShipping}
          deliveryData={deliveryData}
          setDeliveryData={setDeliveryData}
          deliveryError={deliveryError}
          handleChange={handleChange}
          toggleBilling={toggleBilling}
          setToggleBilling={setToggleBilling}
        />

        {/*Billing address*/}
        <Billing
          isShipping={isShipping}
          billData={billData}
          setBillData={setBillData}
          billError={billError}
          handleBillingChange={handleBillingChange}
          toggleBilling={toggleBilling}
          setToggleBilling={setToggleBilling}
        />
      </div>

      <div>
        {/*Payment integration*/}
        <div className="p-4   bg-[ghostwhite]">
          <div className="relative flex justify-between items-center">
            <h2 className="text-sm font-medium ">3. SELECT PAYMENT METHOD</h2>
            <p
              onClick={() => setShowDetails(!showDetails)}
              className="px-4 py-2 text-sm cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Click Me
            </p>

            {showDetails && (
              <p className="absolute right-0 lg:left-0 -top-60 lg:-top-40 mt-12 w-64 p-3 bg-gray-800 text-white text-sm rounded shadow-lg">
                <span className="font-semibold block mb-1">
                  Test Card (Demo Only)
                </span>
                Use the following details to place a <em>test order</em>: <br />
                <strong>Card Number:</strong> 4242 4242 4242 4242 <br />
                <strong>Expiry:</strong> 12/39 <br />
                <strong>CVC:</strong> 123
              </p>
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs !font-medium headerfont !mt-7">
                Card Number
              </label>
              <div className="border p-2 rounded">
                <CardNumberElement />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block text-xs !font-medium headerfont ">
                  Expiry
                </label>
                <div className="border p-2 rounded">
                  <CardExpiryElement />
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs !font-medium headerfont ">
                  CVC
                </label>
                <div className="border p-2 rounded">
                  <CardCvcElement />
                </div>
              </div>
            </div>
          </div>
          {errorPayment && (
            <p className="text-red-600 text-sm">{errorPayment}</p>
          )}

          {paymentSuccess && isPlacingOrder && (
            <p className="text-green-600 mt-3">
              🎉 Payment successful -- placing your order-- Please hold on...
            </p>
          )}
        </div>

        <div>
          {/* ORDER SUMMARY */}
          <div className="my-5 pt-5  bg-slate-50">
            <h2 className=" text-sm pb-5 font-medium px-5">4. ORDER SUMMARY</h2>

            {/* Line items */}
            {cartItems.map((item, i) => (
              <div key={i} className="text-sm mb-4 px-5">
                <p className="font-sm headerfont">
                  {item.qty} x {item.productName}, {item.color}
                </p>
                <p className="text-slate-500 headerfont">Size: {item.size}</p>
              </div>
            ))}

            <hr className="my-3 text-stone-200" />

            {/* Subtotal */}
            <div className="flex justify-between text-sm font-medium px-5">
              <p>Subtotal</p>
              <p>
                $
                {cartItems
                  .reduce((acc, item) => acc + item.price * item.qty, 0)
                  .toFixed(2)}
              </p>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-sm mt-2 px-5 ">
              <p>Shipping to {deliveryData.country}</p>
              <p>${shippingCost.toFixed()}</p>
            </div>
            <p className="text-xs text-slate-500 mt-1 mb-5 px-5">
              Express (4–6 business days, tracking)
            </p>

            {/* Total */}
            <div className="flex items-center justify-between text-sm font-medium bg-slate-300 px-5 py-3">
              <p>Order Total</p>
              <p>
                USD{" "}
                <span className="text-xl headerfont">
                  {" "}
                  $
                  {(
                    cartItems.reduce(
                      (acc, item) => acc + item.price * item.qty,
                      0
                    ) + shippingCost
                  ).toFixed(2)}
                </span>{" "}
              </p>
            </div>
          </div>

          <div className="px-5 pb-3 lg:px-0">
            <button
              type="submit"
              className="bg-amber-800 text-white py-3 w-full rounded-lg font-bold  transition-transform duration-100 active:scale-95
           hover:bg-amber-700 "
            >
              PAY NOW
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};
export default CheckoutForm;
