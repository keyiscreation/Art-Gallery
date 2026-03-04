"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

import Text from "../ui/Text";
import useShoppingCart from "@/hooks/useShoppingCart";

interface SizeDetail {
  image: string;
  hoverImage: string;
  licenseNumber: string;
  stock?: number;
}

interface ProductData {
  id: string;
  title: string;
  slugtitle: string;
  price: number;
  image: string;
  sizes?: Record<string, SizeDetail>;
}

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: ProductData | null;
}

// Default dimensions for standard sizes (when not in Firestore)
const SIZE_DIMENSIONS: Record<string, string> = {
  Small: "29.7 x 42.0 cm",
  Medium: "59 x 84 cm",
  Large: "70 x 93 cm",
};

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const router = useRouter();
  const { getItemQuantity, increaseCartQuantity, setItemSize } =
    useShoppingCart();

  useEffect(() => {
    if (product?.sizes && !selectedSize) {
      const defaultSize = product.sizes["Small"]
        ? "Small"
        : Object.keys(product.sizes)[0];
      setSelectedSize(defaultSize);
      if (defaultSize) setItemSize(product.id, defaultSize);
    }
  }, [product?.sizes, product?.id, setItemSize, selectedSize]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const SIZE_ORDER = ["Small", "Medium", "Large"];
  const availableSizes = product.sizes
    ? Object.keys(product.sizes).sort(
        (a, b) =>
          (SIZE_ORDER.indexOf(a) >= 0 ? SIZE_ORDER.indexOf(a) : 999) -
          (SIZE_ORDER.indexOf(b) >= 0 ? SIZE_ORDER.indexOf(b) : 999),
      )
    : [];
  const showSizeOptions =
    product.sizes &&
    (availableSizes.length > 1 || availableSizes[0] !== "Small");

  let currentImage = product.image;
  if (product.sizes && availableSizes.length > 0) {
    const defaultSize = product.sizes["Small"] ? "Small" : availableSizes[0];
    currentImage =
      product.sizes[selectedSize || defaultSize]?.image || product.image;
  }

  const onAddToCart = () => {
    const quantity = getItemQuantity(product.id);
    if (quantity > 0) {
      onClose();
      router.push("/cart");
      return;
    }
    increaseCartQuantity(product.id, selectedSize);
    onClose();
    router.push("/cart");
  };

  const onBuyNow = () => {
    const quantity = getItemQuantity(product.id);
    if (quantity > 0) {
      onClose();
      router.push("/checkout");
      return;
    }
    increaseCartQuantity(product.id, selectedSize);
    onClose();
    router.push("/checkout");
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/70 p-4 desk:items-center"
      onClick={handleBackdropClick}
    >
      <div
        className="relative flex w-full max-w-[1267.97px] flex-col rounded-lg bg-white shadow-xl desk:flex-row desk:h-[90vh] desk:max-h-[900px] desk:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back button - fixed at top on mobile, inside image on desktop */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 z-20 flex desk:hidden items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-md transition hover:bg-white"
          aria-label="Back"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </button>

        {/* Mobile: scrollable area with image + product info (pt for back button) */}
        <div className="flex flex-1 flex-col desk:flex-row desk:overflow-hidden">
          {/* Left section - Image (~65%) */}
          <div className="relative w-full desk:w-[65%] h-[300px] shrink-0 desk:h-full desk:min-h-0">
            <button
              onClick={onClose}
              className="absolute left-4 top-4 z-10 hidden desk:flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-md transition hover:bg-white"
              aria-label="Back"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back
            </button>
            <Image
              src={currentImage}
              alt={product.title}
              fill
              className="object-cover desk:object-contain"
              onContextMenu={(e) => e.preventDefault()}
              sizes="70vw"
            />
          </div>

          {/* Right section - Product details (~35%) */}
          <div className="flex w-full flex-col p-6 desk:w-[35%] desk:min-w-[320px] desk:overflow-y-auto desk:p-8 desk:min-h-0">
            <Text className="text-2xl font-semibold text-black font-newCourier mb-4">
              {product.title}
            </Text>

            {/* Product features */}
            <ul className="mb-6 space-y-2 text-sm text-gray-700 font-newCourier">
              <li>Printed on museum-quality fine art paper</li>
              <li>Museum-quality archival standards</li>
              <li>Digital certificate of authenticity sent to email</li>
            </ul>

            {/* Certificate link */}
            <Link
              href={"/store"}
              className="mb-6 flex items-center gap-2 text-sm text-black hover:underline font-newCourier"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              View certificate of authenticity
            </Link>

            {/* Size selection */}
            {showSizeOptions && (
              <>
                <Text className="mb-3 text-sm font-semibold text-black font-newCourier">
                  Choose size
                </Text>
                <div className="mb-6 grid gap-2">
                  {availableSizes.map((size) => {
                    const dimensions = SIZE_DIMENSIONS[size] || "";
                    const isSelected = selectedSize === size;

                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          setSelectedSize(size);
                          setItemSize(product.id, size);
                        }}
                        className={`flex items-start gap-3  border p-4 text-left transition ${
                          isSelected
                            ? "border-gray-800 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${
                            isSelected ? "border-gray-800" : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <span className="h-2 w-2 rounded-full bg-gray-800" />
                          )}
                        </span>
                        <div className="flex flex-1 flex-col items-start">
                          <span className="font-semibold text-black font-newCourier">
                            {size}
                          </span>
                          {dimensions && (
                            <span className="text-sm text-gray-600 font-newCourier">
                              {dimensions}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-black font-newCourier">
                            ${product.price}
                          </span>
                          <span className="text-xs text-gray-500 font-newCourier">
                            {product.sizes?.[size]?.stock ?? 0} available
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {!showSizeOptions && (
              <Text className="mb-6 text-lg font-medium text-black font-newCourier">
                ${product.price}
              </Text>
            )}

            {/* Action buttons */}
            <div className="mt-6 space-y-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={onBuyNow}
                className="w-full rounded-lg bg-black py-3.5 text-white font-newCourier font-bold shadow-md transition hover:bg-gray-900"
              >
                Buy Now
              </button>
              <button
                type="button"
                onClick={onAddToCart}
                className="w-full rounded-lg border border-gray-300 bg-white py-3.5 text-black font-newCourier font-normal transition hover:bg-gray-50"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
