"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { collection, getDocs } from "firebase/firestore";

import { db } from "@/firebase";
import Text from "@/components/ui/Text";
import Spinner from "@/components/ui/Spinner";

import logo from "@/public/signatureblack.png";
// import SearchProduct from "../Serach";

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
      <Text
        as="h1"
        className="text-black text-center font-newCourier font-bold"
      >
        STORE
      </Text>

      <hr className="border-[0.5px] border-black/50 w-full my-5" />
      {/* <SearchProduct /> */}

      {/* Products grid */}
      <div className="flex flex-wrap mob:justify-center mt-16 gap-[30px] justify-start mob:gap-[20px] mb-16">
        {loading ? (
          <div className="w-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          products.map((product) => {
            // Determine which images to use.
            let imageUrl = product.image;
            let hoverUrl = product.hoverImage || product.image;
            if (
              product.sizes &&
              product.sizes["Small"]
            ) {
              const sizeData = product.sizes["Small"];
              imageUrl = sizeData.image;
              hoverUrl = sizeData.hoverImage;
            }

            return (
              <div key={product.id} className="w-full max-w-[401.99px]">
                {/* Image container with fixed dimensions, white background, and overflow hidden */}
                <div
                  className="relative group w-full bg-white overflow-hidden cursor-pointer"
                  onClick={() => handleNavigation(product.slugtitle)}
                >
                  {/* Default image fades out on hover */}

                  {/* <div className="w-full max-w-[670px] relative group">
              <Image
                src={currentImage}
                alt={product.title}
                width={670}
                height={523}
                onContextMenu={(e) => e.preventDefault()}
                className="object-contain max-w-full max-h-full"
              />

              <div className="absolute bottom-3 right-2 w-[80px] rounded-[24px] p-4 ">
                <Image
                  className="mx-auto w-[80px]"
                  src={logo}
                  alt="Watermark Logo"
                />
              </div>
            </div> */}

                  <div className="w-full relative group">
                    {/* Main Image */}
                    <Image
                      src={imageUrl}
                      alt={product.name}
                      width={402}
                      height={314}
                      onContextMenu={(e) => e.preventDefault()}
                      className="transition-opacity duration-1000 ease-in-out group-hover:opacity-0 object-contain"
                    />

                    {/* Watermark for Main Image - Also fades out on hover */}
                    <div className="absolute bottom-3 right-2 w-[80px] rounded-[24px] transition-opacity duration-1000 ease-in-out group-hover:opacity-0">
                      <Image
                        className="mx-auto w-[80px]"
                        src={logo}
                        alt="Watermark Logo"
                      />
                    </div>

                    {/* Hover Image and its watermark */}
                    <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-0 group-hover:opacity-100 flex justify-center items-center z-10">
                      <div className="relative">
                        <Image
                          src={hoverUrl}
                          alt={product.name}
                          width={402}
                          height={314}
                          onContextMenu={(e) => e.preventDefault()}
                          className="object-contain max-w-full max-h-full"
                        />
                        <div className="absolute bottom-3 right-2 w-[80px] rounded-[24px] pointer-events-none">
                          <Image
                            className="mx-auto w-[80px]"
                            src={logo}
                            alt="Watermark Logo"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Watermark overlay remains fixed on top */}
                  {/* <div className="absolute inset-0 flex justify-center w-[100px] items-center pointer-events-none z-20">
                    <Image
                      className="w-full relative"
                      src={logo}
                      alt="Watermark Logo"
                    />
                  </div> */}
                </div>

                {/* Product details */}
                <div className="flex justify-center items-start mt-6">
                  {/* max-w-[169px] */}
                  <Text className="text-[#000000] font-bold text-[24px] leading-[30.77px] font-newCourier mob:text-[20px] mob:leading-[25.64px]">
                    {product.name}
                  </Text>
                  {/* <div className="bg-[#EBF1E0] px-3 py-1 max-h-[44.07px] flex items-center rounded-full">
                    <Text className="text-[#000000] text-[24px] leading-[30.77px] font-futurapt font-medium mob:text-[20px] mob:leading-[25.64px]">
                      ${product.price}
                    </Text>
                  </div> */}
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
