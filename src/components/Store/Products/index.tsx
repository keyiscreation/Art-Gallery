"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase";
import Text from "@/components/ui/Text";
import Spinner from "@/components/ui/Spinner";

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

// Row layout config: repeating pattern (width ratios as fractions of 10)
const ROW_LAYOUTS = [
  [6, 4],           // Row 1: 60% | 40%
  [1, 1, 1],        // Row 2: equal 3 parts
  [2, 1, 1],        // Row 3: 50% | 25% | 25%
  [1, 1, 1, 1],     // Row 4: equal 4 parts
  [4, 6],           // Row 5: 40% | 60%
  [1, 1, 1, 1],     // Row 6: equal 4 parts
  [1, 1, 1],        // Row 7: equal 3 parts
];

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

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.slugtitle}`);
  };

  return (
    <div className="mx-auto w-full   lg:px-8 pb-8 mob:pb-6">


      {loading ? (
        <div className="w-full flex justify-center items-center min-h-[400px]">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col gap-[2px]">
          {(() => {
            let productIndex = 0;
            let rowKey = 0;
            const rows: React.ReactNode[] = [];

            while (productIndex < products.length) {
              ROW_LAYOUTS.forEach((ratios) => {
                const rowProducts = products.slice(productIndex, productIndex + ratios.length);
                if (rowProducts.length === 0) return;

                const gridCols = ratios.map((r) => `${r}fr`).join(" ");
                productIndex += rowProducts.length;

                rows.push(
                  <div
                    key={`row-${rowKey++}`}
                    className="grid gap-[2px] w-full"
                    style={{ gridTemplateColumns: gridCols, gridTemplateRows: "400px" }}
                  >
                    {rowProducts.map((product) => {
                      let imageUrl = product.image;
                      if (product.sizes?.["Small"]) {
                        imageUrl = product.sizes["Small"].image;
                      }

                      return (
                        <div
                          key={product.id}
                          className="relative min-h-0 h-full overflow-hidden cursor-pointer group"
                          onClick={() => handleProductClick(product)}
                        >
                          <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 50vw, 33vw"
                            onContextMenu={(e) => e.preventDefault()}
                            className="object-cover transition-all duration-300 group-hover:scale-105 grayscale group-hover:grayscale-0"
                          />

                          {/* Title - centered, visible on hover */}
                          <div className="absolute inset-0 flex items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                            <Text className="text-white font-newCourier font-bold text-lg sm:text-xl uppercase text-center max-w-[90%] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                              {product.name}
                            </Text>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              });
            }

            return rows;
          })()}
        </div>
      )}
    </div>
  );
};

export default Products;
