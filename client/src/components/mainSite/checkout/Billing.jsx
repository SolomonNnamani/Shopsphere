import {useState} from 'react'
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import ReusableInput from "../../reuseable/ReusableInput";
import {Country,State} from 'country-state-city'
import { RiArrowDropDownLine } from "react-icons/ri";



const Billing = ({isShipping,billData,setBillData,billError,handleBillingChange,toggleBilling,setToggleBilling}) => {
	const [states, setStates] = useState([])
	

//for getting Countries
    const countryOptions = isShipping.supportedCountries?.map((abbrev)=> {
    	const country = Country.getCountryByCode(abbrev);//get the countries that match is abbrev countries
    	return country ? {name:country.name, code:country.isoCode} : null //if true then get country full name and abbreviation as well
    }).filter(Boolean)//this prevents null or undefined. in a case when a wrong country abb is inputed like maybe USS or NGG or Gp. this will ensure the code that break and will make sure the dont display quietly

    

    const handleCountryChange = (e) => {
    	const selectedCountry = e.target.value;//selected country might be US,Ng etc
    	setBillData((prev) => ({
    	...prev, 
    	country:selectedCountry,//update the country form with which country is choosed
    	state:"",//Reset state when country changes
    	}))

    	const fetchStates = State.getStatesOfCountry(selectedCountry);//whatever country is selected then display its state
    	setStates(fetchStates)// update the react state with this country states
    }
	return(
		<>
{ toggleBilling && (
		<div className="px-5 py-5 ">
<h2 className="text-sm font-medium "> BILLING ADDRESS </h2>

<div>


{/**firstName*/}
      <ReusableInput
        label="First name*"
        type="text"
        name="firstname"
        value={billData.firstname}
        onChange={handleBillingChange}
        error={billError.firstname}
        className="flex flex-col"
        classNameLabel={`block text-xs !font-medium headerfont `}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />

      {/**lastName*/}
      <ReusableInput
        label="Last name*"
        type="text"
        name="lastname"
        value={billData.lastname}
        onChange={handleBillingChange}
        error={billError.lastname}
        className="flex flex-col"
       classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />


      {/**Bill Address*/}
      <ReusableInput
        label="Billing address*"
        type="text"
        name="billingAddress"
        value={billData.billingAddress}
        onChange={handleBillingChange}
        error={billError.billingAddress}
        className="flex flex-col"
       classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />



      {/**LGA*/}
      <ReusableInput
        label="LGA/TOWN*"
        type="text"
        name="lga"
        value={billData.lga}
        onChange={handleBillingChange}
        error={billError.lga}
        className="flex flex-col"
       classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />

     


      {/**Zip code*/}
      <ReusableInput
        label="Postcode/ZIP Code*"
        type="text"
        name="zipCode"
        value={billData.zipCode}
        onChange={handleBillingChange}
        error={billError.zipCode}
        className="flex flex-col"
        classNameLabel={`block text-xs !font-medium headerfont !mt-0`}
        classNameInput={`p-2 border border-slate-400 rounded-sm  outline-none`}
      />

      {/**Country*/}
      <label className="block text-xs !font-medium headerfont !mt-0">Country*</label>
      <div className="relative">
      <select 
      name="country"
      value={billData.country}
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
      {billError.country && (<small className="text-xs text-red-500">{billError.country} </small>)}

       {/**State*/}
       <label className="block text-xs !font-medium headerfont !mt-5">State*</label>
      <div className="relative">
      	<select
      	name="state"
      	value={billData.state}
      	onChange={handleBillingChange}
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
      		 {billError.state && (<small className="text-xs text-red-500">{billError.state} </small>)}


      





</div>

</div>


)}
</>
		)

}
export default Billing