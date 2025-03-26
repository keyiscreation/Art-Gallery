import React, { useState, FormEvent, ChangeEvent } from "react";
import axios from "axios";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";

import Text from "@/components/ui/Text";

// Type for Social Links
type SocialLinksType = {
  youtube: string;
  twitter: string;
  instagram: string;
  facebook: string;
};

// Type for Navbar Links
type NavbarLink = {
  name: string;
  url: string;
};

// type ImageType = {
//   logo: File | null;
// };

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

const UploadNavbarData = () => {
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [socialLinks, setSocialLinks] = useState<SocialLinksType>({
    youtube: "",
    twitter: "",
    instagram: "",
    facebook: "",
  });

  // State to handle dynamic links (Name and URL pairs)
  const [navbarLinks, setNavbarLinks] = useState<NavbarLink[]>([
    { name: "", url: "" }, // Start with one empty link to add dynamically
  ]);

  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  const handleLinkChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
    field: "name" | "url"
  ) => {
    const newLinks = [...navbarLinks];
    newLinks[index][field] = event.target.value;
    setNavbarLinks(newLinks);
  };

  const handleAddLink = () => {
    setNavbarLinks([...navbarLinks, { name: "", url: "" }]);
  };

  //   const handleRemoveLink = (index: number) => {
  //     const newLinks = navbarLinks.filter((_, i) => i !== index);
  //     setNavbarLinks(newLinks);
  //   };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading

    // Upload the logo if it's selected
    let logoUrl = "";
    if (logo) {
      logoUrl = await uploadImageToCloudinary(logo);
    }

    // Save data to Firestore
    try {
      const docRef = await addDoc(collection(db, "navbarData"), {
        logoUrl,
        links: navbarLinks,
        socialLinks,
      });
      console.log("Document written with ID: ", docRef.id);

      // Reset form states after successful upload
      setLogo(null);
      setNavbarLinks([{ name: "", url: "" }]);
      setSocialLinks({
        youtube: "",
        twitter: "",
        instagram: "",
        facebook: "",
      });
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
      alert("data added sucesfully");
    }
  };

  return (
    <div className="rounded-[12px] w-full max-w-[1268px] my-[100px] px-5">
      <div className="shadow-md p-8 rounded-[12px]">
        <Text className="text-center text-[57px] text-black font-medium">
          Upload Navbar Data
        </Text>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="block font-futurapt mb-1">Logo Image</label>
            <input
              type="file"
              accept="image/*"
              required
              className="w-full p-2 border rounded-md font-futurapt mb-4" // Adjusted margin for spacing
              onChange={handleLogoChange}
            />
          </div>

          <div>
            <label className="block font-futurapt mb-1">Navbar Links</label>
            {navbarLinks.map((link, index) => (
              <div
                key={index}
                className="flex justify-between flex-wrap gap-3 mb-4"
              >
                <input
                  type="text"
                  placeholder="Link Name"
                  className="w-full max-w-[45%] p-2 border rounded-md font-futurapt"
                  value={link.name}
                  onChange={(e) => handleLinkChange(index, e, "name")}
                />
                <input
                  type="text"
                  placeholder="URL"
                  className="w-full max-w-[45%] p-2 border rounded-md font-futurapt"
                  value={link.url}
                  onChange={(e) => handleLinkChange(index, e, "url")}
                />
                {/* <button
                  type="button"
                  className="bg-red-500 text-white font-futurapt w-[150px] rounded-[12px] mt-2"
                  onClick={() => handleRemoveLink(index)}
                >
                  Remove Link
                </button> */}
              </div>
            ))}
            <button
              type="button"
              className="bg-green-500 text-white font-futurapt w-[150px] h-[40px] flex justify-center items-center rounded-[12px] mb-4"
              onClick={handleAddLink}
            >
              Add Link
            </button>
          </div>

          <button
            type="submit"
            className="flex justify-center items-center text-[18px] font-normal leading-[23.08px] hover:opacity-85 transition duration-500 ease-in-out w-full max-w-[300px] h-[50px] mx-auto bg-black hover:bg-[#000000]/90 text-white p-2 rounded-md"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload Data"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UploadNavbarData;
