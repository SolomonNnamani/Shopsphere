const {Notification } = require("../model/user");


/**
 * Creates a new notification
 * 
 * @param {Object} options - The notification details
 * @param {String} options.type - Type of notification e.g. "low_stock", "new_order"
 * @param {String} options.message - The message to show in the frontend
 * @param {String} [options.relatedId] - Optional ID of related item (product, order, etc.)
 * @param {String} [options.relatedModel] - Name of the related model: "Product", "Order", or "User"
 */


	const createNotification = async({type, message, relatedId= null, relatedModel = null}) => {
		try{
			const newNotification = new Notification({
				type,
				message,
				relatedId,
				relatedModel,
			})

			await newNotification.save()

		}catch (error) {
    console.error("Error creating notification:", error.message);
    // Optional: log this somewhere or send alert
  }
	}


module.exports = createNotification;
