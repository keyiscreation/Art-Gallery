"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

interface Product {
  name: string;
  slugtitle: string;
  price: string;
  // image: File | null;
  // imageHover: File | null;
  sizes: string[];
  licenseNumber: string;
  // qrLink: string;
  // pathnode: string;
}

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    slugtitle: "",
    price: "",
    // image: null,
    // imageHover: null,
    sizes: [],
    licenseNumber: "",
    // pathnode: "",
    // qrLink: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  // Handle input changes (text fields)
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  // Handle size input (comma-separated)
  const handleSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const sizesArray = e.target.value.split(",").map((size) => size.trim());
    setProduct((prev) => ({ ...prev, sizes: sizesArray }));
  };

  // Handle file input changes
  // const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files && e.target.files[0]) {
  //     setProduct((prev) => ({ ...prev, [e.target.name]: e.target.files![0] }));
  //   }
  // };

  // Upload image to Firebase Storage
  // const uploadImage = async (file: File, folder: string) => {
  //   return new Promise<string>((resolve, reject) => {
  //     const storageRef = ref(storage, `${folder}/${file.name}`);
  //     const uploadTask = uploadBytesResumable(storageRef, file);

  //     uploadTask.on(
  //       "state_changed",
  //       null,
  //       (error) => reject(error),
  //       async () => {
  //         try {

  //           const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
  //           resolve(downloadURL);
  //         } catch (error) {
  //           reject(error);
  //         }
  //       }
  //     );
  //   });
  // };

  // Handle form submit
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (
      !product.name ||
      !product.slugtitle ||
      !product.price
      // !product.image
    ) {
      alert("Please fill all required fields and upload an image.");
      return;
    }

    setLoading(true);

    try {
      // const imageURL = product.image
      //   ? await uploadImage(product.image, "products")
      //   : "";
      // const hoverImageURL = product.imageHover
      //   ? await uploadImage(product.imageHover, "products")
      //   : "";

      // Save product data to Firestore
      await addDoc(collection(db, "products"), {
        name: product.name,
        slugtitle: product.slugtitle,
        price: parseFloat(product.price),
        // image: imageURL,
        // imageHover: hoverImageURL,
        sizes: product.sizes,
        licenseNumber: product.licenseNumber,
        // pathnode: product.pathnode,
        // qrLink: product.qrLink,
      });

      alert("Product added successfully!");
      // setProduct({
      //   name: "",
      //   slugtitle: "",
      //   price: "",
      //   // image: null,
      //   // imageHover: null,
      //   sizes: [],
      //   licenseNumber: "",
      //   // pathnode: "",
      //   // qrLink: "",
      // });
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-full my-[100px]">
      <div className="p-8 rounded-[12px] w-full max-w-[1268px] shadow-md">
        <Text as="h1" className="text-black mb-4 text-center">
          Add Product
        </Text>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-futurapt mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Slug Title</label>
            <input
              type="text"
              name="slugtitle"
              value={product.slugtitle}
              onChange={handleChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter slug title (e.g., infinities)"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Price ($)</label>
            <input
              type="number"
              name="price"
              value={product.price}
              onChange={handleChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Sizes</label>
            <input
              type="text"
              name="sizes"
              value={product.sizes.join(", ")}
              onChange={handleSizeChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter sizes (comma-separated, e.g., S, M, L, XL)"
            />
          </div>
          <div>
            <label className="block font-futurapt mb-1">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={product.licenseNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded-md font-futurapt"
              placeholder="Enter License Number"
            />
          </div>

          {/* <div>
            <label className="block font-futurapt mb-1">Product Image</label>
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md font-futurapt"
            />
          </div> */}

          {/* <div>
            <label className="block font-futurapt mb-1">Hover Image</label>
            <input
              type="file"
              name="imageHover"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full p-2 border rounded-md font-futurapt"
            />
          </div> */}

          <Button
            type="submit"
            className="w-full max-w-[300px] h-[50px] mx-auto bg-black hover:bg-[#000000]/90 text-white p-2 rounded-md "
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
