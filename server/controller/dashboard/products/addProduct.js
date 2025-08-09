const addProduct = (app) => {
  const { Product, ProductStats } = require("../../../model/user.js");
  const authMiddleware = require("../../../middleware/dashboard/auth.js")
  const createNotification = require("../../../utils/notificationUtil.js")

  app.post("/api/dashboard/product/addproduct", authMiddleware(["admin"]), async (req, res) => {
    try {
      const {
        productName,
        category,
        subCategory,
        price,
        stkQuantity,
        color,
         size,
         weight,
    material,
    style,
    fitType,
    gender,
    brand,
    sku,
    slug,
        mainImage,
        galleryImages,
        description,
        tags,
        status,
       
      } = req.body;

      const newProduct = new Product({
        productName,
        category,
        subCategory,
        price,

          status,
        stkQuantity,
        color,
         size,
         weight,
        material,
        style,
        fitType,
        gender,
        brand,
        sku,
        slug,
        mainImage,
        galleryImages,
        description,
        tags,
      
        
      });
      await newProduct.save();//product saved


      if(newProduct.status === "low-stock" || newProduct.status === "out-of-stock"){
        await createNotification({
          type:newProduct.status === "low-stock" ? "low_stock" : "out_of_stock",
          message: `${newProduct.productName} is ${newProduct.status.replace("-", " ")} `,
          relatedId: newProduct._id,
          relatedModel: "Product"
        })
      }








      res.status(200).json({ message: "Product added successfully!" });
    } catch (error) {
      console.log("Cannot add new product", error.message);
      res
        .status(500)
        .json({ error: "Failed to add product, Please try again later." });
    }
  });

  //Get product
  app.get("/api/dashboard/products", /*authMiddleware(["admin", "viewer"]),//*/ async (req, res) => {
    try {
      const products = await Product.find();// All current products
    

      // Get the most recent snapshot by sorting all by snapshotDate (newest first) and picking the first one.
// This helps us compare today's data with the last saved stats.
      const lastSnapshot = await ProductStats.findOne().sort({snapshotDate: -1})

      const previousCount = lastSnapshot?.total || 0;
     // console.log("previousCount: "+ previousCount)

      const previousActiveCount = lastSnapshot?.active || 0;
    //  console.log("previousActiveCount: "+ previousActiveCount)

      const previousLowStockCount = lastSnapshot?.lowStock || 0;
     //  console.log("previousLowStockCount: "+ previousLowStockCount)

      const previousOutOfStockCount = lastSnapshot?.outOfStock || 0;
     // console.log("previousOutOfStockCount: "+ previousOutOfStockCount)
      

      res.status(200).json({
        products,
        previousCount,
        previousActiveCount,
        previousLowStockCount,
        previousOutOfStockCount

      });
    } catch (error) {
      console.log("Error fetching products: ", error);
      res
        .status(500)
        .json({ error: "Failed to fetch products, Please try again!" });
    }
  });
};

module.exports = addProduct;
