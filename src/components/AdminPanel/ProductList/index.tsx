"use client";

import React, { useEffect, useState } from "react";

import { db } from "@/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import Text from "@/components/ui/Text";
import Image from "next/image";
import axios from "axios";

interface Product {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  licenseNumber: string;
  image?: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedPrice, setEditedPrice] = useState<string>("");
  const [editedSize, setEditedSize] = useState<string>("");
  const [editedImage, setEditedImage] = useState<string>("");
  const [editedLicenceNumber, setEditedLicenceNumber] = useState<string>("");
  const [newImageFile, setNewImageFile] = useState<File | null>(null);

  // Fetch Products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
      setProducts(productList);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete Product
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  // Edit Product
  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setEditedName(product.name);
    setEditedPrice(product.price.toString());
    setEditedSize(product.sizes.join(", "));
    setEditedImage(product.image || "");
    setNewImageFile(null);
    setEditedLicenceNumber(product.licenseNumber);
  };

  // Upload Image to Cloudinary
  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "art-gallery");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duox5d29k/image/upload",
        formData
      );
      return response.data.secure_url; // Get the uploaded image URL
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    }
  };

  // Save Edited Product
  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    setLoading(true);
    let updatedImage = editedImage;

    // If a new image file is selected, upload it
    if (newImageFile) {
      const uploadedImageUrl = await uploadImageToCloudinary(newImageFile);
      if (uploadedImageUrl) {
        updatedImage = uploadedImageUrl;
      }
    }

    try {
      const productRef = doc(db, "products", editingProduct.id);
      const updatedSizes = editedSize.split(",").map((s) => s.trim());

      await updateDoc(productRef, {
        name: editedName,
        price: Number(editedPrice),
        sizes: updatedSizes,
        image: updatedImage,
        licenseNumber: editedLicenceNumber,
      });

      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: editedName,
                price: Number(editedPrice),
                sizes: updatedSizes,
                image: updatedImage,
                licenseNumber: editedLicenceNumber,
              }
            : p
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1268px] w-full mx-auto bg-white p-6 rounded-lg shadow-md mb-[100px]">
      <Text as="h1" className="text-black mb-4 text-center">
        Product List
      </Text>
      {loading ? (
        <Text>Loading products...</Text>
      ) : products.length === 0 ? (
        <Text>No products available.</Text>
      ) : (
        <ul className="space-y-4">
          {products.map((product) => (
            <li
              key={product.id}
              className="border p-4 rounded-md shadow-sm flex justify-between items-center"
            >
              {editingProduct?.id === product.id ? (
                <div className="flex flex-col gap-2 w-full max-w-[400px] mx-auto">
                  {/* Image Preview */}
                  <div className="w-32 h-32 mx-auto">
                    {newImageFile ? (
                      <img
                        src={URL.createObjectURL(newImageFile)}
                        alt="New Upload"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <Image
                        src={editedImage}
                        alt={editedName}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    )}
                  </div>

                  {/* Image Upload Input */}
                  <input
                    className="border p-2 rounded"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setNewImageFile(file);
                      }
                    }}
                  />

                  {/* Other Editable Fields */}
                  <input
                    className="border p-2 rounded"
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                  <input
                    className="border p-2 rounded"
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                  />
                  <input
                    className="border p-2 rounded"
                    type="text"
                    value={editedSize}
                    onChange={(e) => setEditedSize(e.target.value)}
                  />
                  <input
                    className="border p-2 rounded"
                    type="text"
                    value={editedLicenceNumber}
                    onChange={(e) => setEditedLicenceNumber(e.target.value)}
                  />

                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={handleSaveEdit}
                  >
                    {loading ? "Saving" : "Save"}
                  </button>
                  <button
                    className="bg-gray-500 text-white px-3 py-1 rounded"
                    onClick={() => setEditingProduct(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    {/* Product Image */}
                    {product.image && (
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={100}
                        height={100}
                        className="rounded-md object-cover"
                      />
                    )}
                    <Text className="text-lg text-black font-semibold">
                      {product.name}
                    </Text>
                    <Text className="text-gray-600">
                      Price: ${product.price}
                    </Text>
                    <Text className="text-gray-600">
                      Sizes: {product.sizes.join(", ")}
                    </Text>
                    <Text className="text-gray-600">
                      License Number: {product.licenseNumber}
                    </Text>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded"
                      onClick={() => handleEdit(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded"
                      onClick={() => handleDelete(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
