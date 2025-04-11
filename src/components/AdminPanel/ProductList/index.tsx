"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import Text from "@/components/ui/Text";
import Image from "next/image";

interface SizeInfo {
  image: string;
  hoverImage: string;
  licenseNumber: string;
}

interface Product {
  id: string;
  name: string;
  slugtitle: string;
  price: number;
  sizes: Record<string, SizeInfo>;
  image?: string;
  hoverImage?: string;
}

const uploadToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "art-gallery");

  const res = await fetch(
    "https://api.cloudinary.com/v1_1/duox5d29k/image/upload",
    {
      method: "POST",
      body: formData,
    }
  );
  const data = await res.json();
  return data.secure_url;
};

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState<boolean>(false);
  const [newSizeName, setNewSizeName] = useState<string>("");
  const [newLicenseNumber, setNewLicenseNumber] = useState<string>("");
  const [newSizeImage, setNewSizeImage] = useState<File | null>(null);
  const [newHoverImage, setNewHoverImage] = useState<File | null>(null);

  // State to manage the confirmation popup for deleting a size
  const [deletingSize, setDeletingSize] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList = querySnapshot.docs.map((doc) => ({
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

  const handleDeleteSize = async (size: string) => {
    if (!editProductId) return;

    const updatedSizes = { ...editData.sizes };
    delete updatedSizes[size];

    setEditData((prev) => ({
      ...prev,
      sizes: updatedSizes,
    }));

    try {
      await updateDoc(doc(db, "products", editProductId), {
        sizes: updatedSizes,
      });
      setDeletingSize(null);
    } catch (error) {
      console.error("Error deleting size:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      await deleteDoc(doc(db, "products", id));
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setEditProductId(product.id);
    setEditData(product);
  };

  const handleCancel = () => {
    setEditProductId(null);
    setEditData({});
  };

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSizeChange = (
    size: string,
    field: keyof SizeInfo,
    value: string
  ) => {
    setEditData((prev) => {
      const currentSize = prev.sizes?.[size] || {
        image: "",
        hoverImage: "",
        licenseNumber: "",
      };
      return {
        ...prev,
        sizes: {
          ...prev.sizes,
          [size]: {
            ...currentSize,
            [field]: value,
          },
        },
      };
    });
  };

  const handleSizeImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    size: string,
    field: keyof SizeInfo
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = await uploadToCloudinary(file);
    setEditData((prev) => {
      const currentSize = prev.sizes?.[size] || {
        image: "",
        hoverImage: "",
        licenseNumber: "",
      };
      return {
        ...prev,
        sizes: {
          ...prev.sizes,
          [size]: {
            ...currentSize,
            [field]: url,
          },
        },
      };
    });
  };

  const handleAddSize = async () => {
    if (!newSizeName || !newLicenseNumber || !newSizeImage || !newHoverImage) {
      alert("Please fill all fields for the new size.");
      return;
    }

    // Upload the new size image and hover image
    const imageURL = await uploadToCloudinary(newSizeImage);
    const hoverImageURL = await uploadToCloudinary(newHoverImage);

    if (!imageURL || !hoverImageURL) {
      alert("Failed to upload images.");
      return;
    }

    const newSizeData: SizeInfo = {
      image: imageURL,
      hoverImage: hoverImageURL,
      licenseNumber: newLicenseNumber,
    };

    setEditData((prev) => {
      return {
        ...prev,
        sizes: {
          ...prev.sizes,
          [newSizeName]: newSizeData,
        },
      };
    });

    setNewSizeName("");
    setNewLicenseNumber("");
    setNewSizeImage(null);
    setNewHoverImage(null);
  };

  const handleSave = async () => {
    if (!editProductId) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, "products", editProductId), editData);
      setEditProductId(null);
      setEditData({});
      fetchProducts();
    } catch (err) {
      console.error("Error updating:", err);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-[1268px] w-full mx-auto bg-white p-6 rounded-lg shadow-md mb-[100px]">
      <Text as="h1" className="text-black mb-4 text-center text-2xl font-bold">
        Product List
      </Text>

      {loading ? (
        <Text>Loading products...</Text>
      ) : products.length === 0 ? (
        <Text>No products available.</Text>
      ) : (
        <ul className="space-y-6">
          {products.map((product) =>
            editProductId === product.id ? (
              <li
                key={product.id}
                className="border p-4 rounded-md shadow-sm bg-white space-y-4"
              >
                <label className="block">
                  <span>Name</span>
                  <input
                    value={editData.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="border p-2 w-full mt-1"
                    placeholder="Name"
                  />
                </label>
                <label className="block">
                  <span>Slug</span>
                  <input
                    value={editData.slugtitle || ""}
                    onChange={(e) =>
                      handleInputChange("slugtitle", e.target.value)
                    }
                    className="border p-2 w-full mt-1"
                    placeholder="Slug"
                  />
                </label>
                <label className="block">
                  <span>Price</span>
                  <input
                    type="number"
                    value={editData.price || ""}
                    onChange={(e) =>
                      handleInputChange("price", +e.target.value)
                    }
                    className="border p-2 w-full mt-1"
                    placeholder="Price"
                  />
                </label>

                {editData.sizes &&
                  Object.entries(editData.sizes).map(([size, data]) => (
                    <div key={size} className="border p-3 rounded-md">
                      <Text className="font-bold">Size: {size}</Text>

                      <label className="block mt-2">
                        <span>License Number</span>
                        <input
                          value={data.licenseNumber}
                          onChange={(e) =>
                            handleSizeChange(
                              size,
                              "licenseNumber",
                              e.target.value
                            )
                          }
                          className="border p-2 w-full mt-1"
                          placeholder="License Number"
                        />
                      </label>

                      <div className="grid grid-cols-2 gap-4 mt-3">
                        <label className="block">
                          <span>Size Image</span>
                          {data.image && (
                            <Image
                              src={data.image}
                              alt={`Image for ${size}`}
                              width={150}
                              height={150}
                              className="my-2 rounded-md object-cover"
                            />
                          )}
                          <input
                            type="file"
                            onChange={(e) =>
                              handleSizeImageUpload(e, size, "image")
                            }
                            className="mt-1"
                          />
                        </label>
                        <label className="block">
                          <span>Hover Image</span>
                          {data.hoverImage && (
                            <Image
                              src={data.hoverImage}
                              alt={`Hover image for ${size}`}
                              width={150}
                              height={150}
                              className="my-2 rounded-md object-cover"
                            />
                          )}
                          <input
                            type="file"
                            onChange={(e) =>
                              handleSizeImageUpload(e, size, "hoverImage")
                            }
                            className="mt-1"
                          />
                        </label>
                      </div>

                      {/* Delete Button for Size */}
                      <button
                        onClick={() => setDeletingSize(size)}
                        className="bg-red-600 text-white px-4 py-2 rounded mt-3"
                      >
                        Delete Size
                      </button>

                      {/* Confirmation Popup */}
                      {deletingSize === size && (
                        <div className="fixed top-0 left-0 w-full h-full bg-black/50 flex justify-center items-center z-10">
                          <div className="bg-white p-6 rounded-md shadow-lg max-w-[400px] w-full">
                            <Text className="text-lg font-semibold mb-4">
                              Are you sure you want to delete this size?
                            </Text>
                            <div className="flex gap-4">
                              <button
                                onClick={() => handleDeleteSize(size)}
                                className="bg-red-600 text-white px-4 py-2 rounded"
                              >
                                Yes, Delete
                              </button>
                              <button
                                onClick={() => setDeletingSize(null)}
                                className="bg-gray-500 text-white px-4 py-2 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                <div className="flex gap-4 mt-4">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={handleCancel}
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                </div>

                {/* Add New Size Section */}
                <div className="mt-6">
                  <Text as="h2" className="text-lg font-semibold">
                    Add New Size
                  </Text>
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Enter new size name"
                      value={newSizeName}
                      onChange={(e) => setNewSizeName(e.target.value)}
                      className="border p-2 w-full mt-1"
                    />
                    <input
                      type="text"
                      placeholder="Enter license number"
                      value={newLicenseNumber}
                      onChange={(e) => setNewLicenseNumber(e.target.value)}
                      className="border p-2 w-full mt-1"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        setNewSizeImage(e.target.files?.[0] || null)
                      }
                      className="border p-2 w-full mt-1"
                    />
                    <input
                      type="file"
                      onChange={(e) =>
                        setNewHoverImage(e.target.files?.[0] || null)
                      }
                      className="border p-2 w-full mt-1"
                    />
                    <button
                      onClick={handleAddSize}
                      className="bg-green-600 text-white px-4 py-2 mt-3 rounded"
                    >
                      Add Size
                    </button>
                  </div>
                </div>
              </li>
            ) : (
              <li
                key={product.id}
                className="border p-4 rounded-md shadow-sm bg-white"
              >
                <Text className="text-[20px] text-medium">
                  <span className="font-bold">Name: </span> {product.name}
                </Text>
                <Text className="text-[18px] text-black mb-2">
                  <span className="font-bold">Price: </span>${product.price}
                </Text>
                <Text className="text-[18px] font-medium text-black mb-3">
                  <span className="font-bold">Slug:</span> {product.slugtitle}
                </Text>
                <div className="flex gap-4 mb-3">
                  {product.image && (
                    <Image
                      src={product.image}
                      alt="Image"
                      width={150}
                      height={150}
                      className="rounded-md object-cover"
                    />
                  )}
                  {product.hoverImage && (
                    <Image
                      src={product.hoverImage}
                      alt="Hover Image"
                      width={150}
                      height={150}
                      className="rounded-md object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-2">
                  {Object.entries(product.sizes).map(([sizeName, sizeData]) => (
                    <div
                      key={sizeName}
                      className="p-3 border rounded-md flex flex-col gap-2 w-full max-w-[300px]"
                    >
                      <Text className="text-[16px] text-black">
                        <span className="font-semibold">Size:</span> {sizeName}
                      </Text>
                      <Text className="text-[16px] text-black">
                        <span className="font-semibold">License:</span>{" "}
                        {sizeData.licenseNumber || "—"}
                      </Text>
                      {sizeData.image && (
                        <Image
                          src={sizeData.image}
                          alt={`Image for ${sizeName}`}
                          width={150}
                          height={150}
                          className="rounded-md object-cover"
                        />
                      )}
                      {sizeData.hoverImage && (
                        <Image
                          src={sizeData.hoverImage}
                          alt={`Hover image for ${sizeName}`}
                          width={150}
                          height={150}
                          className="rounded-md object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    onClick={() => handleEdit(product)}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default ProductList;
