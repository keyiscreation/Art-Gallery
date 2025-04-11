"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase";
import Text from "@/components/ui/Text";
import Spinner from "@/components/ui/Spinner";

import logo from "@/public/watermark.png";
import SearchProduct from "../Serach";

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
  image: string; // fallback or default image
  hoverImage?: string;
  sizes?: Record<string, SizeInfo>;
}

const Products = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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

  const handleNavigation = (slugtitle: string) => {
    router.push(`/products/${slugtitle}`);
  };

  return (
    <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
      <Text as="h1" className="text-black text-center">
        STORE
      </Text>

      <hr className="border-[0.5px] border-black/50 w-full my-5" />
      <SearchProduct />

      {/* Products grid */}
      <div className="flex flex-wrap mob:justify-center mt-16 gap-[30px] justify-start mob:gap-[20px] mb-16">
        {loading ? (
          <div className="w-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          products.map((product) => {
            // Default images
            let imageUrl = product.image;
            let hoverUrl = product.hoverImage || product.image;
            // If sizes exist, use the "Normal" size images if available.
            if (product.sizes && product.sizes["Normal"]) {
              const sizeData = product.sizes["Normal"];
              imageUrl = sizeData.image;
              hoverUrl = sizeData.hoverImage;
            }

            return (
              <div key={product.id} className="w-full max-w-[401.99px]">
                {/* Product image container with hover effect */}
                <div className="relative w-full group">
                  <Image
                    className="w-full cursor-pointer transition-opacity duration-1000 ease-in-out"
                    src={imageUrl}
                    alt={product.name}
                    onClick={() => handleNavigation(product.slugtitle)}
                    width={402}
                    height={314}
                    onContextMenu={(e) => e.preventDefault()}
                  />

                  {/* Watermark overlay */}
                  <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-20">
                    <Image className="w-full" src={logo} alt="Watermark Logo" />
                  </div>

                  <Image
                    className="absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-1000 ease-in-out opacity-0 group-hover:opacity-100"
                    src={hoverUrl}
                    alt={product.name}
                    onClick={() => handleNavigation(product.slugtitle)}
                    width={402}
                    height={314}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>

                {/* Product details */}
                <div className="flex justify-between items-start mt-6">
                  <Text className="text-[#000000] text-[24px] leading-[30.77px] font-futurapt font-medium max-w-[169px] mob:text-[20px] mob:leading-[25.64px]">
                    {product.name}
                  </Text>
                  <div className="bg-[#EBF1E0] px-3 py-1 max-h-[44.07px] flex items-center rounded-full">
                    <Text className="text-[#000000] text-[24px] leading-[30.77px] font-futurapt font-medium mob:text-[20px] mob:leading-[25.64px]">
                      ${product.price}
                    </Text>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Products;
