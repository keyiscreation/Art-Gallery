import { atom, Atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// import { Product } from "@/shopify/types";

export interface IAtomObject {
// eslint-disable-next-line  @typescript-eslint/no-explicit-any
  [key: string]: Atom<any>;
}

const isMounted = atom<boolean>(false);
const isLoading = atom<boolean>(true);

// Ensure cart is always an array (handles corrupt/legacy localStorage)
const cartStorage = {
  getItem: (key: string) => {
    try {
      const value = localStorage.getItem(key);
      if (value == null) return [];
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  setItem: (key: string, value: unknown) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  removeItem: (key: string) => localStorage.removeItem(key),
};

const cart = atomWithStorage("cart", [], cartStorage);
const isCartOpen = atom<boolean>(false);

export const atoms: IAtomObject = {
  isMounted,
  isLoading,
  cart,
  isCartOpen,
};
