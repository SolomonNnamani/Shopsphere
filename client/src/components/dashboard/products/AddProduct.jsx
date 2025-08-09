import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import AnimatedLogo from "../../reuseable/AnimatedLogo";
import { RiArrowDropDownLine } from "react-icons/ri";
import {fetchWithAuth} from '../utils/fetchWithAuth.js'

const AddProduct = ({ theme, visible, handleToggle, loading, setLoading }) => {
  const [formProd, setFormProd] = useState({
    productName: "",
    category: "",
    subCategory:"",
    price: "",
    stkQuantity: "",
     status: "",
     color:"",
    size:"",
    weight:"",
    material:"",
    style:"",
    fitType:"",
    gender: "",
    brand:"",
    sku:"",
    slug:"",
    mainImage: null,
    galleryImages: [],
    description: "",
    tags:[]
   


  });
  const [error, setError] = useState({
    productName: "",
    category: "",
    subCategory:"",
    price: "",
    stkQuantity: "",
     status: "",
     color:"",
    size:"",
    weight:"",
    material:"",
    style:"",
    fitType:"",
    gender: "",
    brand:"",
    sku:"",
     slug:"",
    mainImage: "",
    galleryImages: "",
    description: "",
    tags:""
  

  });
  const [preview, setPreview] = useState({
    mainImage: null,
    galleryImages: [],
  });
  const mainImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, valueAsNumber } = e.target;
    const val = type === "number" ? (value === "" ? "" : valueAsNumber) : value;
    setFormProd((prev) => ({ ...prev, [name]: val }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "mainImage") {
      const file = files[0];
      setFormProd((prev) => ({ ...prev, mainImage: file }));

      const imageUrl = URL.createObjectURL(file);
      setPreview((prev) => ({ ...prev, mainImage: imageUrl }));
    }

    if (name === "galleryImages") {
      const filez = Array.from(files);
      setFormProd((prev) => ({ ...prev, galleryImages: filez }));

      const galleryPreviews = filez.map((file) => URL.createObjectURL(file));
      setPreview((prev) => ({ ...prev, galleryImages: galleryPreviews }));
    }
  };

  const validationForm = () => {
    const {
      productName,
      category,
      subCategory,
      price,
      stkQuantity,
       status,
       color,
    size,
    weight,
    gender,
    sku,
    slug,
      mainImage,
      galleryImages,
      description,
      tags,
    } = formProd;
    const errors = {
      productName: "",
      category: "",
      subCategory:"",
      price: "",
      stkQuantity: "",
       status: "",
       color:"",
    size:"",
    gender: "",
    sku:"",
    slug:"",
      mainImage: "",
      galleryImages: "",
      description: "",
      tags:"",
    };
    let isValid = true;
    //productName
    if (productName.trim() === "") {
      errors.productName = "Product name is required";
      isValid = false;
    }
    //category
    if (!category) {
      errors.category = "Please select a category.";
      isValid = false;
    }
     //subCategory
    if (!subCategory) {
      errors.subCategory = "Please select a subCategory.";
      isValid = false;
    }
    //price
    if (!price) {
      errors.price = "Valid price is required";
      isValid = false;
    } else if (isNaN(price)) {
      errors.price = "please type in a valid number";
      isValid = false;
    }
    //stock quatity
    if (
      stkQuantity === "" ||
      stkQuantity === null ||
      stkQuantity === undefined
    ) {
      errors.stkQuantity = "Valid stock quantity is required.";
      isValid = false;
    } else if (isNaN(stkQuantity)) {
      errors.stkQuantity = "please type in a valid number";
      isValid = false;
    }
      //color
    if (color.trim() === "") {
      errors.color = "Product color is required";
      isValid = false;
    }

     //size
    if (size.trim() === "") {
      errors.size = "Product size  is required";
      isValid = false;
    }

     //weight
    if (!weight) {
      errors.weight = "Product weight is required";
      isValid = false;
    } else if (isNaN(weight)) {
      errors.weight = "Please type in a valid number";
      isValid = false;
    }

     //gender
    if (gender.trim() === "") {
      errors.gender = "Product's gender is required";
      isValid = false;
    }

      //sku
    if (sku.trim() === "") {
      errors.sku = "Please input product sku!";
      isValid = false;
    }

     //slug
    if (!slug) {
      errors.slug = "Slug must not be empty.";
      isValid = false;
    }

    //image
    if (!mainImage) {
      errors.mainImage = "Display image is required";
      isValid = false;
    }
    //galleryImages
    if (galleryImages.length === 0) {
      errors.galleryImages = "At least one gallery image is required";
      isValid = false;
    }

    //description
    if (!description) {
      console.log("description")
      errors.description = "Description cannot be empty";
      isValid = false;
    }

     //tags
    if (tags.length === 0) {
      console.log("tags")
      errors.tags = "Please select tags for this product.";
      isValid = false;
    }

    setError(errors);
    return isValid;
  };

  useEffect(() => {
    const qty = parseInt(formProd.stkQuantity, 10);

    if (qty === 0) {
      setFormProd((prev) => ({ ...prev, status: "out-of-stock" }));
    } else if (qty <= 5) {
      setFormProd((prev) => ({ ...prev, status: "low-stock" }));
    } else {
      setFormProd((prev) => ({ ...prev, status: "active" }));
    }
  }, [formProd.stkQuantity]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const role = localStorage.getItem("role");

    if(role !== "admin"){
      toast.error("You must be an admin to perform this action!")
      return
    }else{

    const isValid = validationForm();
    if (!isValid) return;
    setLoading(true);
    const {
      productName,
      category,
      subCategory,
      price,
       status,
      stkQuantity,
      color,
       size,
       weight,
    material,
    style,
    fitType,
    gender,
    brand,
    sku,
    slug,
      mainImage,
      galleryImages,
      description,
      tags,
      createdAt,
      lastUpdated,
    } = formProd;

    try {
      //Upload main image to Cloudinary
      const mainForm = new FormData();
      mainForm.append("file", mainImage);
      mainForm.append("upload_preset", "shopSphere_upload");

      const mainRes = await fetch(
        "https://api.cloudinary.com/v1_1/diwn1spcp/image/upload",
        {
          method: "POST",
          body: mainForm,
        }
      );

      const mainData = await mainRes.json();
      const mainImageUrl = mainData.secure_url;

      //upload gallery images
      const galleryImageUrls = [];
      for (const image of galleryImages) {
        const galleryForm = new FormData();
        galleryForm.append("file", image);
        galleryForm.append("upload_preset", "shopSphere_upload");

        const galleryRes = await fetch(
          "https://api.cloudinary.com/v1_1/diwn1spcp/image/upload",
          {
            method: "POST",
            body: galleryForm,
          }
        );
        const galleryData = await galleryRes.json();
        galleryImageUrls.push(galleryData.secure_url);
      }
     

      //Send everything to backend
      const res = await fetchWithAuth(
        "/api/dashboard/product/addproduct",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName,
            category,
            subCategory,
            price,
            stkQuantity,
            color,
             size,
             weight,
             material,
             style,
             fitType,
             gender,
             brand,
             sku,
             slug,
            mainImage: mainImageUrl,
            galleryImages: galleryImageUrls,
            description,
            tags,
            status,
          }),
        }
      );
      const data = await res.json();
      if (data.message) {
        toast.success("New product added successfully");
      }
      setFormProd((prev) => ({
        ...prev,
        productName: "",
        category: "",
        subCategory:"",
        price: "",
        stkQuantity: "",
        color:"",
        size:"",
        weight:"",
    material:"",
    style:"",
    fitType:"",
    gender: "",
    brand:"",
    sku:"",
    slug:"",
        mainImage: null,
        galleryImages: [],
        description: "",
        tags:[]
      }));
      setPreview({
        mainImage: null,
        galleryImages: [],
      }); //*/

      // Reset file inputs manually
      if (mainImageRef.current) mainImageRef.current.value = "";
      if (galleryImagesRef.current) galleryImagesRef.current.value = "";
    } catch (error) {
      console.log("Upload error", error);
      toast.error("Something went wrong during upload, please try again.");
    } finally {
      setLoading(false);
    }
  }
  };

  useEffect(() => {
    const clearFields = () => {
      if (!visible) {
        setFormProd((prev) => ({
          ...prev,
          productName: "",
          category: "",
          subCategory:"",
          price: "",
          stkQuantity: "",
          color:"",
          size:"",
          weight:"",
    material:"",
    style:"",
    fitType:"",
    gender: "",
    brand:"",
    sku:"",
    slug:"",
          mainImage: null,
          galleryImages: [],
          description: "",
          tags:[]
        }));

        setPreview({
          mainImage: null,
          galleryImages: [],
        });

        // Reset file inputs manually
        if (mainImageRef.current) mainImageRef.current.value = "";
        if (galleryImagesRef.current) galleryImagesRef.current.value = "";
      }
    };
    clearFields();
  }, [visible]);

  useEffect(() => {
    if (visible) {
      // Disable background scroll
      document.body.style.overflow = "hidden";
    } else {
      // Re-enable scroll
      document.body.style.overflow = "auto";
    }

    // Cleanup in case component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);


//for subCategory

  //  This section handles dynamic sub-category filtering based on selected category
// `subCategoryMap` defines which sub-categories belong to which main categories
// For example: Clothing => ["Suits & Jackets", "Shirts", "Trousers"]
  const subCategoryMap = {
    "Suits & Jackets": ["Formal suit", "Tailored suit", "Wedding suit", "Jackets", "Business suit"],
    Shirts:["Long sleeve shirts", "Short sleeve shirts", "Striped shirts",],
    Trousers:["Formal Trousers", "Tailored Trousers", "Chinos trousers"],
    Shoes: ["Loafer shoes", "Oxford Shoes", "Leather Shoes"],
    Bags:["Leather Bags", "Slings & Crossbody Bags", "Work Bags", "Duffel Bags"],
    Watches:[ "Gold watches", "Silver watches", ],
    Accessories:["Wallets", "Bracelets", "Bowties"],
  }

// This function returns sub-categories to display in the dropdown.
// If no category is selected, it returns ALL sub-categories by flattening the map.
// If a category is selected, it returns only the matching sub-categories.
  const getFilteredSubcategories = () => {
    if(!formProd.category){
      //No category selected, return all sub-categories
      return Object.values(subCategoryMap).flat();  // Flattens [["a"], ["b", "c"]] => ["a", "b", "c"]
    }
    // Category selected: return its sub-categories or an empty array if invalid
    return subCategoryMap[formProd.category] || []
  }

  //for slug
  // 🔽 Slug generator: creates a clean URL-friendly string based on product name
// - Lowercases everything
// - Removes special characters
// - Replaces spaces with dashes
// - Collapses multiple dashes into one
  const generateSlug = (name) => {
    return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "")// remove special chars
     .replace(/\s+/g, "-") // spaces to dashes
    .replace(/-+/g, "-"); // collapse multiple dashes
  }

// 🔁 Whenever productName changes, this useEffect runs and updates the slug in the form state.
// `prev` holds the previous form state so we don't accidentally erase anything else.
  useEffect(()=> {
    if(formProd.productName){
      setFormProd((prev)=> ({
        ...prev, // Keep the rest of the form data intact
        slug:generateSlug(prev.productName) // Generate and set the new slug
      }))
    }
  },[formProd.productName])

  return (
    <div
      className={`fixed top-[65px] left-0 z-20 md:top-[129px] w-full overflow-y-auto bg-white pb-10  px-3 md:px-2 lg:px-30
     ${
       visible ? "visible" : "hidden"
     } h-[calc(100dvh-65px)] md:h-[calc(100vh-129px)] `}
      style={{
        background: `${theme ? "rgb(32, 42, 49) " : "rgb(245, 243, 243)"} `,
      }}
    >
      <div>
        <form onSubmit={handleSubmit} className="flex flex-col  ">
          {/**Product Name */}
          <label
            htmlFor="productName"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Product Name
          </label>
          <input
            type="text"
            id="productName"
            name="productName"
            value={formProd.productName}
            placeholder="Enter product name"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.productName && (
            <p className="text-red-500 text-xs">{error.productName}</p>
          )}

          {/**Category */}
          <div className="relative"
          >
          <label
            htmlFor="category"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Category
          </label>

          <select
            id="category"
            name="category"
            value={formProd.category}
            onChange={handleChange}
            className={`p-2 rounded-lg w-full
    focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-no-repeat pr-10
    ${theme ? "text-white" : "text-black"}
    ${theme ? "bg-[rgb(23,29,33)]" : "bg-[rgba(128,128,128,0.3)]"}
  `}
          >
            <option value="">- Select a category -</option>
<option value="Suits & Jackets">Suits & Jackets</option>
<option value="Shirts">Shirts</option>
<option value="Trousers">Trousers</option>
<option value="Shoes">Shoes</option>
<option value="Bags">Bags</option>
<option value="Watches">Watches</option>
<option value="Accessories">Accessories</option>


          </select>
          <div  className="pointer-events-none absolute top-12 right-3 flex items-center">
<RiArrowDropDownLine className="text-3xl" />
           </div>

          </div>

          {error.category && (
            <p className="text-red-500 text-xs">{error.category}</p>
          )}

           {/**subCategory */}
           <div className="relative"
          >
          <label
            htmlFor="subCategory"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Sub-Category
          </label>
          <select
            id="subCategory"
            name="subCategory"
            value={formProd.subCategory}
            onChange={handleChange}
            disabled={!formProd.category}
            className={`p-2 rounded-lg w-full
    focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none bg-no-repeat pr-10
    ${theme ? "text-white bg-[rgb(23,29,33)]" : "text-black bg-[rgba(128,128,128,0.3)]"}
    disabled:bg-slate-700 disabled:text-slate-400 disabled:cursor-not-allowed disabled:opacity-70
  `}
          >
            <option value="">-Select sub-category-</option>
              {
                  getFilteredSubcategories().map((subitems, index)=> (
                    <option key={index} value={subitems}>
                    {subitems}
                    </option>
                    ))

              }
          </select>
           <div  className="pointer-events-none absolute top-12 right-3 flex items-center">
<RiArrowDropDownLine className="text-3xl" />
           </div>

          </div>

          {error.subCategory && (
            <p className="text-red-500 text-xs">{error.subCategory}</p>
          )}

          {/**Price  */}
          <label
            htmlFor="price"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Price (dollar)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formProd.price}
            placeholder="$899"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none
             ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.price && <p className="text-red-500 text-xs">{error.price}</p>}

          {/**Stock Quatity */}
          <label
            htmlFor="stkQuantity"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Stock Quantity
          </label>
          <input
            type="number"
            id="stkQuantity"
            name="stkQuantity"
            value={formProd.stkQuantity}
            placeholder="20"
            min="0"
            step="1"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
             ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.stkQuantity && (
            <p className="text-red-500 text-xs">{error.stkQuantity}</p>
          )}

              {/**color */}
          <label
            htmlFor="color"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Color
          </label>
          <input
            type="text"
            id="color"
            name="color"
            value={formProd.color}
            placeholder="Black,brown,yellow,etc"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
             ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.color && (
            <p className="text-red-500 text-xs">{error.color}</p>
          )}


           {/**size options */}
          <label
            htmlFor="size"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Product Size
          </label>
          <input
            type="text"
            id="size"
            name="size"
            value={formProd.size}
            placeholder="40, 41, S, M, L, XL, etc"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.size && (
            <p className="text-red-500 text-xs">{error.size}</p>
          )}


            {/**Price  */}
          <label
            htmlFor="weight"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Weight
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={formProd.weight}
            placeholder="0.5"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none
             ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.weight && <p className="text-red-500 text-xs">{error.weight}</p>}


           {/**material */}
          <label
            htmlFor="material"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Material <span className="text-xs font-light">(optional)</span>
          </label>
          <input
            type="text"
            id="material"
            name="material"
            value={formProd.material}
            placeholder="leather,cotton, wool etc"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
             ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.material && (
            <p className="text-red-500 text-xs">{error.material}</p>
          )}
          

             {/**style */}
          <label
            htmlFor="style"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Product Style <span className="text-xs font-light">(optional)</span>
          </label>
          <input
            type="text"
            id="style"
            name="style"
            value={formProd.style}
            placeholder="oxford, Double-breasted, etc"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
             ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.style && (
            <p className="text-red-500 text-xs">{error.style}</p>
          )}
          


           {/**fitType */}
          <label
            htmlFor="fitType"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Fit Type <span className="text-xs font-light">(optional)</span>
          </label>
          <input
            type="text"
            id="fitType"
            name="fitType"
            value={formProd.fitType}
            placeholder="e.g., Slim, Regular, Tailored"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
             ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.fitType && (
            <p className="text-red-500 text-xs">{error.fitType}</p>
          )}
          

           {/**Gender */}
          <label
            htmlFor="gender"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Gender
          </label>
          <input
            type="text"
            id="gender"
            name="gender"
            value={formProd.gender}
            placeholder= "Men, Unisex, etc."
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
             ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.gender && (
            <p className="text-red-500 text-xs">{error.gender}</p>
          )}

           {/**brand */}
          <label
            htmlFor="brand"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Product Brand <span className="text-xs font-light">(optional)</span>
          </label>
          <input
            type="text"
            id="brand"
            name="brand"
            value={formProd.brand}
            placeholder="Louis Vuitton, Gucci"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.brand && (
            <p className="text-red-500 text-xs">{error.brand}</p>
          )}
    

             {/**Stock keeping unit(sku) */}
          <label
            htmlFor="sku"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Stock keeping unit  <span className="text-xs font-light">(SKU)</span>
          </label>
          <input
            type="text"
            id="sku"
            name="sku"
            value={formProd.sku}
            placeholder="SUIT-BELLORY-RED-XL-001"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.sku && (
            <p className="text-red-500 text-xs">{error.sku}</p>
          )}

           {/**slug(slug) */}
          <label
            htmlFor="slug"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Slug  
          </label>
          <input
            type="text"
            id="slug"
            name="slug"
            value={formProd.slug}
            placeholder="auto-generated or enter custom-url-slug"
            onChange={handleChange}
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.slug && (
            <p className="text-red-500 text-xs">{error.slug}</p>
          )}


          <div className="lg:flex lg:gap-40">
            <div>
              {/**Display image upload */}
              <label
                htmlFor="mainImage"
                className={` font-medium ${
                  theme ? "headerDark" : "headerLight"
                }`}
              >
                Display Image
                <span className="text-gray-500 text-sm font-normal block">
                  This is the main image customers will see first.
                </span>
              </label>
              <div className="relative w-full">
                <label
                  htmlFor="mainImage"
                  className={`inline-block cursor-pointer w-40 text-center px-4 py-2 rounded-lg text-sm font-medium ${theme ? "text-white": "text-black"}
    border border-yellow-600 bg-transperant hover:bg-yellow-600 hover:text-white active:scale-95 transition-transform duration-100`}
                >
                  Choose image
                </label>
                <input
                  type="file"
                  id="mainImage"
                  name="mainImage"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handleFileChange}
                  ref={mainImageRef}
                  className="hidden"
                />
              </div>

              {error.mainImage && (
                <p className="text-red-500 text-xs">{error.mainImage}</p>
              )}
              {preview.mainImage && (
                <div className="">
                  <img
                    src={preview.mainImage}
                    alt="DisplayImage Preview"
                    className="w-32 h-32 object-contain border-none rounded"
                  />
                </div>
              )}
            </div>

            <div>
              {/**gallery Image */}
              <label
                htmlFor="galleryImages"
                className={` font-medium ${
                  theme ? "headerDark" : "headerLight"
                }`}
              >
                Gallery Images
                <span className="text-gray-500 text-sm font-normal block">
                  Upload extra product views (up to 5 images recommended).
                </span>
              </label>
              <div className="relative w-full ">
                <label
                  htmlFor="galleryImages"
                  className={`inline-block cursor-pointer w-40 text-center px-4 py-2 rounded-lg text-sm font-medium ${theme ? "text-white": "text-black"}
    border border-orange-400 bg-transperant hover:bg-orange-500 hover:text-white active:scale-95 transition-transform duration-100`}
                >
                  Choose Images
                </label>

                <input
                  type="file"
                  id="galleryImages"
                  name="galleryImages"
                  accept="image/png, image/jpeg, image/webp"
                  multiple
                  onChange={handleFileChange}
                  ref={galleryImagesRef}
                  className="hidden"
                />
              </div>

              {error.galleryImages && (
                <p className="text-red-500 text-xs">{error.galleryImages}</p>
              )}
              {preview.galleryImages && preview.galleryImages.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {preview.galleryImages.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Gallery Preview ${index}`}
                      className="w-20 h-20 lg:w-32 lg:h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/**description */}
          <label
            htmlFor="description"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Product Description
          </label>

          <textarea
            id="description"
            name="description"
            value={formProd.description}
            rows="5"
            cols="40"
            placeholder="Enter detailed product info..."
            onChange={handleChange}
            className={`p-2 mt-1 rounded-lg w-full resize-none
    focus:outline-none focus:ring-2 focus:ring-blue-400  ${
              theme ? " text-white" : "placeholder:text-slate-500 text-black"
            }
    `}
            style={{
              background: theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3)",
            }}
          />

          {error.description && (
            <p className="text-red-500 text-xs">{error.description}</p>
          )}

             {/**Tags */}
          <label
            htmlFor="tags"
            className={` font-medium ${theme ? "headerDark" : "headerLight"}`}
          >
            Tags  <span className="text-xs font-light">(comma-separated)</span>
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formProd.tags}
            placeholder="e.g. fashion, formal, men"
            onChange={(e) =>
          setFormProd({
            ...formProd,
            tags: e.target.value.split(",").map((c) => c.trim()),
          })
        }
            className={`p-2  rounded-lg 
          focus:outline-none focus:ring-2 focus:ring-blue-400 
            ${
              theme ? "placeholder:text-white text-white" : "placeholder:text-slate-300 text-black"
            }  `}
            style={{
              background: `${
                theme ? "rgb(23, 29, 33)" : "rgba(128,128,128,0.3) "
              } `,
            }}
          />

          {error.tags && (
            <p className="text-red-500 text-xs">{error.tags}</p>
          )}

          <div>
            <button
              type="submit"
              className=" px-4 py-3 rounded-lg text-sm font-medium text-white bg-amber-700
            hover:bg-amber-600 active:scale-95 transition-transform
             duration-100 mt-5 w-full "
            >
              Add Product{" "}
            </button>
          </div>
        </form>
        <button
          onClick={handleToggle}
          className={` px-4 py-3 rounded-lg text-sm font-medium  bg-transperant
            hover:bg-amber-600 active:scale-95 transition-transform border border-yellow-600
             duration-100 mt-5 w-full ${theme ? "text-white": "text-black"}

       ${visible ? "visible" : "hidden"}`}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddProduct;
