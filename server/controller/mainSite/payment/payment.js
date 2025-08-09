const payment = (app) => {
	const dotenv = require("dotenv");
	
let Stripe = require('stripe')
dotenv.config();
 const authMiddleware  = require("../../../middleware/mainSite/authMiddleware.js")
const SK_TEST_SECRET_KEY = process.env.SK_TEST
const stripePass = new Stripe(`${SK_TEST_SECRET_KEY}`)
  


app.post('/api/payment/create-payment-intent', authMiddleware, async (req,res)=> {
	const {amount} = req.body;

	try{
		const paymentIntent = await stripePass.paymentIntents.create({
			amount, //in cents 
			currency:'usd',
			payment_method_types: ['card'],
			metadata:{
				userId:req.user.id,
				userEmail: req.user.email
			}  
		})
		res.status(200).send({
			clientSecret: paymentIntent.client_secret,
		})
	} catch(err){
		console.error('Stripe error:', err);
		res.status(500).json({error: 'Something went wrong with Stripe'})
	}


})	

}
module.exports = payment