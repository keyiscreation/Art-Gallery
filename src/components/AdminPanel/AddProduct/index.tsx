"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

interface Product {
  name: string;
  slugtitle: string;
  price: string;
  image: File | null;
  hoverImage: File | null; // New hover image property
  sizes: string[];
  licenseNumber: string;
}

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    slugtitle: "",
    price: "",
    image: null,
    hoverImage: null,
    sizes: [],
    licenseNumber: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Handle input changes for text fields
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file input changes for both main image and hover image
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setProduct((prev) => ({ ...prev, [name]: files[0] }));
    }
  };

  // Upload image to Cloudinary
  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "art-gallery"); // Cloudinary upload preset

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duox5d29k/image/upload", // Cloudinary cloud name
        formData
      );
      return response.data.secure_url; // Return the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check for required fields (hover image is optional)
    if (
      !product.name ||
      !product.slugtitle ||
      !product.price ||
      !product.image
    ) {
      alert("Please fill all required fields and upload the main image.");
      return;
    }

    setLoading(true);

    try {
      // Upload main image to Cloudinary and get the URL
      const imageURL = await uploadImageToCloudinary(product.image);
      if (!imageURL) {
        alert("Image upload failed. Please try again.");
        return;
      }

      // Upload hover image if provided
      let hoverImageURL = "";
      if (product.hoverImage) {
        hoverImageURL =
          (await uploadImageToCloudinary(product.hoverImage)) || "";
      }

      // Save product data to Firestore, including both image URLs
      await addDoc(collection(db, "products"), {
        name: product.name,
        slugtitle: product.slugtitle,
        price: parseFloat(product.price),
        image: imageURL,
        imageHover: hoverImageURL,
        sizes: product.sizes,
        licenseNumber: product.licenseNumber,
      });

      alert("Product added successfully!");
      // Optionally reset the form state here if needed
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-full my-[100px]">
      <div className="p-8 rounded-[12px] w-full max-w-[1268px] shadow-md">
        <Text as="h1" className="text-black mb-4 text-center">
          Add Product
        </Text>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-futurapt mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Slug Title</label>
            <input
              type="text"
              name="slugtitle"
              value={product.slugtitle}
              onChange={handleChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter slug title"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Sizes</label>
            <input
              type="text"
              name="sizes"
              value={product.sizes.join(", ")}
              onChange={(e) =>
                setProduct((prev) => ({
                  ...prev,
                  sizes: e.target.value.split(",").map((size) => size.trim()),
                }))
              }
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter sizes (comma-separated)"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={product.licenseNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter License Number"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Product Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md font-futurapt"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Hover Image</label>
            <input
              type="file"
              name="hoverImage"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md font-futurapt"
            />
          </div>

          <Button
            type="submit"
            className="w-full max-w-[300px] h-[50px] mx-auto bg-black hover:bg-[#000000]/90 text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
