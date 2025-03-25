import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

import Text from "@/components/ui/Text";

type ImageType = {
  left: File | null;
  center: File | null;
  right: File | null;
};

type SocialLinksType = {
  youtube: string;
  twitter: string;
  instagram: string;
  facebook: string;
};

// Upload image to Cloudinary
const uploadImageToCloudinary = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "art-gallery"); // Replace with your Cloudinary upload preset

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/duox5d29k/image/upload", // Replace with your Cloudinary cloud name
      formData
    );

    return response.data.secure_url; // Get the uploaded image URL
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

const UploadAboutData = () => {
  const [title, setTitle] = useState<string>("");
  const [intro, setIntro] = useState<string>("");
  const [socialLinks, setSocialLinks] = useState<SocialLinksType>({
    youtube: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  const [images, setImages] = useState<ImageType>({
    left: null,
    center: null,
    right: null,
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    position: keyof ImageType
  ) => {
    if (e.target.files && e.target.files[0]) {
      setImages((prev) => ({ ...prev, [position]: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const uploadedImages = await Promise.all(
        Object.entries(images).map(async ([key, file]) => {
          if (file) {
            return [key, await uploadImageToCloudinary(file)];
          }
          return [key, null];
        })
      );

      const imageUrls = Object.fromEntries(uploadedImages);

      await addDoc(collection(db, "aboutData"), {
        title,
        intro,
        socialLinks,
        images: imageUrls,
      });

      alert("Data uploaded successfully!");
      setTitle("");
      setIntro("");
      setSocialLinks({ youtube: "", twitter: "", instagram: "", facebook: "" });
      setImages({ left: null, center: null, right: null });
    } catch (error) {
      console.error("Error uploading data:", error);
      alert("Error uploading data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-[12px] w-full max-w-[1268px] my-[100px] px-5">
      <div className="shadow-md p-8 rounded-[12px]">
        <Text className="text-center text-[57px] text-black font-medium">
          Upload About Data
        </Text>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-futurapt mb-1">Title</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md font-futurapt"
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Introduction</label>
            <textarea
              className="w-full p-2 border rounded-md font-futurapt"
              rows={5}
              required
              value={intro}
              onChange={(e) => setIntro(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Social Links</label>
            {Object.keys(socialLinks).map((key) => (
              <input
                key={key}
                required
                type="text"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                className="w-full p-2 border rounded-md font-futurapt mb-2"
                value={socialLinks[key as keyof SocialLinksType]}
                onChange={(e) =>
                  setSocialLinks((prev) => ({
                    ...prev,
                    [key]: e.target.value,
                  }))
                }
              />
            ))}
          </div>

          <div>
            {Object.keys(images).map((key) => (
              <div key={key}>
                <label className="block font-futurapt mb-1">
                  {key.charAt(0).toUpperCase() + key.slice(1)} Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  required
                  className="w-full p-2 border rounded-md font-futurapt mb-2"
                  onChange={(e) => handleFileChange(e, key as keyof ImageType)}
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="flex justify-center items-center text-[18px] font-normal leading-[23.08px] hover:opacity-85 transition duration-500 ease-in-out w-full max-w-[300px] h-[50px] mx-auto bg-black hover:bg-[#000000]/90 text-white p-2 rounded-md
"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Data"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadAboutData;
