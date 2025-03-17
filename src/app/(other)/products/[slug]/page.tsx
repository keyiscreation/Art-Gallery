"use client";
import { NextPage } from "next/types";
import React, { use, useEffect, useState } from "react";
import Product from "@/components/Product";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface ProductDescriptionProps {
  params: Promise<{ slug: string }>;
}

interface FirestoreProduct {
  id: string;
  title: string;
  slugtitle: string;
  price: number;
  image: string;
  sizes: string[];
}

const ProductDetailPage: NextPage<ProductDescriptionProps> = ({ params }) => {
  const { slug } = use(params);

  const [currentProduct, setCurrentProduct] = useState<FirestoreProduct | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchProduct() {
      try {
        // Create a Firestore query to find the product by slugtitle
        const q = query(
          collection(db, "products"),
          where("slugtitle", "==", slug)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          // Assuming the slug is unique, take the first document found.
          const doc = querySnapshot.docs[0];
          const docData = doc.data();

          // Transform Firestore data to match the Product component's props.
          const productData: FirestoreProduct = {
            id: doc.id, // Firestore document ID (string)
            title: docData.name, // Rename "name" to "title"
            slugtitle: docData.slugtitle,
            price: docData.price,
            image: docData.image,
            sizes: docData.sizes,
          };

          setCurrentProduct(productData);
        } else {
          setCurrentProduct(null);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
        setCurrentProduct(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!currentProduct) {
    return <div className="text-center text-red-500">Product not found!</div>;
  }

  return (
    <div className="relative">
      <Product product={currentProduct} />
    </div>
  );
};

export default ProductDetailPage;
