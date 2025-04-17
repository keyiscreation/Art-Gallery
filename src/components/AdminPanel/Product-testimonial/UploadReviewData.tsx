"use client";

import React, { useState, FormEvent } from "react";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";
import Text from "@/components/ui/Text";

interface Review {
  review: string;
  reviewer: string;
  imageFile: File | null;
}

const UploadReviewData = () => {
  const [reviews, setReviews] = useState<Review[]>([
    { review: "", reviewer: "", imageFile: null },
  ]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (
    index: number,
    field: keyof Review,
    value: string | File | null
  ) => {
    setReviews((prev) => {
      const updated = [...prev];
      const updatedItem = { ...updated[index] };

      if (field === "review" || field === "reviewer") {
        updatedItem[field] = value as string;
      } else if (field === "imageFile") {
        updatedItem.imageFile = value as File | null;
      }

      updated[index] = updatedItem;
      return updated;
    });
  };

  const handleAddReview = () => {
    setReviews([...reviews, { review: "", reviewer: "", imageFile: null }]);
  };

  const handleRemoveReview = (index: number) => {
    const updated = [...reviews];
    updated.splice(index, 1);
    setReviews(updated);
  };

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "art-gallery"); // your preset

    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/duox5d29k/image/upload", // your cloud name
      formData
    );
    return response.data.secure_url;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      for (const reviewData of reviews) {
        if (!reviewData.imageFile) continue;

        const imageUrl = await uploadImageToCloudinary(reviewData.imageFile);

        await addDoc(collection(db, "reviews"), {
          review: reviewData.review,
          reviewer: reviewData.reviewer,
          image: imageUrl,
        });
      }

      alert("All reviews uploaded!");
      setReviews([{ review: "", reviewer: "", imageFile: null }]);
    } catch (err) {
      console.error("Error uploading reviews:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[1268px] shadow-md mx-auto my-12 p-6 rounded-lg">
      <Text className="text-center text-[48px] font-bold mb-8 text-black">
        Upload Multiple Reviews
      </Text>

      <form onSubmit={handleSubmit} className="space-y-6">
        {reviews.map((reviewBlock, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-gray-50 relative space-y-4"
          >
            {reviews.length > 1 && (
              <button
                type="button"
                onClick={() => handleRemoveReview(index)}
                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
              >
                Remove
              </button>
            )}

            <div>
              <label className="font-semibold block mb-1">Review Text</label>
              <textarea
                required
                rows={3}
                className="w-full border p-2 rounded-md"
                value={reviewBlock.review}
                onChange={(e) =>
                  handleInputChange(index, "review", e.target.value)
                }
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Reviewer Name</label>
              <input
                type="text"
                required
                className="w-full border p-2 rounded-md"
                value={reviewBlock.reviewer}
                onChange={(e) =>
                  handleInputChange(index, "reviewer", e.target.value)
                }
              />
            </div>

            <div>
              <label className="font-semibold block mb-1">Image</label>
              <input
                type="file"
                accept="image/*"
                required
                className="w-full border p-2 rounded-md"
                onChange={(e) =>
                  handleInputChange(
                    index,
                    "imageFile",
                    e.target.files?.[0] || null
                  )
                }
              />
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center mt-6">
          <button
            type="button"
            onClick={handleAddReview}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            + Add Another Review
          </button>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded hover:opacity-90"
          >
            {loading ? "Uploading..." : "Submit All Reviews"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadReviewData;
