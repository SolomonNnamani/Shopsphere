const fetchOrders = (app) => {
	const { Order,OrderStats } = require("../../../model/user.js");
	const authMiddleware = require("../../../middleware/dashboard/auth.js")
	
app.get('/dashboard/orders',authMiddleware(["admin", "viewer"]), async (req, res) => {
  try {
    const orders = await Order.find(); // all orders

    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: `No orders found.` });
    }

    // Get the most recent snapshot by sorting all by snapshotDate (newest first) and picking the first one.
// This helps us compare today's data with the last saved stats.
    const lastSnapshot = await OrderStats.findOne().sort({snapshotDate: -1})

    const previousCount = lastSnapshot?.totalOrders || 0
    

    const previousDeliveredCount = lastSnapshot?.delivered || 0
    const previousPendingCount = lastSnapshot?.pending || 0
    const previousProcessingCount = lastSnapshot?.processing || 0
    const previousCancelledCount = lastSnapshot?.cancelled || 0
    const todaySales = lastSnapshot?.todaySales || 0
    const yesterdaySales = lastSnapshot?.yesterdaySales || 0
    const todayRevenue = lastSnapshot?.todayRevenue || 0
    const yesterdayRevenue = lastSnapshot?.yesterdayRevenue || 0

    
   

    res.status(200).json({
      orders,
      previousCount,
      previousDeliveredCount,
      previousPendingCount,
      previousProcessingCount,
      previousCancelledCount,
      todaySales,
      yesterdaySales,
      todayRevenue,
      yesterdayRevenue,


    });
  } catch (error) {
    console.error("Error fetching orders: ", error);
    res.status(500).json({ error: "Failed to fetch orders, please try again!" });
  }
});

//update edited order
app.put(`/dashboard/order/updateOrder/:orderId`, async(req,res) => {
  try{
    const {orderId}  = req.params;
    const {orderStatus} = req.body

    const updatedOrder = await Order.findOneAndUpdate(
       {_id:orderId},
       {orderStatus:orderStatus},
       {new: true, 
        upsert:true}  
      )

res.status(200).json(updatedOrder)


  }catch(error){
    console.log("Error updating orders: ", error)
    res.status(500).json({error: "Failed to update order, please try again!"})
  }

})


}
module.exports = fetchOrders