const storeInformation = (app) => {
  const { StoreInfo } = require("../../../model/user.js");
    const authMiddleware = require("../../../middleware/dashboard/auth.js")
  app.put("/api/dashboard/settings/storeInfo",authMiddleware(["admin"]),  async (req, res) => {
    try {
      const {
        storeName,
        lightLogo,
        darkLogo,
        description,
        supportEmail,
        phone,
        storeAddress,
        edit,
        lastUpdated,
      } = req.body;
      const updatedStoreInformation = await StoreInfo.findOneAndUpdate(
        {},
        {
          storeName,
          lightLogo,
          darkLogo,
          description,
          supportEmail,
          phone,
          storeAddress,
          edit,
          lastUpdated,
        },
        { new: true, upsert: true }
      );
      
      res.status(200).json(updatedStoreInformation);
    } catch (error) {
      console.log("Error updating store info", error);
      res.status(500).json({
        error: "Couldn't update store information, please try again later!",
      });
    }
  });

  app.get("/api/dashboard/settings/storeInfo", async (req, res) => {
    try {
      const storeInfo = await StoreInfo.findOne();
      if (!storeInfo) {
        return res.status(404).json({ error: "Store information not found." });
      }

      
      res.status(200).json(storeInfo);
    } catch (error) {
      console.log("Error fetching store information: ", error);
      res
        .status(500)
        .json({
          error: "Failed to fetch store information, Please try again!",
        });
    }
  });
};
module.exports = storeInformation;
