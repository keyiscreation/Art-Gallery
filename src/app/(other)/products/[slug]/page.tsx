"use client";
import { NextPage } from "next/types";
import React, { use } from "react";
import productsData from "@/lib/constants/ProductsData";
import Product from "@/components/Product";

interface ProductDescriptionProps {
  params: Promise<{ slug: string }>;
}

const ProductDetailPage: NextPage<ProductDescriptionProps> = ({ params }) => {
  const { slug } = use(params);

  // Find product based on slug
  const currentProduct = productsData.find(
    (product) => product.slugtitle === slug
  );

  console.log(slug, "slugtitle");
  console.log(currentProduct, "currentProduct d");

  if (!currentProduct) {
    return <div className="text-center text-red-500">Product not found!</div>;
  }

  return (
    <>
      <div className="relative">
        <Product product={currentProduct} />
      </div>
    </>
  );
};

export default ProductDetailPage;
