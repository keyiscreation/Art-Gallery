"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";

import Text from "../ui/Text";
import { db } from "@/firebase";
import Spinner from "../ui/Spinner";

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

const RelatedProducts = () => {
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
      setProducts(productsData.slice(5, 8)); // You can update the slice as needed
    } catch (error) {
      console.error("Error fetching related products: ", error);
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
    <div className="pt-10 pb-16">
      <Text
        as="h2"
        className="text-black text-[40px] font-newCourier font-bold leading-[46.15px]"
      >
        You Might Also Like
      </Text>

      <div className="flex tab:flex-wrap tab:justify-center gap-10 justify-between mt-7">
        {loading ? (
          <div className="w-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          products.map((product) => {
            let imageUrl = product.image;
            if (
              product.sizes &&
              product.sizes["W 16.5 * H 23.4 (A2 Print only)"]
            ) {
              imageUrl = product.sizes["W 16.5 * H 23.4 (A2 Print only)"].image;
            }

            return (
              <div key={product.id} className="w-full max-w-[395px]">
                <Image
                  className="w-full cursor-pointer"
                  src={imageUrl}
                  alt={product.name}
                  width={395}
                  height={285}
                  onClick={() => handleNavigation(product.slugtitle)}
                />
                <Text className="text-[20px] font-semibold font-newCourier text-black text-center leading-[30.77px] mt-4">
                  {product.name}
                </Text>
                {/* <Text className="text-[22px] text-black font-newCourier text-center leading-[23px] mt-1">
                  ${product.price}
                </Text> */}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
