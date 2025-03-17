"use client";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase";


export interface Product {
  id: string;
  title: string; // UI expects title, so we map Firestore's "name" to "title"
  slugtitle: string;
  price: number; // Price is a number as stored in Firestore
  image: string;
  sizes: string[];
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
            title: data.name, // Map Firestore's "name" to "title"
            slugtitle: data.slugtitle,
            price: data.price,
            image: data.image,
            sizes: data.sizes,
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
