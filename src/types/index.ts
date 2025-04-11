import { StaticImageData } from "next/image";

export type Product = {
  id: string;
  title: string;
  slugtitle: string;
  price: number;
  image: StaticImageData | string;
  imageHover: StaticImageData | string;
  pathnode: string;
  sizes?: Record<
    string,
    {
      image: string;
      hoverImage?: string;
      licenseNumber?: string;
    }
  >;
  qrLink?: string;
  licenseNumber: string;
};
