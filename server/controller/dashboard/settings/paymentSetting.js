const paymentSetting = (app) => {
	const {Payment} = require("../../../model/user.js")
	  const authMiddleware = require("../../../middleware/dashboard/auth.js")

	app.put("/api/dashboard/settings/payment",authMiddleware(["admin"]),  async(req,res)=> {
		const {payment} = req.body

		try{
			const updatedPaymentSetting = await Payment.findOneAndUpdate(
					{},
					{
						stripeKey:payment
					},
					{
						new:true,
						upsert:true
					}
					)
			
				res.status(200).json(updatedPaymentSetting)
		}catch(error){
			console.log("Error updating payment setting", error)
			res.status(500).json({error:"Couldn't update payment setting, please try again later!"})
		}


	})

	app.get("/api/dashboard/settings/payment", async(req,res)=> {
		try{
			const payment = await Payment.findOne()
			
			res.status(200).json(payment)
		}catch(error){
			console.log("Error fetching data", error)

		}

	})

}
module.exports = paymentSetting