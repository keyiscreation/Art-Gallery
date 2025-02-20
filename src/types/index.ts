import { StaticImageData } from "next/image";

export type Product = {
  id: number;
     title: string;
     slugtitle: string;
     price: string;
     image: StaticImageData;
};
