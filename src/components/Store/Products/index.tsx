"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { db } from "@/firebase";
import Text from "@/components/ui/Text";
import Spinner from "@/components/ui/Spinner";
import ProductModal from "@/components/Product/ProductModal";

gsap.registerPlugin(ScrollTrigger);

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
  [6, 4], // Row 1: 60% | 40%
  [1, 1, 1], // Row 2: equal 3 parts
  [2, 1, 1], // Row 3: 50% | 25% | 25%
  [1, 1, 1, 1], // Row 4: equal 4 parts
  [4, 6], // Row 5: 40% | 60%
  [1, 1, 1, 1], // Row 6: equal 4 parts
  [1, 1, 1], // Row 7: equal 3 parts
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

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

  // Detect mobile breakpoint
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  // Mobile zoom-in scroll animation (mirrors home page)
  useEffect(() => {
    if (!isMobile || products.length === 0) return;

    itemRefs.current.forEach((item) => {
      if (!item) return;
      gsap.fromTo(
        item,
        { scale: 0.65, transformOrigin: "center center" },
        {
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: item,
            start: "top bottom",
            end: "center center",
            scrub: 1,
          },
        },
      );
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, [isMobile, products]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  // Map store product (name) to modal product (title)
  const modalProduct = selectedProduct
    ? {
        id: selectedProduct.id,
        title: selectedProduct.name,
        slugtitle: selectedProduct.slugtitle,
        price: selectedProduct.price,
        image: selectedProduct.image,
        sizes: selectedProduct.sizes,
      }
    : null;

  return (
    <>
      <ProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={modalProduct}
      />
      <div className="mx-auto w-full   lg:px-3 pb-8 mob:pb-6">
        {loading ? (
          <div className="w-full flex justify-center items-center min-h-[400px]">
            <Spinner />
          </div>
        ) : isMobile ? (
          /* ── Mobile: single column, zoom-in animation ── */
          <div className="flex flex-col gap-[2px]">
            {products.map((product, index) => {
              let imageUrl = product.image;
              if (product.sizes?.["Small"]) {
                imageUrl = product.sizes["Small"].image;
              }
              return (
                <div
                  key={product.id}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="relative w-full h-[500px] overflow-hidden cursor-pointer group"
                  onClick={() => handleProductClick(product)}
                >
                  <Image
                    src={imageUrl}
                    alt={product.name}
                    fill
                    sizes="100vw"
                    onContextMenu={(e) => e.preventDefault()}
                    className="object-cover transition-all duration-300 group-hover:scale-105 grayscale group-hover:grayscale-0 mob:h-[400px] "
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <Text className="text-white font-newCourier font-bold text-lg uppercase text-center max-w-[90%] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                      {product.name}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── Desktop: original variable-ratio grid ── */
          <div className="flex flex-col gap-[2px]">
            {(() => {
              let productIndex = 0;
              let rowKey = 0;
              const rows: React.ReactNode[] = [];

              while (productIndex < products.length) {
                ROW_LAYOUTS.forEach((ratios) => {
                  const rowProducts = products.slice(
                    productIndex,
                    productIndex + ratios.length,
                  );
                  if (rowProducts.length === 0) return;

                  const gridCols = ratios.map((r) => `${r}fr`).join(" ");
                  productIndex += rowProducts.length;

                  rows.push(
                    <div
                      key={`row-${rowKey++}`}
                      className="grid gap-[2px] w-full"
                      style={{
                        gridTemplateColumns: gridCols,
                        gridTemplateRows: "400px",
                      }}
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
                            <div className="absolute inset-0 flex items-center justify-center text-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                              <Text className="text-white font-newCourier font-bold text-lg uppercase text-center max-w-[90%] drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                                {product.name}
                              </Text>
                            </div>
                          </div>
                        );
                      })}
                    </div>,
                  );
                });
              }

              return rows;
            })()}
          </div>
        )}
      </div>
    </>
  );
};

export default Products;
