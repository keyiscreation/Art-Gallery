import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { db } from "@/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import Text from "@/components/ui/Text";

// Type for Navbar Links
type NavbarLink = {
  name: string;
  url: string;
};

// Type for Navbar Data
type NavbarDataType = {
  id: string;
  logoUrl: string;
  links: NavbarLink[];
};

const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "art-gallery");

  try {
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/duox5d29k/image/upload",
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

const NavbarDataManager = () => {
  // State to hold all navbar records fetched from Firestore
  const [navbarData, setNavbarData] = useState<NavbarDataType[]>([]);
  const [loading, setLoading] = useState(false);

  // States for handling updates
  const [logo, setLogo] = useState<File | null>(null);
  const [navbarLinks, setNavbarLinks] = useState<NavbarLink[]>([]);
  const [editingData, setEditingData] = useState<NavbarDataType | null>(null);

  // Fetch the navbar data on component mount
  useEffect(() => {
    const fetchNavbarData = async () => {
      const querySnapshot = await getDocs(collection(db, "navbarData"));
      const fetchedData: NavbarDataType[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedData.push({
          id: docSnap.id,
          ...docSnap.data(),
        } as NavbarDataType);
      });
      setNavbarData(fetchedData);
    };

    fetchNavbarData();
  }, []);

  // Handle changes for the logo file input
  const handleLogoChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0]);
    }
  };

  // Handle changes in each link input
  const handleLinkChange = (
    index: number,
    e: ChangeEvent<HTMLInputElement>,
    field: "name" | "url"
  ) => {
    const newLinks = [...navbarLinks];
    newLinks[index][field] = e.target.value;
    setNavbarLinks(newLinks);
  };

  // Add a new empty link field to the current editing record
  const handleAddLink = () => {
    setNavbarLinks([...navbarLinks, { name: "", url: "" }]);
  };

  // Remove a link from the current editing record
  const handleRemoveLink = (index: number) => {
    const newLinks = navbarLinks.filter((_, i) => i !== index);
    setNavbarLinks(newLinks);
  };

  // Utility to refresh the data from Firestore after an update
  const refreshNavbarData = async () => {
    const querySnapshot = await getDocs(collection(db, "navbarData"));
    const fetchedData: NavbarDataType[] = [];
    querySnapshot.forEach((docSnap) => {
      fetchedData.push({ id: docSnap.id, ...docSnap.data() } as NavbarDataType);
    });
    setNavbarData(fetchedData);
  };

  // Submit handler for updating a record
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingData) return;
    setLoading(true);

    // If a new logo is provided, upload and update the logoUrl; otherwise, keep the existing one.
    let logoUrl = editingData.logoUrl || "";
    if (logo) {
      const uploadedLogoUrl = await uploadImageToCloudinary(logo);
      if (uploadedLogoUrl) {
        logoUrl = uploadedLogoUrl;
      }
    }

    try {
      const docRef = doc(db, "navbarData", editingData.id);
      await updateDoc(docRef, {
        logoUrl,
        links: navbarLinks,
      });
      console.log("Document updated with ID:", editingData.id);
      await refreshNavbarData();
      setEditingData(null);
      setLogo(null);
      setNavbarLinks([]);
    } catch (error) {
      console.error("Error updating document:", error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger edit mode for a specific record
  const handleEdit = (data: NavbarDataType) => {
    setEditingData(data);
    setNavbarLinks(data.links);
    setLogo(null);
  };

  // Cancel the inline edit
  const handleCancelEdit = () => {
    setEditingData(null);
    setLogo(null);
    setNavbarLinks([]);
  };

  return (
    <div className="rounded-[12px] w-full max-w-[1268px] my-[100px] px-5">
      <div className="mt-8">
        <Text className="text-center text-[40px] text-black font-medium">
          Navbar Data
        </Text>
        {navbarData.map((data) => {
          const isEditing = editingData && editingData.id === data.id;
          return (
            <div key={data.id} className="shadow-md p-4 rounded-md mb-4">
              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <label className="block mb-2">Logo:</label>
                      <input type="file" onChange={handleLogoChange} />
                    </div>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="bg-gray-500 text-white p-2 rounded-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  {logo ? (
                    <img
                      src={URL.createObjectURL(logo)}
                      alt="Logo Preview"
                      className="w-16 h-16 mb-4"
                    />
                  ) : data.logoUrl ? (
                    <img
                      src={data.logoUrl}
                      alt="Logo"
                      className="w-16 h-16 mb-4"
                    />
                  ) : null}
                  <div className="mb-4">
                    <Text className="font-medium mb-2">Navbar Links:</Text>
                    {navbarLinks.map((link, index) => (
                      <div key={index} className="mb-2 flex items-center">
                        <input
                          type="text"
                          value={link.name}
                          onChange={(e) => handleLinkChange(index, e, "name")}
                          placeholder="Link Name"
                          className="border p-2 rounded mr-2"
                        />
                        <input
                          type="text"
                          value={link.url}
                          onChange={(e) => handleLinkChange(index, e, "url")}
                          placeholder="Link URL"
                          className="border p-2 rounded mr-2"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveLink(index)}
                          className="bg-red-500 text-white p-2 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={handleAddLink}
                      className="bg-blue-500 text-white p-2 rounded mt-2"
                    >
                      Add Link
                    </button>
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-500 text-white p-2 rounded"
                  >
                    {loading ? "Saving..." : "Save"}
                  </button>
                </form>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    {data.logoUrl ? (
                      <img
                        src={data.logoUrl}
                        alt="Logo"
                        className="w-16 h-16"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 flex items-center justify-center">
                        No Logo
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => handleEdit(data)}
                      className="bg-blue-500 text-white p-2 rounded-md"
                    >
                      Edit
                    </button>
                  </div>
                  <div>
                    {data.links.map((link, index) => (
                      <div key={index} className="mb-2">
                        <strong>{link.name}</strong>:{" "}
                        <a
                          href={link.url}
                          className="text-blue-500"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.url}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NavbarDataManager;
