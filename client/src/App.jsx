import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchExternal } from "./components/dashboard/utils/fetchExternal.js";
import { toast } from "react-toastify";
//dashboard route
import Dashboard from "./components/dashboard/analytics/Dashboard";
import Products from "./components/dashboard/products/Products";
import Orders from "./components/dashboard//orders/Order";
import Customers from "./components/dashboard/customers/Customers";
import Setting from "./components/dashboard/settings/Settings";
import MaintenancePage from "./components/dashboard/settings/MaintenancePage"
import DashboardLogin from "./components/dashboard/auth/DashboardLogin.jsx";
import MainDash from "./components/dashboard/MainDash";
//mainsite routes
import Register from "./components/mainSite/auth/SignUp.jsx";
import SignIn from "./components/mainSite/auth/SignIn";
import ForgotPwd from "./components/mainSite/auth/ForgotPwd";
import ResetPwd from "./components/mainSite/auth/resetPwd";
import Phone from "./components/mainSite/auth/Phone"
import Hero from "./components/mainSite/hero/Hero.jsx"
import ItemPage from "./components/mainSite/item/ItemPage.jsx"
import Checkout from "./components/mainSite/checkout/Checkout.jsx"
import TrackOrder from "./components/mainSite/checkout/TrackOrder.jsx"
import AllProducts from "./components/mainSite/allProducts/AllProducts.jsx"
import Category from "./components/mainSite/allProducts/Category.jsx"
import NotFound from "./components/mainSite/NotFound/notFound.jsx"








import MainSite from "./components/mainSite/MainSite.jsx";





function App() {
  const [maintenance, setMaintenance] = useState(false);
  const [products, setProducts] = useState([])
  useEffect(() => {
    const fetchSettings = async () => {
       const token = localStorage.getItem("authToken");
    if (!token) return; // ⛔ Don't fetch if user is not logged in
      try {
        const res = await fetchExternal(
          "/api/dashboard/settings/maintenance"
        );
        const data = await res.json();
        setMaintenance(data?.maintenance);
       
      } catch (err) {
         //toast.error("Failed to initate maintenance mode, please check your network!")
      }
    };

    fetchSettings();
  }, []);//*/




  return (
    <div className=" min-h-screen">
      <Router>
        {/*Tasts go here */}
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
        <Routes>
          {/* Dashboard */}
          <Route
            path="/dashboard/dashboard-login"
            element={<DashboardLogin />}
          />
          <Route
            path="/dashboard"
            element={
              <MainDash>
                <Dashboard />
              </MainDash>
            }
          />
          <Route
            path="/dashboard/products"
            element={
              <MainDash>
                <Products />
              </MainDash>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <MainDash>
                <Orders />
              </MainDash>
            }
          />
          <Route
            path="/dashboard/customers"
            element={
              <MainDash>
                <Customers />
              </MainDash>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <MainDash>
                <Setting
                  maintenance={maintenance}
                  setMaintenance={setMaintenance}
                />
              </MainDash>
            }
          />

          {maintenance ? (
                <Route path="*" element={<MaintenancePage />} />
            ):(
            <>
{/*Mainsite routes*/}
          <Route path="/sign-up" element={<Register />} />
          <Route path="/tel-phone/:token" element={<Phone/>} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/forgot-password" element={<ForgotPwd />} />
          <Route path="/reset-password/:token" element={  <ResetPwd /> } />
          <Route path="/" element={ <MainSite> <Hero/> </MainSite>} />
          <Route path="/:slug" element={<MainSite> <ItemPage/> </MainSite>} />
          <Route path="/checkout" element={<MainSite noSidebar={true}> <Checkout/> </MainSite>} />
          <Route path="/track-order/:orderNumber" element={<MainSite noSidebar={true}> <TrackOrder /> </MainSite>} />
          <Route path="/products/category/all" element={<MainSite><AllProducts/> </MainSite>} />
          <Route path="/products/category/:category" element={<MainSite><Category/> </MainSite>} />
            <Route path="*" element={<MainSite><NotFound/> </MainSite>} />

            </>
            )}

          

             
          





        </Routes>
      </Router>
    </div>
  );
}

export default App;