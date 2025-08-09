const fetchCustomers = (app) => {
const {User, UserStats} = require("../../../model/user.js");
const authMiddleware = require("../../../middleware/dashboard/auth.js")

	app.get('/dashboard/customers', authMiddleware(["admin", "viewer"]), async(req,res)=> {
		try{
			const customers = await User.find();//all users

			 if (!customers || customers.length === 0) {
      return res.status(404).json({ error: `No registered customers found.` });
    }

 	const lastSnapshot = await UserStats.findOne().sort({snapshotDate: -1})

 	const previousCustomersCount = lastSnapshot?.totalCustomers || 0
 	
 	const currentNewCustomersCount = lastSnapshot?.currentNewCustomers || 0 
 	
 	const previousNewCustomersCount = lastSnapshot?.previousNewCustomers || 0 
 	


 	res.status(200).json({
 		customers,
 		previousCustomersCount,
 		currentNewCustomersCount,
 		previousNewCustomersCount
 	})

   
		}catch (error) {
    console.error("Error fetching users: ", error);
    res.status(500).json({ error: "Failed to fetch customers, please try again!" });
  }
	})



}

module.exports = fetchCustomers
