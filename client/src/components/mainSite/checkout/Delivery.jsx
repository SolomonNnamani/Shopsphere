import React,{useState,useEffect} from 'react'
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import {Country,State} from 'country-state-city'
import { RiArrowDropDownLine } from "react-icons/ri";
import ReusableInput from "../../reuseable/ReusableInput";

const Delivery = ({isShipping,deliveryData,setDeliveryData,deliveryError,handleChange,setToggleBilling}) => {
	
	const [states, setStates] = useState([])
  const [checkedValue, setCheckValue] = useState(false)
	

//for getting Countries
    const countryOptions = isShipping.supportedCountries?.map((abbrev)=> {
    	const country = Country.getCountryByCode(abbrev);//get the countries that match is abbrev countries
    	return country ? {name:country.name, code:country.isoCode} : null //if true then get country full name and abbreviation as well
    }).filter(Boolean)//this prevents null or undefined. in a case when a wrong country abb is inputed like maybe USS or NGG or Gp. this will ensure the code that break and will make sure the dont display quietly

    

    const handleCountryChange = (e) => {
    	const selectedCountry = e.target.value;//selected country might be US,Ng etc
    	setDeliveryData((prev) => ({
    	...prev, 
    	country:selectedCountry,//update the country form with which country is choosed
    	state:"",//Reset state when country changes
    	}))

    	const fetchStates = State.getStatesOfCountry(selectedCountry);//whatever country is selected then display its state
    	setStates(fetchStates)// update the react state with this country states
    }

    const handleCheckChange = (e)=> {
      const isChecked = e.target.checked
      setCheckValue(isChecked)
      setToggleBilling(isChecked)
      localStorage.setItem('check', JSON.stringify(isChecked))
    }

    useEffect(()=> {
      const stored = localStorage.getItem('check');
      if(stored !== null){
        const parsed = JSON.parse(stored);
        setCheckValue(parsed);
        setToggleBilling(parsed)
      }
    },[])


	return(
		<>
<div className="px-5  flex flex-col py-3 ">
<h2 className="text-sm font-medium ">2. DELIVERY ADDRESS </h2>
<small className="text-xs text-stone-400">All fields required </small>

<div>
{/*Delivery form, email*/}
		<ReusableInput
        label="Email address*"
        type="email"
        name="email"
        value={deliveryData.email}
        onChange={handleChange}
        error={deliveryError.email}
        className="flex flex-col"
        classNameLabel={`block text-xs !font-medium headerfont`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />

{/**firstName*/}
      <ReusableInput
        label="First name*"
        type="text"
        name="firstname"
        value={deliveryData.firstname}
        onChange={handleChange}
        error={deliveryError.firstname}
        className="flex flex-col"
        classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />

      {/**lastName*/}
      <ReusableInput
        label="Last name*"
        type="text"
        name="lastname"
        value={deliveryData.lastname}
        onChange={handleChange}
        error={deliveryError.lastname}
        className="flex flex-col"
        classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />


      {/*Phone*/}
       <label 
          htmlFor="phone"
          className="block text-xs !font-medium headerfont !mt-0"
          >Phone*</label>
          <PhoneInput
            country={"us"}
            onlyCountries={['us', 'gh', 'ng', 'ca']}
            value={deliveryData.telephone || ""}
            onChange={(value) =>
              setDeliveryData((prev) => ({
                ...prev,
                telephone: value,
              }))
            }
           containerStyle={{
              width: "100%",
               marginBottom:"15px"
              
            }}
            inputStyle={{
              width: "100%",
             
            }}
          />
           {deliveryError.telephone && (<small className="text-xs text-red-500">{deliveryError.telephone} </small>)}


           {/*Delivery Address*/}
           <ReusableInput
        label="Delivery address*"
        type="text"
        name="deliveryAddress"
        value={deliveryData.deliveryAddress}
        onChange={handleChange}
        error={deliveryError.deliveryAddress}
        className="flex flex-col"
       classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />


      {/**LGA*/}
      <ReusableInput
        label="LGA/TOWN*"
        type="text"
        name="lga"
        value={deliveryData.lga}
        onChange={handleChange}
        error={deliveryError.lga}
        className="flex flex-col"
        classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />

     


      {/**Zip code*/}
      <ReusableInput
        label="Postcode/ZIP Code*"
        type="text"
        name="zipCode"
        value={deliveryData.zipCode}
        onChange={handleChange}
        error={deliveryError.zipCode}
        className="flex flex-col"
        classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />

      {/**Country*/}
      <label className="block text-xs !font-medium headerfont !mt-0">Country*</label>
      <div className="relative">
      <select 
      name="country"
      value={deliveryData.country}
      onChange={handleCountryChange}
      className="p-2 border border-slate-400 rounded-sm  outline-none w-full text-sm appearance-none "
     >
      <option value="">Select Country </option>
      {
      	countryOptions?.map((country)=> (
      		<option key={country.code} value={country.code}>
      		{country.name} ({country.code})
      		</option>
      		))}
      
      </select>

      <div  className="pointer-events-none absolute top-0 right-3 flex items-center text-black/70">
<RiArrowDropDownLine className="text-4xl" />
           </div>
      </div>
       {deliveryError.country && (<small className="text-xs text-red-500">{deliveryError.country} </small>)}

       

       {/**State*/}
       <label className="block text-xs !font-medium headerfont !mt-5">State*</label>
      <div className="relative">
      	<select
      	name="state"
      	value={deliveryData.state}
      	onChange={handleChange}
      	disabled={states.length >0 ? false : true }
        className="p-2 border border-slate-400 rounded-sm  outline-none w-full text-sm disabled:opacity-50 appearance-none "
      	>
      	<option value="">Select State </option>
      	{
      		states.map((state)=> (
      			<option key={state.isoCode} value={state.name}>
      				{state.name}
      			</option>
      			))}
      		</select>
          <div  className={`pointer-events-none absolute top-0 right-3 flex items-center text-black/70 ${states.length > 0 ? "" : "opacity-50"} `}>
<RiArrowDropDownLine className="text-4xl " />
           </div>
      </div>
 {deliveryError.state && (<small className="text-xs text-red-500">{deliveryError.state} </small>)}

<div className="flex items-center gap-2 mt-5">
<input 
 type="checkbox"
 checked={checkedValue}
 onChange={handleCheckChange}
 /><small className="font-medium headerfont text-xs">Same billing address</small>
</div>
 


</div>

</div>
</>
		)
}
export default Delivery