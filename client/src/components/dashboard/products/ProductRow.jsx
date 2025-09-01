import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import DeleteBtn from "./DeleteProduct";
import { FaCircle } from "react-icons/fa";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { fetchWithAuth } from "../utils/fetchWithAuth.js";

const ProductRow = ({ item, product, setProduct, setLoading, theme }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    sku: item.sku,
    productName: item.productName,
    price: item.price,
    stkQuantity: item.stkQuantity,
    category: item.category,
    status: item.status,
    color: item.color,
    size: item.size,
    weight: item.weight,
    gender: item.gender,
    subCategory: item.subCategory,
    slug: item.slug,
    tags: item.tags,
  });
  const [isDropDown, setIsDropDown] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    const qty = parseInt(form.stkQuantity, 10);

    if (qty === 0) {
      setForm((prev) => ({ ...prev, status: "out-of-stock" }));
    } else if (qty <= 5) {
      setForm((prev) => ({ ...prev, status: "low-stock" }));
    } else {
      setForm((prev) => ({ ...prev, status: "active" }));
    }
  }, [form.stkQuantity]);

  const handleSave = async () => {
    const role = localStorage.getItem("role");

    if (role !== "admin") {
      toast.error("You must be an admin to perform this action!");
      return;
    } else {
      const updatedProduct = product.map((t) => {
        if (t._id === item._id) {
          return {
            ...t,
            sku: form.sku,
            productName: form.productName,
            price: form.price,
            stkQuantity: form.stkQuantity,
            category: form.category,
            lastUpdated: new Date().toISOString().slice(0, 10),
            status: form.status,
            color: form.color,
            size: form.size,
            weight: form.weight,
            gender: form.gender,
            subCategory: form.subCategory,
            slug: form.slug,
            tags: form.tags,
            edit: true,
          };
        }
        return t;
      });
      const editedProduct = updatedProduct.find((t) => t._id === item._id);

      setLoading(true);
      try {
        const res = await fetchWithAuth(
          `/api/dashboard/product/editProduct/${editedProduct._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              sku: editedProduct.sku,
              productName: editedProduct.productName,
              price: editedProduct.price,
              stkQuantity: editedProduct.stkQuantity,
              category: editedProduct.category,
              lastUpdated: editedProduct.lastUpdated,
              status: editedProduct.status,
              color: editedProduct.color,
              size: editedProduct.size,
              weight: editedProduct.weight,
              gender: editedProduct.gender,
              subCategory: editedProduct.subCategory,
              slug: editedProduct.slug,
              tags: editedProduct.tags,
              edit: editedProduct.edit,
            }),
          }
        );
        const data = await res.json();
        if (!res.ok) {
          toast.error(
            data.error || "Something went wrong while updating the product."
          );
        } else {
          toast.success(data.message || "product updated successfully");
          setProduct(updatedProduct);
          setIsEditing(false);
        }
        setIsDropDown(false);
      } catch (error) {
        console.log("Error updating product: ", error);
        toast.error(
          "Unable to update this product. Please check your network and try again."
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const handleEditToggle = () => {
    if (isEditing) handleSave();
    setIsEditing((prev) => !prev);
  };

  const toggleDropDown = () => {
    setIsDropDown((prev) => !prev);
  };

  return (
    <>
      <td
        className={` font-medium text-sm p-3 w-30 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {/**Stock keeping unit */}
        {isEditing ? (
          <input
            name="sku"
            value={form.sku}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="w-20 outline-none rounded-sm px-1"
          />
        ) : (
          <p> {item.sku}</p>
        )}
      </td>

      <td
        className={` font-medium text-sm p-3 w-40 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {/**ProductName */}
        {isEditing ? (
          <input
            name="productName"
            value={form.productName}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="w-20 outline-none rounded-sm px-1"
          />
        ) : (
          <p> {item.productName}</p>
        )}
      </td>
      <td
        className={` font-medium text-sm w-32 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {/**category */}
        {isEditing ? (
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="w-20 outline-none rounded-sm px-1"
          >
            <option value="Shoes">Shoes</option>
            <option value="Suits & Jackets">Suits & Jackets</option>
            <option value="Shirts">Shirts</option>
            <option value="Trousers">Trousers</option>
            <option value="Accessories">Accessories</option>
            <option value="Belts">Belts</option>
            <option value="Watches">Watches</option>
            <option value="Bags">Bags</option>
          </select>
        ) : (
          <p>{item.category} </p>
        )}
      </td>

      {/**  subcategory  */}
      <td
        className={` font-medium text-sm text-center w-28 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {isEditing ? (
          <select
            name="subCategory"
            value={form.subCategory}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="w-20 outline-none rounded-sm px-1"
          >
            <option value="Formal suit">Formal suit</option>
            <option value="Tailored suit">Tailored suit</option>
            <option value="Wedding suit">Wedding suit</option>
            <option value="Jackets">Jackets</option>
            <option value="Business suit">Business suit</option>
            <option value="Long sleeve shirts">Long sleeve shirts</option>
            <option value="Short sleeve shirts">Short sleeve shirts</option>
            <option value="Striped shirts">Striped shirts</option>
            <option value="Formal Trousers">Formal Trousers</option>
            <option value="Tailored Trousers">Tailored Trousers</option>
            <option value="Chinos trousers">Chinos trousers</option>
            <option value="Loafer shoes">Loafer shoes</option>
            <option value="Oxford Shoes">Oxford Shoes</option>
            <option value="Leather Shoes">Leather Shoes</option>
            <option value="Leather Bags">Leather Bags</option>
            <option value="Slings & Crossbody Bags">
              Slings & Crossbody Bags
            </option>
            <option value="Work Bags">Work Bags</option>
            <option value="Duffel Bags">Duffel Bags</option>
            <option value="Gold watches">Gold watches</option>
            <option value="Silver watches">Silver watches</option>
            <option value="Wallets">Wallets</option>
            <option value="Bracelets">Bracelets</option>
            <option value="Bowties">Bowties</option>
          </select>
        ) : (
          <p>{item.subCategory}</p>
        )}
      </td>

      {/*Slug
       <td
        className={` font-medium text-sm text-center w-28 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        
        {isEditing ? (
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="m-1 text-center w-20 outline-none rounded-sm px-1"
          />
        ) : (
          <p>{item.slug}</p>
        )}
      </td>*/}

      {/*tags  
      <td
        className={` font-medium text-sm text-center w-28 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        
        {isEditing ? (
          <input
            name="tags"
            value={form.tags}
            onChange={(e) =>
          setForm({
            ...form,
            tags: e.target.value.split(",").map((c) => c.trim()),
          })
        }
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="m-1 text-center w-20 outline-none rounded-sm px-1"
          />
        ) : (
          <p>{item.tags.join(", ") }</p>
        )}
      </td>
   **/}

      {/**Price */}
      <td
        className={` font-medium text-sm text-center w-28 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {isEditing ? (
          <input
            name="price"
            value={form.price}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="m-1 text-center w-20 outline-none rounded-sm px-1"
          />
        ) : (
          <p>${item.price}</p>
        )}
      </td>

      {/**Weight */}
      <td
        className={` font-medium text-sm text-center w-28 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {isEditing ? (
          <input
            name="weight"
            value={form.weight}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="m-1 text-center w-20 outline-none rounded-sm px-1"
          />
        ) : (
          <p>{item.weight} kg</p>
        )}
      </td>

      {/**Stock Quantity */}
      <td
        className={` font-medium text-sm text-center w-28 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {isEditing ? (
          <input
            name="stkQuantity"
            value={form.stkQuantity}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="m-1 text-center w-20 outline-none rounded-sm px-1"
          />
        ) : (
          <p> {item.stkQuantity}</p>
        )}
      </td>
      <td className=" w-32 ">
        {/**Status */}

        {item.status === "active" ? (
          <span
            className={`flex items-center justify-center gap-2 text-sm  font-medium  ${
              theme ? "headerDark" : "headerLight"
            }`}
          >
            <FaCircle className="text-green-500 text-xs" />
            active
          </span>
        ) : item.status === "low-stock" ? (
          <span
            className={`flex items-center justify-center gap-2 text-sm  font-medium  ${
              theme ? "headerDark" : "headerLight"
            }`}
          >
            <FaCircle className="text-yellow-500 text-xs" />
            low-stock
          </span>
        ) : item.status === "out-of-stock" ? (
          <span
            className={`flex items-center justify-center gap-2 text-sm  font-medium  ${
              theme ? "headerDark" : "headerLight"
            }`}
          >
            <FaCircle className="text-red-500 text-xs" />
            out-of-stock
          </span>
        ) : (
          <span className="text-gray-500"> Unknown</span>
        )}
      </td>
      {/**Color */}
      <td
        className={` font-medium text-sm p-3 text-center w-24 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {isEditing ? (
          <input
            name="color"
            value={form.color}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="w-20 outline-none rounded-sm px-1 text-center"
          />
        ) : (
          <p> {item.color}</p>
        )}
      </td>

      {/**size */}
      <td
        className={` font-medium text-sm p-y text-center w-20  ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {isEditing ? (
          <input
            name="size"
            value={form.size}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="w-20 outline-none rounded-sm px-1 text-center"
          />
        ) : (
          <p> {item.size}</p>
        )}
      </td>

      {/**gender */}
      <td
        className={` font-medium text-sm p-3 text-center w-24 ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        {isEditing ? (
          <input
            name="gender"
            value={form.gender}
            onChange={handleChange}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
            className="w-20 outline-none rounded-sm px-1 text-center"
          />
        ) : (
          <p> {item.gender}</p>
        )}
      </td>

      {/*Actions*/}
      <td
        className={` font-medium text-sm py-3  text-center   ${
          theme ? "headerDark" : "headerLight"
        }`}
      >
        <div className="relative inline-block text-left">
          <button
            onClick={toggleDropDown}
            className={`flex items-center justify-center border text-center px-4 py-2 rounded-lg ${
              isDropDown ? "text-yellow-600" : ""
            } `}
          >
            Actions{" "}
            {isDropDown ? (
              <RiArrowDropDownLine className="font-medium text-lg" />
            ) : (
              <RiArrowDropUpLine className="font-medium text-lg" />
            )}
          </button>
          {isDropDown && (
            <div
              className={`absolute right-0 mt-2 w-32 bg-red border 
                 rounded shadow-md z-10  `}
              style={{
                background: `${
                  theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"
                } `,
              }}
            >
              <div>
                {isEditing ? (
                  <>
                    <button
                      onClick={handleEditToggle}
                      className={`w-full px-4 py-2 border-b ${
                        theme ? "border-[#3d4b55]" : "border-gray-300"
                      } text-center hover:bg-orange-400 focus:text-grey-400`}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setForm({
                          sku: item.sku,
                          productName: item.productName,
                          price: item.price,
                          stkQuantity: item.stkQuantity,
                          category: item.category,
                          subCategory: item.subCategory,
                          status: item.status,
                          slug: item.slug,
                          tags: item.tags,
                          color: item.color,
                          size: item.size,
                          gender: item.gender,
                        });
                        setIsEditing(false);
                        setIsDropDown(false);
                      }}
                      className={`w-full px-4 py-2 border-b ${
                        theme ? "border-[#3d4b55]" : "border-gray-300"
                      } text-center hover:bg-gray-300 text-red-500`}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEditToggle}
                    className={`w-full px-4 py-2 border-b ${
                      theme ? "border-[#3d4b55]" : "border-gray-300"
                    } text-center  hover:bg-orange-400 focus:text-grey-400`}
                  >
                    Edit
                  </button>
                )}
              </div>
              <DeleteBtn
                item={item}
                product={product}
                setProduct={setProduct}
                setLoading={setLoading}
              />
            </div>
          )}
        </div>
      </td>
    </>
  );
};

export default ProductRow;
