const shippingSetting = (app) => {

	const {Shipping} = require("../../../model/user.js")
	  const authMiddleware = require("../../../middleware/dashboard/auth.js")



app.put('/api/dashboard/settings/shipping',authMiddleware(["admin"]),  async(req,res)=> {
	const {  supportedCountries, standardDeliveryTime, baseFee, perKgFee} = req.body
	try{
		const updatedShippingSetting = await Shipping.findOneAndUpdate(
			{},
			{
				supportedCountries,
			 standardDeliveryTime,
			 baseFee:baseFee.toFixed(2),
			perKgFee:perKgFee
			},
			{
				new:true,
				upsert:true
			} 
			)
		
	

res.status(200).json(updatedShippingSetting)


	}catch(error){
		console.log("error updating shipping settings ", error)
		res.status(500).json({error: "Couldn't update shipping setting, please try again later!"})
	}
})

app.get('/api/dashboard/settings/shipping', async(req,res)=> {
try{
			const shipping = await Shipping.findOne()
			
			res.status(200).json(shipping)
		}catch(error){
			console.log("Error fetching data", error)

		}
})

}
module.exports = shippingSetting