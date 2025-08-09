import React from "react";
import ShopsphereLogo from "../../reuseable/ShopsphereLogo";

const MaintenancePage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-center px-4 py-10">
      <div className="max-w-md w-full space-y-6">
        {/* Logo */}
        <div className="flex justify-center">
          <ShopsphereLogo className="text-4xl font-semibold text-gray-800" />
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-red-600">
          🚧 We’ll Be Right Back!
        </h1>

        {/* Message */}
        <p className="text-gray-600 text-base sm:text-lg">
          Shopsphere is currently undergoing scheduled maintenance to improve your shopping experience. We appreciate your patience and will be back online shortly.
        </p>

        {/* Optional Footer Note */}
        <p className="text-sm text-gray-400 mt-6">
          &copy; {new Date().getFullYear()} Shopsphere. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default MaintenancePage;
