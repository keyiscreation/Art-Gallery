"use client";
import { NextPage } from "next/types";
import React, { use } from "react";
import productsData from "@/lib/constants/ProductsData";
// import Product from "@/components/Product";
import QRProduct from "@/components/QRProduct";

interface ProductDescriptionProps {
  params: Promise<{ slug: string }>;
}

const ProductDetailPage: NextPage<ProductDescriptionProps> = ({ params }) => {
  const { slug } = use(params);

  // Find product based on slug
  const currentProduct = productsData.find(
    (product) => product.slugtitle === slug
  );

  // console.log(slug, "slugtitle");
  // console.log(currentProduct, "currentProduct");

  if (!currentProduct) {
    return <div className="text-center text-red-500">Product not found!</div>;
  }

  return (
    <>
      <div className="relative">
        <QRProduct product={currentProduct} />
      </div>
    </>
  );
};

export default ProductDetailPage;
