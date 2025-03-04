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

interface Product {
  id: string;
  name: string;
  price: number;
  sizes: string[];
  licenseNumber: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editedName, setEditedName] = useState<string>("");
  const [editedPrice, setEditedPrice] = useState<string>("");
  const [editedSize, setEditedSize] = useState<string>("");

  // Fetch Products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productList: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];

      //   console.log(productList);
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
    const confirmDelete = confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmDelete) return;

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
    setEditedSize(product.sizes.join(", ")); // Join the sizes array into a comma-separated string
  };

  // Save Edited Product
  // Save Edited Product
  const handleSaveEdit = async () => {
    if (!editingProduct) return;

    try {
      const productRef = doc(db, "products", editingProduct.id);
      const updatedSizes = editedSize.split(",").map((s) => s.trim());
      await updateDoc(productRef, {
        name: editedName,
        price: Number(editedPrice),
        sizes: updatedSizes, // Changed from "size" to "sizes"
      });

      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: editedName,
                price: Number(editedPrice),
                sizes: updatedSizes, // Changed from "size" to "sizes"
              }
            : p
        )
      );
      setEditingProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
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
              className="border p-4 font-futurapt rounded-md shadow-sm flex justify-between items-center"
            >
              {editingProduct?.id === product.id ? (
                <div className="flex flex-col gap-2 w-full max-w-[400px] mx-auto">
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
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={handleSaveEdit}
                  >
                    Save
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
