import { useState, useEffect } from "react";
import { FaArrowUpLong, FaArrowDownLong } from "react-icons/fa6";
import allProductSvg from "../../reuseable/svg/allProduct.svg";
import activeProductSvg from "../../reuseable/svg/activeProduct.svg";
import lowStockProductSvg from "../../reuseable/svg/lowStockProduct.svg";
import emptyProductSvg from "../../reuseable/svg/emptyProduct.svg";

const StockReport = ({
  theme,
  product,
  previousCount,
  previousActiveCount,
  previousLowStockCount,
  previousOutOfStockCount,
}) => {
  const [formattedProduct, setFormattedProduct] = useState("0");
  const [formattedChange, setFormattedChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [formattedActiveProduct, setFormattedActiveProduct] = useState("0");
  const [formattedActiveChange, setFormattedActiveChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [formattedLowStockProduct, setFormattedLowStockProduct] = useState("0");
  const [formattedLowStockChange, setFormattedLowStockChange] = useState({
    value: "0.0",
    isPositive: true,
  });
  const [formattedOutOfStockProduct, setFormattedOutOfStockProduct] =
    useState("0");
  const [formattedOutOfStockChange, setFormattedOutOfStockChange] = useState({
    value: "0.0",
    isPositive: true,
  });

  useEffect(() => {
    {
      /*all Porducts*/
    }
    const calculateProductStats = () => {
      const currentCount = product.length;

      const percentageChange =
        previousCount === 0
          ? 100 //avoid division by 0
          : ((currentCount - previousCount) / previousCount) * 100;

      setFormattedProduct(currentCount.toLocaleString());
      setFormattedChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateProductStats();

    {
      /*active products*/
    }
    const calculateActiveStats = () => {
      const currentActiveProducts = product.filter(
        (p) => p && p.status === "active"
      ).length;

      const percentageChange =
        previousActiveCount === 0
          ? 100
          : ((currentActiveProducts - previousActiveCount) /
              previousActiveCount) *
            100;

      setFormattedActiveProduct(currentActiveProducts.toString());
      setFormattedActiveChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateActiveStats();

    {
      /*Low stock products*/
    }
    const calculateLowStockStats = () => {
      const currentLowStockProducts = product.filter(
        (p) => p && p.status === "low-stock"
      ).length;

      const percentageChange =
        previousLowStockCount === 0
          ? 100
          : ((currentLowStockProducts - previousLowStockCount) /
              previousLowStockCount) *
            100;

      setFormattedLowStockProduct(currentLowStockProducts.toString());
      setFormattedLowStockChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateLowStockStats();

    {
      /*out of stock products*/
    }
    const calculateOutOfStockStats = () => {
      const currentOutOfStockProducts = product.filter(
        (p) => p && p.status === "out-of-stock"
      ).length;

      const percentageChange =
        previousOutOfStockCount === 0
          ? 100
          : ((currentOutOfStockProducts - previousOutOfStockCount) /
              previousOutOfStockCount) *
            100;

      

      setFormattedOutOfStockProduct(currentOutOfStockProducts.toString());
      setFormattedOutOfStockChange({
        value: Math.abs(percentageChange).toFixed(1),
        isPositive: percentageChange >= 0,
      });
    };
    calculateOutOfStockStats();
  }, [
    product,
    previousCount,
    previousActiveCount,
    previousLowStockCount,
    previousOutOfStockCount,
  ]);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4  my-5">
        {/*All products*/}
        <div
          className={`flex flex-col md:flex-row lg:flex-col md:h-62 lg:h-73 p-5 rounded-lg border ${
            theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
          } `}
          style={{
            background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
          }}
        >
          <div>
            <p className="text-xs">Total Products</p>

            <p className="flex gap-5 md:justify-between lg:justify-start items-center ">
              <span
                className={`text-2xl font-bold  ${
                  theme ? "headerDark" : "headerLight"
                } `}
              >
                {formattedProduct}{" "}
              </span>
              <span
                className={`text-xs flex items-center ${
                  formattedChange.isPositive ? "text-green-500" : "text-red-500"
                } `}
              >
                {formattedChange.isPositive ? (
                  <>
                    {" "}
                    <FaArrowUpLong /> +
                  </>
                ) : (
                  <>
                    {" "}
                    <FaArrowDownLong /> -
                  </>
                )}
                {formattedChange.value}%{" "}
              </span>
            </p>
          </div>
          <img
            src={allProductSvg}
            alt="All product svg"
            className="w-62 h-62 m-auto md:w-52 lg:m-0 "
          />
        </div>

        {/*Active products*/}
        <div
          className={`flex flex-col md:flex-row lg:flex-col  p-5 md:h-62 lg:h-73 rounded-lg border ${
            theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
          } `}
          style={{
            background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
          }}
        >
          <div>
            <p className="text-xs">Active Products</p>

            <p className="flex gap-5 md:justify-between lg:justify-start items-center">
              <span
                className={`text-2xl font-bold ${
                  theme ? "headerDark" : "headerLight"
                } `}
              >
                {formattedActiveProduct}{" "}
              </span>
              <span
                className={`text-xs flex items-center ${
                  formattedActiveChange.isPositive
                    ? "text-green-500"
                    : "text-red-500"
                } `}
              >
                {formattedActiveChange.isPositive ? (
                  <>
                    {" "}
                    <FaArrowUpLong /> +
                  </>
                ) : (
                  <>
                    {" "}
                    <FaArrowDownLong /> -
                  </>
                )}
                {formattedActiveChange.value}%{" "}
              </span>
            </p>
          </div>

          <img
            src={activeProductSvg}
            alt="activeproducts"
            className="w-62 h-auto m-auto md:w-52 lg:m-0"
          />
        </div>

        {/*Low stock*/}
        <div
          className={`relative flex flex-col   p-5 md:h-62 lg:h-73 rounded-lg border ${
            theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
          } `}
          style={{
            background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
          }}
        >
          <div>
            <p className="text-xs">Low Stock</p>

            <p className="flex items-center gap-5">
              <span
                className={`text-2xl font-bold  ${
                  theme ? "headerDark" : "headerLight"
                } `}
              >
                {formattedLowStockProduct}
              </span>
              <span
                className={`text-xs flex items-center font-medium ${
                  formattedLowStockChange.isPositive
                    ? "text-yellow-500"
                    : "text-green-500"
                } `}
              >
                {formattedLowStockChange.isPositive ? (
                  <>
                    {" "}
                    <FaArrowUpLong /> +
                  </>
                ) : (
                  <>
                    {" "}
                    <FaArrowDownLong /> -
                  </>
                )}{" "}
                {formattedLowStockChange.value}%
              </span>
            </p>
          </div>
          <img
            src={lowStockProductSvg}
            alt="activeproducts"
            className="mx-auto md:absolute md:right-8 md:top-7 lg:static w-52 h-52  md:w-52 "
          />
        </div>

        {/*Out of stock*/}
        <div
          className={`flex flex-col    p-5 md:h-62 lg:h-73 rounded-lg border ${
            theme ? "border-[#3d4b55]" : "border-gray-300  shadow-sm "
          } `}
          style={{
            background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
          }}
        >
          <div>
            <p className="text-xs">Out of Stock</p>

            <p className="flex  items-center gap-5">
              <span
                className={`text-2xl font-bold  ${
                  theme ? "headerDark" : "headerLight"
                } `}
              >
                {formattedOutOfStockProduct}{" "}
              </span>

              <span
                className={`text-xs flex items-center ${
                  formattedOutOfStockChange.isPositive
                    ? "text-red-400"
                    : "text-green-500"
                } `}
              >
                {formattedOutOfStockChange.isPositive ? (
                  <>
                    {" "}
                    <FaArrowUpLong /> +
                  </>
                ) : (
                  <>
                    {" "}
                    <FaArrowDownLong /> -
                  </>
                )}{" "}
                {formattedOutOfStockChange.value}%
              </span>
            </p>
          </div>

          <img
            src={emptyProductSvg}
            alt="activeproducts"
            className="w-82 h-62 m-auto md:w-52 lg:w-72 "
          />
        </div>
      </div>
    </div>
  );
};
export default StockReport;
