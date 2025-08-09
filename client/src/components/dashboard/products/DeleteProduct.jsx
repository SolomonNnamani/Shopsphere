import React, { useState } from "react";
import { toast } from "react-toastify";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'

const DeleteProduct = ({ item, product, setProduct, setLoading }) => {
  const handleClick = async () => {
     const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{

    const confirmDelete = window.confirm(
      `Are you sure you want to delete "${item.productName}"?`
    );
    if (!confirmDelete) return;

    setLoading(true);
    try {
      const res = await fetchWithAuth(
        `/api/dashboard/product/delete/${item._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) {
        toast.error("Failed to delete product, Please try again.");
      } else {
        const deleteProduct = product.filter((t) => t._id !== item._id);
        setProduct(deleteProduct);
        toast.success(`"${item.productName}" was deleted successfully`);
      }
    } catch (error) {
      console.log("Error deleting product: ", error);
      toast.error("Network error: Unable to delete product");
    } finally {
      setLoading(false);
    }
  }
  };
  return (
    <div className="px-4 py-2 text-center focus:text-orange-400">
      <button onClick={handleClick}>Delete</button>
    </div>
  );
};

export default DeleteProduct;
