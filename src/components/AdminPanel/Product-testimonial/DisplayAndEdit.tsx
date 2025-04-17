"use client";

import React, { useEffect, useState } from "react";
import { db } from "@/firebase";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import axios from "axios";
import Image from "next/image";
import Text from "@/components/ui/Text";

interface Review {
  id: string;
  review: string;
  reviewer: string;
  image: string;
}

const DisplayAndEditReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedReview, setEditedReview] = useState<Partial<Review>>({});
  const [newImageFile, setNewImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const snapshot = await getDocs(collection(db, "reviews"));
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Review, "id">),
      }));
      setReviews(data);
    };

    fetchReviews();
  }, []);

  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "art-gallery");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/duox5d29k/image/upload",
      formData
    );
    return res.data.secure_url as string;
  };

  const handleEdit = (review: Review) => {
    setEditingId(review.id);
    setEditedReview(review);
    setNewImageFile(null);
  };

  const handleSave = async () => {
    if (!editingId || !editedReview.review || !editedReview.reviewer) return;

    setIsSaving(true);

    try {
      let imageUrl: string = editedReview.image || "";

      if (newImageFile) {
        imageUrl = await uploadImageToCloudinary(newImageFile);
      }

      await updateDoc(doc(db, "reviews", editingId), {
        review: editedReview.review,
        reviewer: editedReview.reviewer,
        image: imageUrl,
      });

      const updatedReviews: Review[] = reviews.map((r) =>
        r.id === editingId
          ? {
              ...r,
              review: editedReview.review!,
              reviewer: editedReview.reviewer!,
              image: imageUrl,
            }
          : r
      );

      setReviews(updatedReviews);
      setEditingId(null);
      setEditedReview({});
      setNewImageFile(null);
    } catch (error) {
      console.error("Failed to save changes:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this review?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "reviews", id));
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <div className="max-w-[1268px] mx-auto px-4 py-10">
      <Text className="text-[48px] font-bold text-center mb-10 text-black">
        Manage Reviews
      </Text>

      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="border rounded-lg p-5 bg-gray-50 shadow-md space-y-4"
          >
            {editingId === review.id ? (
              <>
                <textarea
                  value={editedReview.review}
                  onChange={(e) =>
                    setEditedReview({ ...editedReview, review: e.target.value })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="text"
                  value={editedReview.reviewer}
                  onChange={(e) =>
                    setEditedReview({
                      ...editedReview,
                      reviewer: e.target.value,
                    })
                  }
                  className="w-full border p-2 rounded"
                />
                <input
                  type="file"
                  onChange={(e) => setNewImageFile(e.target.files?.[0] || null)}
                  className="w-full border p-2 rounded"
                />
                <Image
                  src={
                    newImageFile
                      ? URL.createObjectURL(newImageFile)
                      : review.image
                  }
                  alt="Review"
                  width={120}
                  height={120}
                  className="rounded"
                />
                <div className="flex gap-2 justify-end">
                  <button
                    className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded"
                    onClick={() => {
                      setEditingId(null);
                      setEditedReview({});
                      setNewImageFile(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </>
            ) : (
              <>
                <Text className="text-black">{review.review}</Text>
                <Text className="font-semibold text-black">
                  — {review.reviewer}
                </Text>
                <Image
                  src={review.image}
                  alt="Review"
                  width={120}
                  height={120}
                  className="rounded"
                />
                <div className="flex gap-2 justify-end mt-3">
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                    onClick={() => handleEdit(review)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-600 text-white px-4 py-2 rounded"
                    onClick={() => handleDelete(review.id)}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayAndEditReviews;
