const { Notification} = require("../../../model/user.js");
  const authMiddleware = require("../../../middleware/dashboard/auth.js")

const notification = (app) => {
	//Get all notifications (admin only) and viewers too

	app.get("/api/dashboard/notifications", authMiddleware(["admin","viewer"]), async(req,res)=> {
		try{
			const notifications = await Notification.find()
			.sort({createdAt: -1}) // newest first
			.limit(50); //optional: limit to avoid overload.... just like(slice(0,50))

			res.status(200).json(notifications)

		}catch(err){
			 console.error("Failed to fetch notifications:", err.message);
      res.status(500).json({ error: "Failed to load notifications." });

		}
	})


	//PUT: Mark notification as read
	app.put("/api/dashboard/notifications/:id/mark-read", authMiddleware(["admin"]), async(req,res)=> {
		try{
			const {id} = req.params;
			const updated = await Notification.findByIdAndUpdate(id, 
				{isRead:true},
				{new: true}
				);

			res.status(200).json({message: "Marked as read", notifications:updated})

		}catch (err) {
      console.error("Failed to mark notification as read:", err.message);
      res.status(500).json({ error: "Action failed." });
    }
	})


	// Delete a single notification
	app.delete("/api/dashboard/notifications/:id", authMiddleware(["admin"]), async(req,res)=> {
		try{
			const {id } = req.params;
			const deleted = await Notification.findByIdAndDelete(id);

			if(!deleted){
				return res.status(404).json({error: "Notification not found"});
			}

			res.status(200).json({message: "Notification deleted"});

		}catch(err){
			  console.error("Delete error:", err.message);
    res.status(500).json({ error: "Failed to delete notification" });
		}

	})



	//Delete all notications
	app.delete("/api/dashboard/notifications", authMiddleware(["admin"]), async (req, res) => {
		try{
			await Notification.deleteMany({});
			res.status(200).json({message: "All notifications cleared"})
		}catch(err){

			console.error("Clear all error:", err.message);
    res.status(500).json({ error: "Failed to clear all notifications" });
		}

})


	
}
module.exports=notification