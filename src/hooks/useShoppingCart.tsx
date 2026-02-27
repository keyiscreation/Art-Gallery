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
      (Array.isArray(cartItems) ? cartItems : []).reduce(
        (quantity: number, item: CartItem) => item.quantity + quantity,
        0
      ),
    [cartItems]
  );

  const getItemQuantity = (id: number | string, size?: string) => {
    console.log(size);
    return (Array.isArray(cartItems) ? cartItems : []).find((item: CartItem) => item.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id: number | string, size?: string) => {
    setCartItems((currItems: CartItem[]) => {
      const items = Array.isArray(currItems) ? currItems : [];
      const existingItem = items.find((item: CartItem) => item.id === id);

      if (existingItem == null) {
        return [...items, { id, quantity: 1, size }];
      } else {
        return items.map((item: CartItem) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity + 1 };
          }
          return item;
        });
      }
    });
  };

  const decreaseCartQuantity = (id: number | string, size?: string) => {
    console.log(size);
    setCartItems((currItems: CartItem[]) => {
      const items = Array.isArray(currItems) ? currItems : [];
      if (items.find((item) => item.id === id)?.quantity === 1) {
        return items.filter((item: CartItem) => item.id !== id);
      } else {
        return items.map((item: CartItem) => {
          if (item.id === id) {
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const removeFromCart = (id: number | string, size?: string) => {
    console.log(size);
    setCartItems((currItems: CartItem[]) => {
      const items = Array.isArray(currItems) ? currItems : [];
      return items.filter((item: CartItem) => item.id !== id);
    });
  };

  const setItemSize = (id: number | string, size: string) => {
    setCartItems((currItems: CartItem[]) => {
      const items = Array.isArray(currItems) ? currItems : [];
      return items.map((item: CartItem) => {
        if (item.id === id) {
          return { ...item, size };
        }
        return item;
      });
    });
  };

  const firestoreProducts = useProducts();

  // const cartProducts: (Product & { size?: string })[] = useMemo(() => {
  //   return cartItems
  //     .map((item: CartItem) => {
  //       const foundProduct = firestoreProducts.find(
  //         (product) => product.id === item.id
  //       );
  //       if (foundProduct) {
  //         return { ...foundProduct, size: item.size };
  //       }
  //       return null;
  //     })
  //     .filter(Boolean); // Remove null values
  // }, [cartItems, firestoreProducts]);

  // Generate a list of cart products (each product may include a chosen size)
  const cartProducts: (Product & { size?: string })[] = useMemo(() => {
    const items = Array.isArray(cartItems) ? cartItems : [];
    return items
      .map((item: CartItem) => {
        const foundProduct = firestoreProducts.find(
          (product) => product.id === item.id
        );
        if (foundProduct) {
          return { ...foundProduct, size: item.size };
        }
        return null;
      })
      .filter(Boolean) as (Product & { size?: string })[];
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
