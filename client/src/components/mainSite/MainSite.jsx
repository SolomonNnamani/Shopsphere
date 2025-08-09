import React, { useState, useEffect } from "react";
import AnimatedLogo from "../reuseable/AnimatedLogo";
import Sidebar from './sidebar/Sidebar'
import Footer from './footer/Footer'

const MainSite = ({ children, noSidebar = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
   const [toggleCart, setToggleCart]  = useState(false)
   const [cartItems, setCartItems] = useState([])

  // Catch network errors globally
  useEffect(() => {
    const handleError = (event) => {
      setError("Network error. Check your internet connection.");
      event.preventDefault();
    };

    window.addEventListener('unhandledrejection', handleError);
    return () => window.removeEventListener('unhandledrejection', handleError);
  }, []);

  useEffect(()=> {
    const saved = JSON.parse(localStorage.getItem('cart')) || []
    setCartItems(saved)
  },[]) 

  return (
    <div className="relative  ">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center w-full text-5xl bg-black/30 backdrop-blur-sm z-50">
          <AnimatedLogo className="text-orange-500" />
        </div>
      )}

      {error && (
        <div className="fixed inset-0 flex items-center justify-center w-full bg-black/50 backdrop-blur-sm z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <p className="mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-orange-500 text-white px-4 py-2 rounded"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

{/* Conditionally hide Sidebar */}
    {!noSidebar && (
<Sidebar 
      setLoading={setLoading} 
      setError={setError} 
      toggleCart={toggleCart} 
      setToggleCart={setToggleCart} 
      cartItems={cartItems}
      setCartItems={setCartItems}
      />
      )}  
      <div className="">
        {React.Children.map(children, (child) =>
          React.isValidElement(child)
            ? React.cloneElement(child, { 
              setLoading,
               setError,
               toggleCart,
                setToggleCart,
                 cartItems,
                  setCartItems
                   })
            : child
        )}
      </div>
      
 <Footer
 setLoading={setLoading} 
      setError={setError} 
 />
      
     
    </div>
  );
};

export default MainSite;
