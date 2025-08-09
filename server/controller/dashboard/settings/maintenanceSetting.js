const maintenanceSetting = (app) => {
const {Maintenance} = 	require("../../../model/user.js")
  const authMiddleware = require("../../../middleware/dashboard/auth.js")

app.put("/api/dashboard/settings/maintenance",authMiddleware(["admin"]),  async(req,res)=> {
	

	 try{
        const {maintenance} =  req.body
        const updatedMaintenance = await Maintenance.findOneAndUpdate(
            {},
            {
                maintenance,
            },
            {new: true, upsert:true}
        )
       
        res.status(200).json(updatedMaintenance)

    }catch(error){
        console.log("error updating maintenance:", error.message)
        res.status(500).json({error:"Couldn't turn on maintenance at the moment, Please try again later"})
    }

})

app.get('/api/dashboard/settings/maintenance', async(req,res)=> {
try{
            const maintenance = await Maintenance.findOne()
            
            res.status(200).json(maintenance)
        }catch(error){
            console.log("Error fetching data", error)

        }
})

}

module.exports = maintenanceSetting