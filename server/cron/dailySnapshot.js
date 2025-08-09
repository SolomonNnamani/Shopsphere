const cron = require("node-cron");//bot runs on ur chosen time
const {Product, ProductStats,Order, OrderStats,User,UserStats} = require("../model/user.js")

cron.schedule("0 0 * * *", async () => {//run every midnight 12am
	try {
		// --- Product Stats ---
		const today = new Date();
const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate()); // 2025-08-04T00:00:00.000Z
const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999); // 2025-08-04T23:59:59.999Z

const existingProductSnapshot = await ProductStats.findOne({
  createdAt: { $gte: startOfToday, $lte: endOfToday },
});

if (existingProductSnapshot) {
  console.log("⛔ Product snapshot already exists for today.");
 
}else{


		const totalProducts = await Product.countDocuments();
		const active = await Product.countDocuments({ status: "active" });
		const lowStock = await Product.countDocuments({ status: "low-stock" });
		const outOfStock = await Product.countDocuments({ status: "out-of-stock" });

		await ProductStats.create({
			total: totalProducts,
			active,
			lowStock,
			outOfStock,
		});
		console.log("✅ Daily Product snapshot saved.");

}


const existingOrderSnapshot = await OrderStats.findOne({
  createdAt: { $gte: startOfToday, $lte: endOfToday },
});

if (existingOrderSnapshot) {
  console.log("⛔ Order snapshot already exists for today.");
  
}else{

			const totalOrders = await Order.countDocuments();
		const delivered = await Order.countDocuments({ orderStatus: "delivered" });
		const pending = await Order.countDocuments({ orderStatus: "pending" });
		const processing = await Order.countDocuments({ orderStatus: "processing" });
		const cancelled = await Order.countDocuments({ orderStatus: "cancelled" });

		 //-----Calculating total sales------
       const now = new Date();

       // === STEP 1: Calculate today's start and end ===     //-----Calculating total sales------
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0,0,0,0); //00:00:00:00:000,start of today
      const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23,59,59,999); //23:59:59.999, end of today

       // === STEP 2: Calculate yesterday's start and end ===
      const yesterday = new Date(now)
      yesterday.setDate(now.getDate() - 1); //get yesterday date
      const  yStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 0,0,0,0 );
      const  yEnd = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate(), 23,59,59, 999);


      // === STEP 3: Aggregate delivered orders for today ===
      const todaySalesAgg = await Order.aggregate([
        {
          $match: {
            orderStatus: "delivered", //Only count delivered orders
            createdAt: {$gte:todayStart, $lte:todayEnd}//only today
          }
        }, 
        {
          $group: {
            _id: null,
            totalSales: {$sum: "$totalAmount"} // Sum all the totalAmount
          }
        }

      ])
     // console.log("todaySalesAgg :", todaySalesAgg)


      // === STEP 4: Aggregate delivered orders for yesterday ===
      const yesterdaySalesAgg = await Order.aggregate([
        {
          $match: {
            orderStatus: "delivered",
            createdAt: {$gte: yStart, $lte:yEnd}
          }
        },
        {
          $group: {
            _id:null,
            totalSales: {$sum: "$totalAmount"}
          }
        }

      ])
      //console.log("yesterdaySalesAgg :", yesterdaySalesAgg)


      // === STEP 5: Safely extract the results (handle empty results) ===
      const todaySales = todaySalesAgg[0]?.totalSales || 0;
      const yesterdaySales = yesterdaySalesAgg[0]?.totalSales || 0;

       //console.log("todaySales :", todaySales)
       //console.log("yesterdaySales :", yesterdaySales)



      //------Calculating total Revenue------

      const todayRevenueAgg = await Order.aggregate([
        {
          $match:{
            orderStatus: {$ne: "cancelled"}, // $ne means !== (is not equal to)  ----------- filter out orders that are not "cancelled"
            paymentStatus: "paid", // match only orders with successful pay including pending,processing etc
            createdAt: {$gte:todayStart, $lte:todayEnd}
          }
        }, 
        {
          $group: {
            _id: null,
            totalRevenue: {$sum: "$totalAmount"}
          }
        }
      ])


       const yesterdayRevenueAgg = await Order.aggregate([
        {
          $match:{
            orderStatus: {$ne: "cancelled"}, // $ne means !== (is not equal to)  ----------- filter out orders that are not "cancelled"
            paymentStatus: "paid", // match only orders with successful pay including pending,processing etc
            createdAt: {$gte:yStart, $lte:yEnd}
          }
        }, 
        {
          $group: {
            _id: null,
            totalRevenue: {$sum: "$totalAmount"}
          }
        }
      ])


       const todayRevenue = todayRevenueAgg[0]?.totalRevenue || 0;
       const yesterdayRevenue = yesterdayRevenueAgg[0]?.totalRevenue || 0;



      await OrderStats.create({
        totalOrders,
        delivered,
        pending,
        processing,
        cancelled,
        todaySales,
        yesterdaySales,
        todayRevenue,
        yesterdayRevenue
      })
		console.log("✅ Daily Order snapshot saved.");
}
		

	} catch (error) {
		console.error("❌ Snapshot cron job error:", error);
	}

})


// 🗓 Monthly CRON: User Stats (1st of each month at midnight)
cron.schedule("0 0 1 * *", async () => {
  try {
   
// --- User Stats ---
  	const now = new Date();
const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
const monthEnd = new Date(
  now.getFullYear(),  // Current year
 now.getMonth() + 1, // NEXT month (because month is 0-indexed)
  0,  // Day 0 of next month === last day of current month
  23, 59, 59, 999 // Last millisecond of the day
  );

const existingUserSnapshot = await UserStats.findOne({
  createdAt: { $gte: monthStart, $lte: monthEnd },
});

if (existingUserSnapshot) {
  console.log("⛔ Monthly User snapshot already exists.");
 
}


		 const totalCustomers = await User.countDocuments();

		 	//------------currentNew customer snapshot -----------------

    const startOfMonth = new Date(
      now.getFullYear(), //e.g 2025
      now.getMonth(), //eg 7 for August (javaScriot months start at 0)
      1            //day 1 of the month → August 1st
      );
    // startOfMonth = 2025-08-01T00:00:00.000Z

    //step2: Get the end of the month
    const endOfMonth = new Date(
       now.getFullYear(),   // e.g. 2025
       now.getMonth() + 1, //next Month (8 = september)
       0,     // day 0 of next month → rolls back to last day of current month (August 31st)
       23,59,59,999   // Set the time to the very end of the day


      )
      // endOfMonth = 2025-08-31T23:59:59.999Z

      const currentNewCustomers = await User.countDocuments({
        createdAt: {
          $gte:startOfMonth, //$gte means >=, createdAt >= 2025-08-01T00:00:00.000Z
          $lte: endOfMonth, //$lte means <=,  createdAt <= 2025-08-31T23:59:59.999Z
        }
      })


       //----------- Get previous snapshot (last month)------------
      const lastMonth = new Date(); //Gets todays date
      lastMonth.setMonth(lastMonth.getMonth() - 1); //Go back 1 month


      const previousNewCustomers = await User.countDocuments({
        createdAt:{
           // ⬆️ Greater than or equal to 1st of last month at 00:00:00
          $gte: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
          $lte: new Date(
            lastMonth.getFullYear(),
            lastMonth.getMonth() + 1,  // month + 1 then use day 0 gives us last day of current month
            0, // day 0 = last day of the *current* month
            23,59,59,999 //end of the day

            )

        }
      })
      

    const snapshot = await UserStats.create({
      totalCustomers,
      currentNewCustomers,
      previousNewCustomers
    })

    console.log("Monthly User snapshot saved")



     } catch (error) {
    console.error("❌ Monthly User snapshot error:", error);
  }
});