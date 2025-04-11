"use client";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";

export interface SizeDetail {
  image: string;
  hoverImage?: string;
  licenseNumber: string;
}

export interface Product {
  id: string;
  title: string; // Mapped from Firestore's "name"
  slugtitle: string;
  price: number;
  image: string;
  sizes?: Record<string, SizeDetail>;
  licenseNumber: string;
  imageHover?: string;
}

const useProducts = (): Product[] => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "products"),
      (snapshot) => {
        const fetchedProducts: Product[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.name,
            slugtitle: data.slugtitle,
            price: data.price,
            image: data.image,
            sizes: data.sizes, // Ensure your document uses a map of sizes if applicable
            licenseNumber: data.licenseNumber,
            imageHover: data.imageHover,
          };
        });
        setProducts(fetchedProducts);
      },
      (error) => {
        console.error("Error fetching products:", error);
      }
    );
    return () => unsubscribe();
  }, []);

  return products;
};

export default useProducts;
