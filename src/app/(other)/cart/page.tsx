import Image from "next/image";
import Button from "@/components/ui/Button";
import Text from "@/components/ui/Text";

import product from "@/public/images/prints/related1.png";
import Link from "next/link";
export default function CartPage() {
  return (
    <>
      <div className="overflow-hidden px-5 pb-16">
        <div className="mx-auto w-full max-w-[1267.97px] ">
          <Text as="h1" className="text-black ">
            Shopping Cart
          </Text>

          <div className="flex flex-wrap justify-between my-10">
            <div className="flex gap-4 relative">
              <Image
                className="w-[132px] h-[132px] object-cover"
                src={product}
                alt="product"
              />

              <div className="">
                <Text className="text-[#000000] text-[16px] leading-[20px] font-medium">
                  Two Infinities, And Beyond
                </Text>
                <Text className="text-[#000000] text-[16px] leading-[20px] mt-2">
                  Size: Large
                </Text>

                {/* mob */}
                <div className="flex justify-between mt-10">
                  <div className="ml-20 mob:ml-0 mob:block hidden">
                    <Text className="text-[#000000] text-[16px] leading-[20px]">
                      <span className="mr-2 cursor-pointer">-</span> 1{" "}
                      <span className="ml-2 cursor-pointer">+</span>
                    </Text>
                  </div>

                  <div className=" gap-5 mob:block hidden">
                    <Text className="text-[#000000] text-[16px] leading-[20px]">
                      $2000.00
                    </Text>
                    <Text className=" absolute top-0 right-0 text-[#000000] text-[16px] leading-[20px] font-medium cursor-pointer">
                      x
                    </Text>
                  </div>
                </div>
                {/* mob */}
              </div>
            </div>
            {/*  */}

            <div className="ml-20 mob:ml-0 mob:hidden">
              <Text className="text-[#000000] text-[16px] leading-[20px]">
                <span className="mr-2 cursor-pointer">-</span> 1{" "}
                <span className="ml-2 cursor-pointer">+</span>
              </Text>
            </div>

            <div className="flex gap-5 mob:hidden">
              <Text className="text-[#000000] text-[16px] leading-[20px]">
                $2000.00
              </Text>
              <Text className="text-[#000000] text-[16px] leading-[20px] font-medium cursor-pointer">
                x
              </Text>
            </div>
          </div>
          <hr className="border-[0.5px] border-black/50 w-full my-5" />

          <div className="flex justify-end mt-5">
            <div className="flex  w-full max-w-[363px] justify-between">
              <Text className="text-[16px] text-black font-medium ">
                Subtotal
              </Text>
              <Text className="text-[22px] leading-[28px] text-black font-medium">
                $2000.00
              </Text>
            </div>
          </div>

          <div className="flex justify-end mob:justify-start mt-5">
           <Link href="/checkout" className="w-full max-w-[363px]">
           <Button className="max-w-[363px] h-[57px] rounded-[10px] bg-black text-white  ">
              Checkout
            </Button>
           </Link>
          </div>
        </div>
      </div>
    </>
  );
}
