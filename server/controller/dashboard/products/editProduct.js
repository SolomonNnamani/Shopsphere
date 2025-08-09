const editProduct = (app) => {
  const { Product } = require("../../../model/user.js");
    const authMiddleware = require("../../../middleware/dashboard/auth.js")
    const createNotification = require("../../../utils/notificationUtil.js")

  app.put("/api/dashboard/product/editProduct/:id", authMiddleware(["admin"]),  async (req, res) => {
    const {
      sku,
      productName,
      price,
      stkQuantity,
      category,
      lastUpdated,
      status,
      color,
    size,
    weight,
    gender,
    subCategory,
    slug,
    tags,

      edit,
    } = req.body;
    const { id } = req.params;
    try {
      const existingProduct = await Product.findById(id);
      if (!existingProduct) {
        return res.status(404).json({ error: "Product not found" });
      }

      const product = await Product.findOneAndUpdate(
        { _id: id },
        {
          sku,
          productName,
          price,
          stkQuantity,
          category,
          lastUpdated,
          status,
          color,
    size,
    weight,
    gender,
     subCategory,
    slug,
    tags,
          edit,
        },
        {new: true, 
        upsert:true}  
            );
      console.log("Updated task:", product);

      if (
  product.status === "low-stock" ||
  product.status === "out-of-stock"
) {
  await createNotification({
    type: product.status === "low-stock" ? "low_stock" : "out_of_stock",
    message: `${product.productName} is ${product.status.replace("-", " ")}`,
    relatedId: product._id,
    relatedModel: "Product"
  });
}


      res.status(200).json(product);
    } catch (error) {
      console.log("Error updating task:", error.message);
      res
        .status(500)
        .json({ error: "Couldn't update task, please try again later" });
    }
  });
};
module.exports = editProduct;
