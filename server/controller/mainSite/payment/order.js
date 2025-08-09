 const {Order,Product} = require("../../../model/user");
 const nodemailer = require('nodemailer');
 const authMiddleware  = require("../../../middleware/mainSite/authMiddleware.js")
 const createNotification = require("../../../utils/notificationUtil.js")
 const dotenv = require("dotenv");
dotenv.config();


const generatedOrderNumber = async() => {
	const count  = await Order.countDocuments(); //get current order count
	return `ORD${1000 + count + 1}`; //e.g ORD1001
}

const order = (app) => {
		
	app.post('/api/orders', authMiddleware, async (req,res) => {
		try{
			const {
				cartItems,
				deliveryData,
				billData,
				shippingCost,
				totalAmount,
				orderStatus,
				paymentIntentId,
			}= req.body;

			
			const orderNumber = await generatedOrderNumber()

			 const newOrder = new Order({
      orderNumber,
      cartItems,
      deliveryData,
      billData,
      shippingCost,
      totalAmount,
      orderStatus,
      paymentIntentId,
      userId:req.user.id
    });

    await newOrder.save();

//for notification
    await createNotification({
      type: "new_order",
      message: `New order ${orderNumber} has been placed`,
      relatedId: newOrder._id,
      relatedModel: "Order"
    })


    //update product stock
    for(const item of cartItems){
      const productCandidates = await Product.find({
        productName: item.productName
      })
      let matchedProduct = null;

      for(const prod of productCandidates){
        const cleanedColors = prod.color.replace(/and/gi, '').split(',').map(c => c.trim().toLowerCase())
        const cleanedSizes = prod.size.replace(/and/gi, '').split(',').map(s => s.trim().toLowerCase());

        const colorMatch = cleanedColors.includes(item.color.toLowerCase());
        const sizeMatch = cleanedSizes.includes(item.size.toLowerCase());

        if(colorMatch && sizeMatch){
          matchedProduct = prod;
          break;
        }
      }

      if(!matchedProduct){
        console.log(`No matching product found for color: ${item.color}, size: ${item.size} `)
      }


    //continue with stock deducton
    const qtyOrdered = Number(item.qty);
    const newQty = matchedProduct.stkQuantity - qtyOrdered;

    if(newQty < 0){
        return res.status(400).json({ message: 'Insufficient stock' });
    }

    matchedProduct.stkQuantity = newQty
    await matchedProduct.save()




      
    }








    //node mailer
    const transporter = nodemailer.createTransport({
    	service:'gmail',
    	auth: {
    		user: process.env.EMAIL_USER,
    		pass: process.env.EMAIL_PASS
    	}
    })


    const mailOptions = {
    	from: `"Shopsphere" <${process.env.EMAIL_USER}>`,
    	to:deliveryData.email,
    	subject: `Your Order ${orderNumber} is Confirmed`,
    	html:`
    	<h2>Order Confirmation - ${orderNumber}</h2>
    <p>Thank you for your purchase, ${deliveryData.firstname} ${deliveryData.lastname}!</p>
    <p>We've received your order and it's now <strong>${orderStatus}</strong>.</p>
    <ul>
      ${cartItems.map(item => `
        <li>${item.qty} x ${item.productName} (${item.size}, ${item.color}) - $${item.price * item.qty}</li>
      `).join('')}
    </ul>
    <p><strong>Total:</strong> $${totalAmount}</p>
    <p>Shipping to: ${deliveryData.deliveryAddress}, ${deliveryData.state}, ${deliveryData.country}</p>
    	`

    }



await transporter.sendMail(mailOptions);

    res.status(201).json({message: 'Order placed successfully', orderNumber})


		}catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Order saving failed' });
  }

	})











//this gets the specific order number information
app.get('/api/orders/:orderNumber',authMiddleware, async (req, res) => {
  try {
    const { orderNumber } = req.params;
    const order = await Order.findOne({ orderNumber, userId:req.user.id});

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order: ", error);
    res.status(500).json({ error: "Failed to fetch order, please try again!" });
  }
});


//THis gets all orders
app.get('/api/orders',authMiddleware, async (req, res) => {
  try {
    const order = await Order.find({userId:req.user.id});
   

    if (!order) {
      return res.status(404).json({ error: `You haven't placed any orders yet. ` });
    }

    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order: ", error);
    res.status(500).json({ error: "Failed to fetch order, please try again!" });
  }
});










}
module.exports = order
