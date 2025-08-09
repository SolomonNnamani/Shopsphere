const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const password = process.env.MONGO_DB;
const bcrypt = require("bcrypt");



mongoose
  .connect(
    `mongodb+srv://solomonnnamani01:${password}@todo.cpbgq3r.mongodb.net/commerce?retryWrites=true&w=majority`
  )
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Error connecting to database:", error));

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: {
    type: String,
    required: function () {
      return this.provider === "local"; // password is only required for local users
    },
  },
  phone:{type:String,
  required: function () {
    return this.provider === "local"
  },
default:""

},
  provider: { type: String, enum: ["local", "google"], default: "local" }, //for goodle,facebook etc
  profileComplete: {type:Boolean, default:true},
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}, { timestamps: true });


const productSchema = new mongoose.Schema({
  productName: {type:String, required:true},
  category: {type:String, required:true},//Clothing,Footwear,Accessories
  subCategory:{type:String, required:true, default:""},//
  price: {type:Number, required:true},
  status: {type:String,required:true },
  stkQuantity: {type:Number, required:true},
  color: {type:String, required:true},
   size: {type:String, required:true},
   weight:{type:Number, default:0.5},
    material: {type:String, default:""},
    style: {type:String, default:""},
    fitType: {type:String, default:""},
    gender: {type:String, required:true},
    brand: {type:String, default:""},
  sku: {type:String, default:"", required:true},
  slug:{type:String, required:true,unique:true, default:""},
  mainImage:{type:String, required:true},
  galleryImages:{type:[String], required:true},
  description: {type:String,required:true },
  tags:{type: [String], required:true, default:[]},
  edit:{type:Boolean, default:false},
  createdAt: { type: Date, default: Date.now },
  lastUpdated:{ type: Date, default: Date.now },

})

const storeInfoSchema = new mongoose.Schema({
  storeName:{type:String, required:true, default:"Shopsphere"},
  lightLogo:{type:String, required:true, default:""},
  darkLogo:{type:String, required:true, default:""},
  description:{type:String, required:true, default:""},
  supportEmail:{type:String, required:true, default:""},
  phone:{type:String, required:true, default:""},
  storeAddress:{type:String, required:true, default:"1234 Maplecrest Drive, Apartment 567 Riverview Heights, CO 81234"},
  edit:{type:Boolean, required:true, default:"false"},
  lastUpdated:{type:String, required:true, default:""},
})

const themeSetting = new mongoose.Schema({
  theme:{type:Boolean, required:true, }
})

const paymentSetting = new mongoose.Schema({
  stripeKey:{type:"String", required:true, default:""}
})

const shippingSetting = new mongoose.Schema({
   supportedCountries: {type:[String], required:true},
   standardDeliveryTime: {type:String, required:true, default:""},
   baseFee:{type:Number, required:true, default:0},
   perKgFee:{type:Number, required:true, default:0},

})


const maintenanceSetting = new mongoose.Schema({
  maintenance:{type:Boolean, required:true, default:false}
})

const productStatsSchema = new mongoose.Schema({
  total:Number,
  active: Number,
  lowStock: Number,
  outOfStock: Number,
  snapshotDate:{type:Date, default:Date.now}
})

const profileSchema = new mongoose.Schema(
  {
    profilePicture: { type: String, required: true },
  },
  { timestamps: true } // Adds createdAt and updatedAt automatically
);


const dashboardUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email:{type:String, required:true, unique:true},
  password: {type: String, required:true}, //Required for admin
  role: {
    type:String,
    enum:["admin", "viewer"],
  default:"viewer"
  },
},
{timestamps:true}
)


//for main website
const orderSchema = new mongoose.Schema({
  orderNumber:{
    type:String,
    required:true,
    unique:true,
  },
  cartItems:[
     {
      productName:String,
      image:String,
      price:Number,
      qty:Number,
      size:String,
      color:String,
      weight:Number
     },
    ],

  deliveryData:{
    firstname:String,
    lastname:String,
    email:String,
    telephone:String,
    deliveryAddress:String,
    lga:String,
    zipCode:String,
   country: String,
    state: String,
   
  },
  billData:{
     firstname:String,
     lastname:String,
    billingAddress:String,
    lga:String,
    zipCode:String,
   country: String,
    state: String,

  },

  shippingCost:{type:Number, required: true},
  totalAmount:{type:Number, required:true},

  paymentIntentId: {type:String, required:true},
  paymentStatus:{type:String, default:'paid'}, // or 'pending', 'failed'


    orderStatus: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },

  // ✅ ADD THIS:
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
},{timestamps:true})


const orderStatsSchema = new mongoose.Schema({
  totalOrders:Number,
  delivered: Number,
  pending: Number,
  processing: Number,
  cancelled: Number,
  todaySales:Number,
  yesterdaySales:Number,
  todayRevenue:Number,
  yesterdayRevenue:Number,
  snapshotDate:{type:Date, default:Date.now}
})


const userStatsSchema = new mongoose.Schema({
  totalCustomers: Number,
  currentNewCustomers: Number,
  previousNewCustomers: Number,
  snapshotDate:{type:Date, default:Date.now}
})

const notificationsSchema = new mongoose.Schema(
{
  // 📌 1. Notification Type — defines the category of the event
  type:{
    type:String,
     // enum means: "only allow these specific string values"
    enum: [
      "new_order", "low_stock", "out_of_stock", "new_customer", "order_cancelled"
    ],
    required:true // type must be provided when creating a notification
  }, 

    // 📌 2. Message to display to the user/admin
  message:{
    type:String,
    required:true
    // example: "Product 'Air Max Pro' is out of stock"
  },

  // 📌 3. Optional ID of the related resource (product/order/customer)
  relatedId: {
    type: mongoose.Schema.Types.ObjectId,
    // refPath tells Mongo: "look at relatedModel to know what this ID refers to"
    refPath:"relatedModel"
    // So if relatedModel = "Product", then relatedId points to a Product._id
  },


// 📌 4. The model/collection that the relatedId points to
  relatedModel:{
    type: String,

    //enum ensures it only accepts models you use in your app
    enum: ["Product", "Order", "User"]
     // Helpful for future populate() calls or routing
  },

   // 📌 5. Status to track whether the notification has been read
    isRead: {
      type: Boolean,
      default: false // starts as unread by default
    }
  },{timestamps:true})






const User =  mongoose.model("User", userSchema);
const Product =  mongoose.model("Product", productSchema);
const StoreInfo = mongoose.model("Storeinfo", storeInfoSchema)
const Theme = mongoose.model("Theme", themeSetting)
const Payment = mongoose.model("Payment", paymentSetting)
const Shipping = mongoose.model("Shipping", shippingSetting)
const Maintenance = mongoose.model("Maintenance", maintenanceSetting)
const ProductStats = mongoose.model('ProductStats', productStatsSchema)
const Profile = mongoose.model('Profile', profileSchema)
const DashboardUser = mongoose.model("DashboardUser", dashboardUserSchema)
const Order = mongoose.model('Order', orderSchema)
const OrderStats = mongoose.model('OrderStats', orderStatsSchema)
const UserStats = mongoose.model('UserStats', userStatsSchema)
const Notification = mongoose.model("Notification", notificationsSchema)

module.exports= {
  User,
 Product,
 StoreInfo,
 Theme,
 Payment,
 Shipping,
 Maintenance,
 ProductStats,
 Profile,
 DashboardUser,
 Order,
 OrderStats,
 UserStats,
 Notification

}