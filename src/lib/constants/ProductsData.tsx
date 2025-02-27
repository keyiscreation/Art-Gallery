import product1 from "@/public/images/store/product1.png";
import product2 from "@/public/images/store/Mask group.png";
import product3 from "@/public/images/store/Mask group (1).png";
import product4 from "@/public/images/store/Mask group (2).png";
import product5 from "@/public/images/store/Mask group (3).png";
import product6 from "@/public/images/store/Mask group (4).png";
import product7 from "@/public/images/store/Mask group (5).png";
import product8 from "@/public/images/store/Mask group (6).png";
import product9 from "@/public/images/store/Mask group (7).png";
import product10 from "@/public/images/store/Mask group (8).png";
import product11 from "@/public/images/store/Mask group (9).png";

import product1hover from "@/public/images/store/hover1.jpg";
import product2hover from "@/public/images/store/hover2.jpg";
import product3hover from "@/public/images/store/hover3.jpg";
import product4hover from "@/public/images/store/hover4.jpg";
import product5hover from "@/public/images/store/hover5.jpg";


const sizes = ["Small", "Medium", "Large", "X-Large"];

const ProductsData = [
  {
    id: 1,
    title: "Two Infinities, And Beyond",
    slugtitle: "infinities",
    price: "10.00",
    image: product1,
    imageHover: product1hover,
    pathnode: "product1.png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/infinities",
    licenseNumber: "LN-001"
  },
  {
    id: 2,
    title: "Egrets, I've Had A Few",
    slugtitle: "egrets",
    price: "10.99",
    image: product2,
    imageHover: product2hover,
    pathnode: "Mask group.png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/egrets",
    licenseNumber: "LN-002"
  },
  {
    id: 3,
    title: "America The Beautiful",
    slugtitle: "america",
    price: "20.99",
    image: product3,
    imageHover: product3hover,
    pathnode: "Mask group (1).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/america",
    licenseNumber: "LN-003"
  },
  {
    id: 4,
    title: "Stars and Cars",
    slugtitle: "stars",
    price: "20.99",
    image: product4,
    imageHover: product4hover,
    pathnode: "Mask group (2).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/stars",
    licenseNumber: "LN-004"
  },
  {
    id: 5,
    title: "Colorful Colorado",
    slugtitle: "colorado",
    price: "20.99",
    image: product5,
    imageHover: product5hover,
    pathnode: "Mask group (3).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/colorado",
    licenseNumber: "LN-005"
  },
  {
    id: 6,
    title: "Fairy Fox",
    slugtitle: "fox",
    price: "20.99",
    image: product6,
    imageHover: product5hover,
    pathnode: "Mask group (4).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/fox",
    licenseNumber: "LN-006"
  },
  {
    id: 7,
    title: "Where The Wild Things Are",
    slugtitle: "wild",
    price: "20.99",
    image: product7,
    imageHover: product5hover,
    pathnode: "Mask group (5).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/wild",
    licenseNumber: "LN-007"
  },
  {
    id: 8,
    title: "Moon River",
    slugtitle: "moon",
    price: "20.99",
    image: product8,
    imageHover: product5hover,
    pathnode: "Mask group (6).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/moon",
    licenseNumber: "LN-008"
  },
  {
    id: 9,
    title: "Sharing is Bearing",
    slugtitle: "sharing",
    price: "20.99",
    image: product9,
    imageHover: product5hover,
    pathnode: "Mask group (7).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/sharing",
    licenseNumber: "LN-009"
  },
  {
    id: 10,
    title: "Morning Reflections",
    slugtitle: "morning",
    price: "20.99",
    image: product10,
    imageHover: product5hover,
    pathnode: "Mask group (8).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/morning",
    licenseNumber: "LN-010"
  },
  {
    id: 11,
    title: "First Light",
    slugtitle: "light",
    price: "20.99",
    image: product11,
    imageHover: product5hover,
    pathnode: "Mask group (9).png",
    sizes,
    qrLink: "https://art-gallery-one-theta.vercel.app/product-detail/light",
    licenseNumber: "LN-011"
  }
];

export default ProductsData;
