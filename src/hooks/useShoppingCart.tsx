"use client";
import { useMemo } from "react";

import { useAtomValue } from "@/jotai/useAtomValue";
// import products from "@/lib/constants/ProductsData";
import useProducts from "./useProducts";
import { Product } from "@/types";

type CartItem = {
  id: string | number;
  quantity: number;
  size?: string;
};

const useShoppingCart = () => {
  const [cartItems, setCartItems] = useAtomValue("cart");
  const [isOpen, setIsOpen] = useAtomValue("isCartOpen");

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const cartQuantity = useMemo(
    () =>
      cartItems?.reduce(
        (quantity: number, item: CartItem) => item.quantity + quantity,
        0
      ),
    [cartItems]
  );

  const getItemQuantity = (id: number | string) => {
    return cartItems.find((item: CartItem) => item.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id: number | string, size?: string) => {
    setCartItems((currItems: CartItem[]) => {
      const existingItem = currItems.find((item: CartItem) => item.id === id);

      if (existingItem == null) {
        // If the item is not already in the cart, create it with the selected size
        return [...currItems, { id, quantity: 1, size }];
      } else {
        // If the item is already in the cart, increase its quantity
        return currItems.map((item: CartItem) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }
    });
  };

  const decreaseCartQuantity = (id: number | string) => {
    setCartItems((currItems: CartItem[]) => {
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        return currItems.filter((item: CartItem) => item.id !== id);
      } else {
        return currItems.map((item: CartItem) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const removeFromCart = (id: number | string) => {
    setCartItems((currItems: CartItem[]) => {
      return currItems.filter((item: CartItem) => item.id !== id);
    });
  };

  const setItemSize = (id: number | string, size: string) => {
    setCartItems((currItems: CartItem[]) => {
      return currItems.map((item: CartItem) => {
        if (item.id === id) {
          return { ...item, size };
        }
        return item;
      });
    });
  };

  const firestoreProducts = useProducts();

  const cartProducts: (Product & { size?: string })[] = useMemo(() => {
    return cartItems
      .map((item: CartItem) => {
        const foundProduct = firestoreProducts.find(
          (product) => product.id === item.id
        );
        if (foundProduct) {
          return { ...foundProduct, size: item.size };
        }
        return null;
      })
      .filter(Boolean); // Remove null values
  }, [cartItems, firestoreProducts]);

  const cartProductsTotalPrice = useMemo(() => {
    const totalPice = cartProducts.reduce(
      (totalPrice: number, product: Product) =>
        (totalPrice +=
          Number(product.price || 0) * getItemQuantity(product.id)),
      0
    );

    return totalPice;
  }, [firestoreProducts]);

  return {
    getItemQuantity,
    cartQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
    setItemSize,
    isOpen,
    onOpen,
    onClose,
    cartProducts,
    cartProductsTotalPrice,
  };
};

export default useShoppingCart;
