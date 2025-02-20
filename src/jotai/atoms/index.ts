import { atom, Atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// import { Product } from "@/shopify/types";

export interface IAtomObject {
  [key: string]: Atom<any>;
}

const isMounted = atom<boolean>(false);
const isLoading = atom<boolean>(true);

const cart = atomWithStorage("cart", []);
const isCartOpen = atom<boolean>(false);

export const atoms: IAtomObject = {
  isMounted,
  isLoading,
  cart,
  isCartOpen,
};
