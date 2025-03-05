"use client";
import React, { useEffect, useState } from "react";
import { NextPage } from "next/types";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";
import PurchasedProduct from "@/components/PurchasedProduct";

interface PurchasedProductProps {
  params: Promise<{ license: string }>;
}

interface Product {
  id: string;
  name: string;
  slugtitle: string;
  price: number;
  image?: string;
  sizes: string[];
  licenseNumber: string;
}

const PurchasedProductPage: NextPage<PurchasedProductProps> = ({ params }) => {
  // Unwrap the params promise before using its properties
  const { license } = React.use(params);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const q = query(
          collection(db, "products"),
          where("licenseNumber", "==", license)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docSnapshot = querySnapshot.docs[0];
          const productData = docSnapshot.data() as Omit<Product, "id">;
          setCurrentProduct({ id: docSnapshot.id, ...productData });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [license]);

  if (loading) return <div>Loading...</div>;
  if (!currentProduct)
    return <div className="text-center text-red-500">Product not found!</div>;

  return (
    <div className="relative">
      <PurchasedProduct product={currentProduct} />
    </div>
  );
};

export default PurchasedProductPage;
