import React from "react";
import { GiBowTie } from "react-icons/gi"; // replaced globe with bow tie for niche
import { FaOpencart } from "react-icons/fa6";

const ShopsphereLogo = ({ className = "", links = "" }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <a href={links} className="flex items-center space-x-1">
        <span className="  tracking-wide flex items-center gap-1">
          Sh
          <GiBowTie className="text-amber-700" />
          psphere
          <FaOpencart className="text-amber-700" />
        </span>
      </a>
     {/*} <p className="text-sm text-gray-500 italic ml-1">
        Where Modern Gentlemen Shop
      </p> */}
    </div>
  );
};

export default ShopsphereLogo;

