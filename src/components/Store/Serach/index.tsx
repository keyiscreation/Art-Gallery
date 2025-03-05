"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchProduct() {
  const [license, setLicense] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!license.trim()) return;
    router.push(`/purchasedProduct/${license}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        value={license}
        onChange={(e) => setLicense(e.target.value)}
        placeholder="Enter License Number"
        className="border p-2 rounded"
      />
      <button type="submit" className="bg-black text-white p-2 rounded">
        Go
      </button>
    </form>
  );
}
