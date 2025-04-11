"use client";
import { NextPage } from "next/types";
import React, { use, useEffect, useState } from "react";
import Product from "@/components/Product";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface ProductDescriptionProps {
  params: Promise<{ slug: string }>;
}

interface SizeDetail {
  image: string;
  hoverImage: string;
  licenseNumber: string;
}

interface FirestoreProduct {
  id: string;
  title: string;
  slugtitle: string;
  price: number;
  image: string;
  sizes: Record<string, SizeDetail>;
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
        const q = query(
          collection(db, "products"),
          where("slugtitle", "==", slug)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          const docData = doc.data();

          const sizes = docData.sizes || {};

          // Extract image fallback from sizes if top-level image doesn't exist
          const firstSizeKey = Object.keys(sizes)[0];
          const fallbackImage =
            sizes[firstSizeKey]?.image || "/placeholder.jpg";

          const productData: FirestoreProduct = {
            id: doc.id,
            title: docData.name,
            slugtitle: docData.slugtitle,
            price: docData.price,
            image: docData.image || fallbackImage,
            sizes: sizes,
          };

          setCurrentProduct(productData);
          // console.log("product data", productData);
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
