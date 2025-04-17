"use client";
import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import Text from "@/components/ui/Text";
import Button from "@/components/ui/Button";

interface SizeData {
  image: File | null;
  hoverImage: File | null;
  licenseNumber: string;
}

interface Product {
  name: string;
  slugtitle: string;
  price: string;
  sizes: {
    [key: string]: SizeData;
  };
}

interface UpdatedSizes {
  [key: string]: {
    image: string;
    hoverImage: string;
    licenseNumber: string;
  };
}

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState<Product>({
    name: "",
    slugtitle: "",
    price: "",
    sizes: {
      Normal: {
        image: null,
        hoverImage: null,
        licenseNumber: "",
      },
    },
  });

  const [newSizeName, setNewSizeName] = useState("");
  const [loading, setLoading] = useState(false);
  // const defaultSizeName = "W 27.6 * H 39.4 (70x100cm)";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSizeChange = (
    e: ChangeEvent<HTMLInputElement>,
    sizeKey: string
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [sizeKey]: {
          ...prev.sizes[sizeKey],
          [name]: value,
        },
      },
    }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    sizeKey: string,
    type: "image" | "hoverImage"
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProduct((prev) => ({
        ...prev,
        sizes: {
          ...prev.sizes,
          [sizeKey]: {
            ...prev.sizes[sizeKey],
            [type]: file,
          },
        },
      }));
    }
  };

  const handleAddSize = () => {
    const trimmed = newSizeName.trim();
    if (!trimmed) {
      alert("Please enter a size name.");
      return;
    }
    if (product.sizes[trimmed]) {
      alert("Size already exists.");
      return;
    }

    setProduct((prev) => ({
      ...prev,
      sizes: {
        ...prev.sizes,
        [trimmed]: {
          image: null,
          hoverImage: null,
          licenseNumber: "",
        },
      },
    }));
    setNewSizeName("");
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "art-gallery");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/duox5d29k/image/upload",
        formData
      );
      return response.data.secure_url;
    } catch (err) {
      console.error("Image upload error:", err);
      return null;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!product.name || !product.slugtitle || !product.price) {
      alert("Please fill out product name, slug, and price.");
      return;
    }

    setLoading(true);

    try {
      const updatedSizes: UpdatedSizes = {};

      for (const [size, data] of Object.entries(product.sizes)) {
        if (!data.image || !data.hoverImage || !data.licenseNumber) {
          alert(`Please complete all fields for size: ${size}`);
          setLoading(false);
          return;
        }

        const imageURL = await uploadImageToCloudinary(data.image);
        const hoverImageURL = await uploadImageToCloudinary(data.hoverImage);

        if (!imageURL || !hoverImageURL) {
          alert(`Image upload failed for size: ${size}`);
          setLoading(false);
          return;
        }

        updatedSizes[size] = {
          image: imageURL,
          hoverImage: hoverImageURL,
          licenseNumber: data.licenseNumber,
        };
      }

      await addDoc(collection(db, "products"), {
        name: product.name,
        slugtitle: product.slugtitle,
        price: parseFloat(product.price),
        sizes: updatedSizes,
      });

      alert("Product added!");
      setProduct({
        name: "",
        slugtitle: "",
        price: "",
        sizes: {
          Normal: {
            image: null,
            hoverImage: null,
            licenseNumber: "",
          },
        },
      });
    } catch (err) {
      console.error("Product submit error:", err);
      alert("Error adding product.");
    } finally {
      setLoading(false);
    }
  };

  // const migrateSizeNames = async () => {
  //   const productsSnapshot = await getDocs(collection(db, "products"));

  //   for (const productDoc of productsSnapshot.docs) {
  //     const productData = productDoc.data();

  //     if (productData.sizes && productData.sizes["60cmx80cm"]) {
  //       const updatedSizes = { ...productData.sizes };

  //       // Rename 'Normal' to new size name
  //       updatedSizes[defaultSizeName] = updatedSizes["60cmx80cm"];
  //       delete updatedSizes["60cmx80cm"];

  //       await updateDoc(doc(db, "products", productDoc.id), {
  //         sizes: updatedSizes,
  //       });

  //       console.log(`Updated product ${productDoc.id}`);
  //     }
  //   }

  //   console.log("Migration complete!");
  // };

  return (
    <div className="w-full flex justify-center items-center my-[100px] px-5">
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
              placeholder="Enter slug title"
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

          <div className="pt-4 border-t mt-6">
            <Text as="h2" className="text-lg font-bold mb-3">
              Sizes
            </Text>

            {Object.entries(product.sizes).map(([size, data]) => (
              <div key={size} className="mb-6 border p-4 rounded-md">
                <h3 className="font-semibold text-md mb-2">{size} Size</h3>

                <div className="mb-2">
                  <label className="block mb-1 font-futurapt">
                    License Number
                  </label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={data.licenseNumber}
                    onChange={(e) => handleSizeChange(e, size)}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div className="mb-2">
                  <label className="block mb-1 font-futurapt">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, size, "image")}
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-futurapt">
                    Hover Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileChange(e, size, "hoverImage")}
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            ))}

            <div className="flex gap-4 items-center mt-4">
              <input
                type="text"
                placeholder="Enter new size name"
                value={newSizeName}
                onChange={(e) => setNewSizeName(e.target.value)}
                className="p-2 border rounded-md"
              />
              <button
                type="button"
                onClick={handleAddSize}
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Add Size
              </button>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full max-w-[300px] h-[50px] mx-auto bg-black hover:bg-black/80 text-white rounded-md"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </form>
        {/* <button
          className="bg-black py-3 px-5 text-white"
          onClick={migrateSizeNames}
        >
          Rename
        </button> */}
      </div>
    </div>
  );
};

export default AddProduct;
