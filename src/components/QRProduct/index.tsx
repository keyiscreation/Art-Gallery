"use client";
import React from "react";
import Image, { StaticImageData } from "next/image";

import Text from "../ui/Text";

// import productimg from "@/public/images/photos on wall 1.png";
import useShoppingCart from "@/hooks/useShoppingCart";
// import { useRouter } from "next/navigation";

// import logo from "@/public/logo.png";

interface ProductProps {
  product: {
    id: number;
    title: string;
    slugtitle: string;
    price: string;
    image: StaticImageData;
    sizes: string[];
  };
}
const QRProduct: React.FC<ProductProps> = ({ product }) => {
//   const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0]);
//   const [showValidationMessage, setShowValidationMessage] = useState(false);

//   const router = useRouter();
  const {
    // cartProducts,
    // getItemQuantity,
    // increaseCartQuantity,
    // decreaseCartQuantity,
    // removeFromCart,
    // cartProductsTotalPrice,
  } = useShoppingCart();




  return (
    <div>
      <div className="mx-auto w-full max-w-[1267.97px] mob:px-5">
        <Text as="h1" className="text-black text-center">
          Product Detail
        </Text>
        <hr className="border-[0.5px] border-black/50 w-full my-5" />

        <div className="flex flex-wrap items-center gap-10 mt-16 mb-14">
          <div className="w-full max-w-[670px] relative">
            {/* Image container with watermark */}
            <div className="relative w-full h-full">
              {/* Image with watermark */}
              <Image
                className="w-full max-w-[670px] object-cover"
                src={product.image}
                alt={product.title}
              />

            
            </div>
          </div>

          <div className="max-w-[465px]">
            <Text className="text-[38px] text-[#000000] font-semibold font-futura leading-[48px]">
              {product.title}
            </Text>
            <Text className="text-[26px] text-[#000000] font-normal font-futurapt leading-[33.33px]">
              From $250.00
            </Text>
            <Text className="text-[18px] text-[#000000] font-normal font-futurapt leading-[23.08px] mt-3">
              {product.title}
            </Text>

            <Text className="text-[16px] text-[#000000]  font-futurapt leading-[20.51px] font-medium mt-8 mb-1">
              Size:
            </Text>
     

        

          
          </div>
        </div>

      
      </div>
    </div>
  );
};

export default QRProduct;
