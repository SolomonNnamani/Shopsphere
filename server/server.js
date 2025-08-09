const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const googleAuthRoutes = require("./controller/mainSite/Auth/google");
const register = require("./controller/mainSite/Auth/signUp.js")
const login = require("./controller/mainSite/Auth/signIn.js")
const forgotPwd = require("./controller/mainSite/Auth/forgotpwd.js")
const resetPwd = require("./controller/mainSite/Auth/resetpwd.js")
const phone = require("./controller/mainSite/Auth/phone.js")
const payment = require('./controller/mainSite/payment/payment.js')
const order = require('./controller/mainSite/payment/order.js')

const addProduct = require('./controller/dashboard/products/addProduct.js')
const editProduct = require('./controller/dashboard/products/editProduct.js')
const deleteProduct = require('./controller/dashboard/products/deleteProduct.js')
const storeInformation = require('./controller/dashboard/settings/storeinfo.js')
const themeSetting = require('./controller/dashboard/settings/themeSetting.js')
const paymentSetting = require('./controller/dashboard/settings/paymentSetting.js')
const shippingSetting =  require('./controller/dashboard/settings/shippingSetting.js')
const maintenanceSetting =  require('./controller/dashboard/settings/maintenanceSetting.js')
const profile = require('./controller/dashboard/profile/profile.js')
const dashboardLogin = require('./controller/dashboard/auth/dashboardLogin.js')
const dashboardGuest = require('./controller/dashboard/auth/dashboardGuest.js')
//const manualSnapshot = require('./controller/dashboard/products/manualSnapshot.js');
//const manualReg = require('./controller/dashboard/auth/manualReg')
const fetchOrders = require('./controller/dashboard/orders/fetchOrders.js')
const fetchCustomers = require('./controller/dashboard/customers/fetchCustomers.js')
const notifications = require('./controller/dashboard/notifications/notification.js')



const cors = require("cors");
const passport = require('passport');
require('./utils/passport.js')
require('./cron/dailySnapshot')


const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins =[
	process.env.FRONTEND_DEV,
  process.env.FRONTEND_PROD
];



app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize())



//Dashboard
addProduct(app)
editProduct(app)
deleteProduct(app)
storeInformation(app)
themeSetting(app)
paymentSetting(app)
shippingSetting(app)
maintenanceSetting(app)
//manualSnapshot(app);
profile(app)
dashboardLogin(app)
dashboardGuest(app)
//manualReg(app)
fetchOrders(app)
fetchCustomers(app)
notifications(app)


//Main website Authetication
googleAuthRoutes(app);
register(app)
login(app)
forgotPwd(app)
resetPwd(app)
phone(app)
payment(app)
order(app)


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
