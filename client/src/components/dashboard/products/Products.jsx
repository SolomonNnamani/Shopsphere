import React, { useState, useEffect } from "react";
import AddProduct from "./AddProduct";
import ProductRow from "./ProductRow";
import StockReport from "./StockReport";
import { FaSearch } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import {fetchWithAuth} from '../utils/fetchWithAuth.js';
import Pagination from "../../reuseable/Pagination";

const Products = ({ theme, loading, setLoading, setError }) => {
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState([

    ]);
  const [filteredProducts, setFilteredProducts] = useState(product);
  const [previousCount, setPreviousCount] = useState(0);
  const [previousActiveCount, setPreviousActiveCount] = useState(0);
  const [previousLowStockCount, setPreviousLowStockCount] = useState(0);
  const [previousOutOfStockCount, setPreviousOutOfStockCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1)
  

  //GET request
  useEffect(() => {
    const fetchAllProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchWithAuth(
          "/api/dashboard/products"
        );
        if (!res) return;
        const data = await res.json();

       // setProduct(data.products);
      
        const normalizedProducts = data?.products.map((p)=> ({
          ...p,
          weight: p.weight || "",
          //slugs:p.slugs || "",
          //tags:Array.isArray(p.tags) ? p.tags : []
        }))
        
          setProduct(normalizedProducts || [])
        setPreviousCount(data?.previousCount || 0);
        setPreviousActiveCount(data?.previousActiveCount || 0);
        setPreviousLowStockCount(data?.previousLowStockCount || 0);
        setPreviousOutOfStockCount(data?.previousOutOfStockCount || 0);
      } catch (error) {
        console.log("Failed to fetch products:", error);
        setError("Failed to load products, please check your network!");
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []); //*/

  const handleChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1)
  };

  useEffect(() => {
    const filtered = product.filter((item) => {
      return (
         item.sku.toLowerCase().match(search.toLowerCase()) ||
        item.productName.toLowerCase().match(search.toLowerCase()) ||
        item.category.toLowerCase().match(search.toLowerCase()) ||
        item.status.toLowerCase().match(search.toLowerCase()) ||
        String(item.price).toLowerCase().match(search.toLowerCase()) ||
        String(item.stkQuantity).toLowerCase().match(search.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  }, [search, product]);

  const handleToggle = () => {
    setVisible((prev) => !prev);
  };

  //Pagination
  const itemsPerPage = 10; //  Customize how many items per page
  const indexOfLastItem = currentPage * itemsPerPage; //1 * 10 = 10
  const indexOfFirstItem = indexOfLastItem - itemsPerPage; // 10-10 = 0
  const currentProducts = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  ); //slice(0,10)
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); //Math.ceil(15/10) = 2 paginated pages
  

  return (
    <div className="py-5 px-3 md:px-2 lg:px-30">
      <div>
        <small className="text-xs">Manage your product with ease</small>
        <p
          className={`text-2xl font-bold ${
            theme ? "headerDark" : "headerLight"
          }`}
        >
          Product Management
        </p>
      </div>

      {/*grid*/}
      <StockReport
        theme={theme}
        product={product}
        previousCount={previousCount}
        previousActiveCount={previousActiveCount}
        previousLowStockCount={previousLowStockCount}
        previousOutOfStockCount={previousOutOfStockCount}
      />

      <div
        className={`my-5 rounded-lg border ${
          theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
        } `}
        style={{
          background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
        }}
      >
        <h2
          className={`text-lg font-bold p-3 ${
            theme ? "headerDark" : "headerLight"
          }`}
        >
          Products
        </h2>

        <div
          className={`flex  justify-between  p-2 border-y ${
            theme ? "border-[#3d4b55]" : "border-gray-300  "
          } `}
        >
          {/**Search input */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="search"
              value={search}
              placeholder=" search products..."
              onChange={handleChange}
              className={` w-[12rem] md:w-[15rem] h-[2.4rem] p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${
              theme ? "placeholder:text-white " : "placeholder:text-slate-300"
            }  `}
              style={{
                background: `${
                  theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
                } `,
              }}
            />
            <FaSearch className="text-2xl " />
          </div>

          <button
            onClick={handleToggle}
            className="bg-amber-700 hover:bg-amber-800 rounded-lg text-white text-xs md:text-sm flex items-center justify-center p-2 font-bold 
         active:scale-95 transition-transform duration-100 w-10 md:w-35  gap-1 "
          >
            <IoMdAdd className="font-bold text-lg " /> <span className="hidden md:flex "> Add Product </span>{" "}
          </button>
        </div>
        <AddProduct
          handleToggle={handleToggle}
          visible={visible}
          loading={loading}
          setLoading={setLoading}
          theme={theme}
        />

        {/***Product table */}
        <div className=" w-full min-h-screen overflow-x-scroll hide-scrollbar-lg ">
          <table className="table-fixed min-w-[800px] w-full text-left border-collapse">
            <thead>
              <tr className="">
              <th className="p-3 w-30 ">SKU</th>
                <th className="p-3 w-40">Product Name</th>
                <th className="py-3 w-32">Category</th>
                <th className="py-3 w-32">Sub-Category</th>
               {/* <th className="py-3 w-32">Slugs</th>
                <th className="py-3 w-32">Tags</th>  */}
                <th className="py-3 w-28 text-center">Price ($)</th>
                <th className="py-3 w-28 text-center">Weight </th>
                <th className="py-3 w-28 text-center">Stock Quantity</th>
                <th className="py-3 w-32 text-center">Status</th>
                <th className="py-3 w-24 text-center">Color</th>
                <th className="py-3 w-20 text-center">Size</th>
                <th className="py-3 w-24 text-center">Gender</th>
                <th className="p-3 w-30 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((item) => (
                  <tr
                    key={item._id}
                    className={`border-y  ${
                      theme ? "border-[#3d4b55]" : "border-gray-300 "
                    }`}
                  >
                    <ProductRow
                      item={item}
                      product={product}
                      setProduct={setProduct}
                      setLoading={setLoading}
                      theme={theme}
                    />
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center  py-4 text-gray-500">
                    No availabe product
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    <Pagination
    currentPage = {currentPage}
    total = {totalPages}
    setCurrentPage={setCurrentPage}
     />
    
  

    </div>
  );
};

export default Products;
