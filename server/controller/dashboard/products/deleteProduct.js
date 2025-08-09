const deleteProduct = (app) => {
    const {Product} = require("../../../model/user.js")
      const authMiddleware = require("../../../middleware/dashboard/auth.js")

    app.delete("/api/dashboard/product/delete/:id",authMiddleware(["admin"]),  async(req,res)=> {

        try{
            const {id} = req.params
            const deleteProduct = await Product.findOneAndDelete({
                _id:id,

            })
            if(!deleteProduct){
                return res.status(404).json({error:"Product not found"})
            }
            res.status(200).json({deleteProduct})

        }catch(error){
            console.log("Error deleting product", error.message)
            res.status(500).json({error: "Couldn't delete product, please try again later!"})
        }

    })

}
module.exports = deleteProduct