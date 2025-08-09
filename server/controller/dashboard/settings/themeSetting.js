const themeSetting = (app) => {
   const {Theme} = require("../../../model/user.js")
     const authMiddleware = require("../../../middleware/dashboard/auth.js")

   app.put("/api/dashboard/settings/theme",authMiddleware(["admin", "viewer"]),  async(req,res)=> {
    try{
        const {theme} = req.body
        const updatedTheme = await Theme.findOneAndUpdate(
            {},
            {
                theme,
            },
            {new: true, upsert:true}
        )
       
        res.status(200).json(updatedTheme)

    }catch(error){
        console.log("error updating theme:", error.message)
        res.status(500).json({error:"Couldn't change theme at the moment, please try again later!"})
    }
   })

   app.get("/api/dashboard/settings/theme",authMiddleware(["admin", "viewer"]), async(req,res)=> {
    try{
        const theme = await Theme.findOne()
       
        res.status(200).json(theme)


    }catch(error){
        console.log("Error fetching data: ", error)
    }
   })

}
module.exports = themeSetting