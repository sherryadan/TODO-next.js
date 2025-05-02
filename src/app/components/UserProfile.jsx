"use client";
import { useState, useEffect, useRef } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { PencilIcon, CheckIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema for validation
const userSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address").min(1, "Email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  website: z.string().optional(),
});

export default function UserProfile() {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    website: "",
    avatarUrl: "",
  });
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editingAvatar, setEditingAvatar] = useState(false);

  const fileInputRef = useRef(null);

  // UseForm hook with zodResolver
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    async function fetchUserData() {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          setUser(data);

          // Populate form fields with fetched data
          setValue("firstName", data.firstName);
          setValue("lastName", data.lastName);
          setValue("email", data.email);
          setValue("phone", data.phone);
          setValue("company", data.company);
          setValue("website", data.website);

          if (data.avatarUrl) {
            setPreview(data.avatarUrl);
          }
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Error fetching user data");
      }
    }
    fetchUserData();
  }, [setValue]);

  const getInitials = () => {
    const { firstName, lastName } = user;
    return `${firstName?.[0] || ""}${lastName?.[0] || ""}`.toUpperCase();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      setPreview(URL.createObjectURL(file));
      setEditingAvatar(true);
    }
  };

  const handleSaveAvatar = async () => {
    const formData = new FormData();
    formData.append("avatar", avatar);

    const userId = user._id;

    try {
      const res = await fetch(`/api/uploadphoto?userId=${userId}`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("Avatar updated!");
        setUser((prevUser) => ({
          ...prevUser,
          avatarUrl: data.avatarUrl,
        }));
        setPreview(data.avatarUrl);
        setEditingAvatar(false);
      } else {
        toast.error("Failed to upload avatar");
      }
    } catch (err) {
      toast.error("Error uploading image");
      console.error(err);
    }
  };

  const handleDeleteAvatar = async () => {
    const userId = user._id;

    try {
      const res = await fetch(`/api/deletephoto?userId=${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Avatar deleted");
        setUser((prevUser) => ({
          ...prevUser,
          avatarUrl: "",
        }));
        setPreview(null);
        setAvatar(null);
        setEditingAvatar(false);
      } else {
        toast.error("Failed to delete avatar");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error deleting avatar");
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      const response = await fetch("/api/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("User info updated!");
        console.log("Updated user:", result.user);
      } else {
        toast.error(result.error || "Update failed");
        console.error("Update error:", result.error);
      }
    } catch (err) {
      console.error("Fetch failed:", err);
      toast.error("Network or server error");
    }
  };

  return (
    <div className=" bg-gradient-to-r mt-20">
      <div className="bg-[#100224] p-8 rounded-lg shadow-lg w-full max-w-lg mb-5">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-300">
          User Profile
        </h1>
        <div className="flex flex-col mb-6">
          <div className="relative w-30 h-30 rounded-md overflow-hidden bg-[#2b1e4a] text-white text-xl font-bold">
            {preview ? (
              <img
                src={preview}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{getInitials()}</span>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-1 right-1 bg-white p-1 rounded-full cursor-pointer hover:bg-gray-200 transition duration-200 ease-in-out"
              title="Update Avatar"
            >
              <PencilIcon className="h-4 w-4 text-black" />
            </button>
          </div>

          {editingAvatar && (
            <Button
              onClick={handleSaveAvatar}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded-sm cursor-pointer"
            >
              <CheckIcon className="h-4 w-4 mr-1" /> Save
            </Button>
          )}

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                First Name
              </label>
              <input
                type="text"
                {...register("firstName")}
                className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              />
              {errors.firstName && (
                <p className="text-red-500 text-xs">
                  {errors.firstName.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                {...register("lastName")}
                className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              />
              {errors.lastName && (
                <p className="text-red-500 text-xs">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Company
              </label>
              <input
                type="text"
                {...register("company")}
                className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Phone
              </label>
              <input
                type="text"
                {...register("phone")}
                className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Website
            </label>
            <input
              type="text"
              {...register("website")}
              className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              {...register("email")}
              className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email.message}</p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-[#b182dd] hover:bg-[#a072cc] text-white font-bold py-2 px-4 rounded-sm focus:outline-none cursor-pointer"
          >
            Update
          </Button>
        </form>
      </div>
    </div>
  );
}
