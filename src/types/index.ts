import { StaticImageData } from "next/image";
export type Product = {
  id: string;
  title: string;
  slugtitle: string;
  price: number;
  image: StaticImageData;
  imageHover: StaticImageData;
  pathnode: string;
  sizes?: string[];
  qrLink?: string;
  licenseNumber: string;
};
