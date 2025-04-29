"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import Text from "../ui/Text";
import Button from "../ui/Button";
import RelatedProducts from "./RelatedProducts";
import useShoppingCart from "@/hooks/useShoppingCart";

import { db } from "@/firebase";
import { doc, getDoc } from "firebase/firestore";

import logo from "@/public/signatureblack.png";

interface SizeDetail {
  image: string;
  hoverImage: string;
  licenseNumber: string;
}

interface ProductData {
  id: string; // Updated to string as provided by Firestore
  title: string;
  slugtitle: string;
  price: number;
  image: string; // Fallback or default image URL from Firestore
  sizes?: Record<string, SizeDetail>;
}

interface ProductProps {
  product: ProductData;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [savedContent, setSavedContent] = useState<string | null>(null);
  const router = useRouter();
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    setItemSize,
  } = useShoppingCart();

  const docId = "unique-id";

  // Fetch the content from Firestore when the component loads
  useEffect(() => {
    const fetchContent = async () => {
      const docRef = doc(db, "sizes", docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const content = docSnap.data()?.content || "";
        setSavedContent(content); // Set the saved content to be displayed
        // setEditorContent(content); // Set the content in the editor as well
      } else {
        console.log("No such document!");
      }
    };

    fetchContent();
  }, []);

  // When the component loads (or product.sizes changes), set the default size.
  useEffect(() => {
    if (product.sizes && !selectedSize) {
      const availableSizes = Object.keys(product.sizes);
      const defaultSize = product.sizes["W 16.5 * H 23.4 (A2 Print only)"]
        ? "W 16.5 * H 23.4 (A2 Print only)"
        : availableSizes[0];
      setSelectedSize(defaultSize);
      setItemSize(product.id, defaultSize);
    }
  }, [product.sizes, product.id, setItemSize, selectedSize]);

  // Determine if dropdown should be displayed.
  // Show dropdown if there are multiple sizes or if the single available size is not "W 16.5 * H 23.4 (A2 Print only)".
  const availableSizes = product.sizes ? Object.keys(product.sizes) : [];
  const showDropdown =
    product.sizes &&
    (availableSizes.length > 1 ||
      availableSizes[0] !== "W 16.5 * H 23.4 (A2 Print only)");

  // Determine the current image URL based on the selected size.
  let currentImage = product.image;
  if (product.sizes) {
    const defaultSize = product.sizes["W 16.5 * H 23.4 (A2 Print only)"]
      ? "W 16.5 * H 23.4 (A2 Print only)"
      : availableSizes[0];
    currentImage =
      product.sizes[selectedSize || defaultSize]?.image || product.image;
  }

  const onAddToCart = () => {
    const quantity = getItemQuantity(product.id);
    // If the product is already in the cart, navigate directly to the cart.
    if (quantity > 0) {
      router.push(`/cart`);
      return;
    }
    // Increase the cart quantity and add the selected size
    increaseCartQuantity(product.id, selectedSize);
    router.push(`/cart`);
  };

  const onBuyNow = () => {
    const quantity = getItemQuantity(product.id);
    if (quantity > 0) {
      router.push(`/checkout`);
      return;
    }
    increaseCartQuantity(product.id, selectedSize);
    router.push(`/checkout`);
  };

  return (
    <div>
      <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
        <Text
          as="h1"
          className="text-black text-center font-newCourier font-bold">
          Product Page
        </Text>
        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className="flex flex-wrap items-start gap-10 mt-16 mb-14">
          {/* <div className="w-full max-w-[670px] relative">
            <div className="relative w-full h-full">
              <Image
                className="w-full max-w-[670px] object-cover"
                src={currentImage}
                alt="Product image"
                width={670}
                height={523}
                onContextMenu={(e) => e.preventDefault()}
                draggable="false"
              />

              <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-20">
                <Image className="w-full" src={logo} alt="Watermark Logo" />
              </div>
            </div>
          </div> */}
          <div className="w-full max-w-[670px] flex justify-center items-center z-10">
            <div className="w-full max-w-[670px] relative group">
              <Image
                src={currentImage}
                alt={product.title}
                width={670}
                height={523}
                onContextMenu={(e) => e.preventDefault()}
                className="object-contain max-w-full max-h-full"
              />

              <div className="absolute bottom-3 right-3 w-[80px] rounded-[24px]">
                <Image
                  className="mx-auto w-[80px]"
                  src={logo}
                  alt="Watermark Logo"
                />
              </div>
            </div>
          </div>

          <div className="w-full max-w-[465px]">
            <Text className="text-[38px] text-[#000000] font-medium font-newCourier leading-[48px]">
              {product.title}
            </Text>
            <Text className="text-[22px] text-[#000000] font-normal font-newCourier leading-[33.33px]">
              Price ${product.price}
            </Text>
            {/* <Text className="text-[22px] text-[#000000] font-normal font-newCourier leading-[23.08px] mt-3">
              {product.title}
            </Text> */}

            {/* Render size dropdown only if more than a single 'Normal' size exists */}
            {product.sizes && showDropdown && (
              <>
                <Text className="text-[18px] text-[#000000] font-newCourier font-semibold leading-[20.51px] mt-8 mb-2">
                  Size:
                </Text>
                <select
                  className="border border-[#000000] w-full max-w-[407px] h-[46px] p-2 text-[16px] font-newCourier font-medium"
                  value={selectedSize}
                  onChange={(e) => {
                    const newSize = e.target.value;
                    setSelectedSize(newSize);
                    setItemSize(product.id, newSize);
                  }}>
                  <option value="" disabled>
                    Select Size
                  </option>
                  {availableSizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </>
            )}

            <Text className="text-[16px] text-[#000000] font-newCourier leading-[20.51px] font-semibold mt-4 mb-2">
              Quantity:
            </Text>

            <div className="border border-[#000000]/70 w-[87px] h-[45px] font-newCourier flex justify-between items-center">
              <button
                onClick={() => increaseCartQuantity(product.id, selectedSize)}
                className="px-2 text-[24px]">
                +
              </button>
              <Text className="text-[16px] text-[#000000] leading-[20px] mt-1 font-newCourier font-semibold">
                {getItemQuantity(product.id, selectedSize)}
              </Text>
              <button
                onClick={() => decreaseCartQuantity(product.id, selectedSize)}
                className="px-2 text-[24px] font-newCourier">
                -
              </button>
            </div>

            <div className="flex tab:gap-5 gap-5 mt-10 w-full">
              <Button
                onClick={onAddToCart}
                className="bg-[#000000] rounded-[10px] text-[#FFFFFF] font-newCourier font-medium w-full">
                Add To Cart
              </Button>

              <Button
                onClick={onBuyNow}
                className="bg-[#000000] rounded-[10px] text-[#FFFFFF] font-newCourier font-medium w-full">
                Buy Now
              </Button>
            </div>
          </div>
        </div>

        {/* Product description and related content */}
        {/* <Text className="text-[#000000] text-[20px] leading-[25.64px] mb-6 font-newCourier">
          Standing under a starry night sky and staring into space feels like a
          glimpse into infinity. I remember as a child lying on my back in our
          backyard, staring up at the stars and feeling like I could fall off
          the earth into eternity. On an amazing calm summer evening near Mount
          Hood, Oregon, we were treated to an absolutely perfect reflection of
          the stars above. With the heavens above reflected below I finally
          didn’t feel separated from the cosmos, but rather enveloped in them,
          floating through infinity.
        </Text> */}

        <div className="space-y-1">
          {/* <Text className="text-[#000000] text-[20px] font-semibold leading-[25px] font-newCourier ">
            PRINT SIZES:
          </Text>
          <Text className="text-[#000000] text-[20px] font-normal leading-[25px] font-newCourier">
            The three print sizes offered in this collection are specifically
            chosen to allow for easy framing:
          </Text>
          <Text className="text-[#000000] text-[20px] font-semibold leading-[25px] font-newCourier">
            Normal:{" "}
            <span className="font-normal">16.5&rdquo; x 23.4&rdquo;</span>
          </Text> */}
          {/* <Text className="text-[#000000] text-[20px] font-normal leading-[25px] font-newCourier">
            The four print sizes offered in this collection are specifically
            chosen to allow for easy framing:
          </Text> */}
          {/* <Text className="text-[#000000] text-[20px] font-semibold leading-[25px] font-newCourier">
            Large:{" "}
            <span className="font-normal">
              23.4&rdquo; x 33.1&rdquo; *Best Value Price/Size Ratio
            </span>
          </Text>
          <Text className="text-[#000000] text-[20px] font-normal leading-[25px] font-newCourier">
            Edition of 7 includes: A signed certificate of authenticity, with
            edition number.
          </Text>
          <Text className="text-[#000000] text-[20px] font-semibold leading-[25px] font-newCourier">
            Extra Large:{" "}
            <span className="font-normal">27.6&rdquo;x 39.4&rdquo;</span>
          </Text>
          <Text className="text-[#000000] text-[20px] font-normal leading-[25px] font-newCourier">
            Edition of 3 includes: A signed certificate of authenticity, with
            edition number.
          </Text> */}
          {/* <Text className="text-[#000000] text-[20px] font-semibold leading-[25px] font-newCourier">
            EXTRA LARGE: <span className="font-normal">40&rdquo; x 60</span>
          </Text>
          <Text className="text-[#000000] text-[20px] font-normal leading-[25px] font-newCourier">
            Fully exclusive 1 of 1 edition includes: A signed certificate of
            authenticity, with edition number.
          </Text> */}
        </div>

        {/* <Text className="text-[#000000] text-[20px] font-normal leading-[25px] font-newCourier mt-5">
          For more information, please see my Print Sizing Guide.
        </Text>
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px] font-newCourier mt-5">
          Printed on Hahnemühle Photo Rag®, a museum-quality archival paper with
          brilliant colors, deep blacks, striking contrasts and perfect
          reproduction of detail. This acid- and lignin-free paper meets the
          most exacting requirements for age resistance, for photos that last
          several lifetimes. All prints include a signed Certificate of
          Authenticity along with edition number.
        </Text>
        <Text className="text-[#000000] text-[20px] font-normal leading-[25px] font-newCourier mt-5">
          Ships Worldwide within 5-7 business days.
        </Text>
        <Text className="text-[#000000] text-[20px] font-semibold leading-[25px] font-newCourier mt-5">
          Quality Guaranteed:{" "}
          <span className="font-normal">
            If your print arrives damaged, please email me at
            keyiscreation@gmail.com to receive a replacement, absolutely free.
          </span>
        </Text> */}

        <div className="font-normal text-[#000000] text-[20px] leading-[25.64px] mb-6 font-newCourier">
          {savedContent ? (
            <div
              dangerouslySetInnerHTML={{
                __html: savedContent,
              }}
            />
          ) : (
            <p>No content available.</p>
          )}
        </div>
        {/* Related products */}
        <RelatedProducts />
      </div>
    </div>
  );
};

export default Product;
