"use client";
import { NextPage } from "next/types";
import React, { use, useEffect, useState } from "react";
// import productsData from "@/lib/constants/ProductsData";
// import Product from "@/components/Product";
import QRProduct from "@/components/QRProduct";
import Spinner from "@/components/ui/Spinner";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

interface ProductDescriptionProps {
  params: Promise<{ slug: string }>;
}
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
  image: string;
  hoverImage?: string;
  sizes?: Record<string, SizeInfo>;
}

const ProductDetailPage: NextPage<ProductDescriptionProps> = ({ params }) => {
  const { slug } = use(params);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const currentProduct = products.find((product) => product.slugtitle === slug);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData: Product[] = querySnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<Product, "id">;
        return { id: doc.id, ...data };
      });
      setProducts(productsData);
    } catch (error) {
      console.error("Error fetching products: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    );
  }

  if (!currentProduct) {
    return <div className="text-center text-red-500">Product not found!</div>;
  }

  return (
    <div className="relative">
      <QRProduct product={currentProduct} />
    </div>
  );
};

export default ProductDetailPage;
