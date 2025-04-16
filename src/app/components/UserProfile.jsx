"use client"
import { useState, useEffect } from "react";
import toast, {Toaster} from "react-hot-toast";

import { Button } from "@/components/ui/button";

export default function UserProfile() {
    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        company: "",
        website: "",
    });

    useEffect(() => {
        // Fetch user data from the API
        async function fetchUserData() {
            try {
                const response = await fetch('/api/users');
                if (response.ok) {
                    const data = await response.json();
                    setUser(data);
                } else {
                    toast.error("Failed to fetch user data");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                toast.error("Error fetching user data");
            }
        }
        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
      
      
        try {
          const response = await fetch('/api/update', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
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
        <div className="flex justify-center items-center bg-gradient-to-r min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-[#100224] p-8 rounded-lg shadow-lg w-full max-w-lg mb-5">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-300">User Profile</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">First Name</label>
              <input
                type="text"
                name="firstName"
                value={user.firstName}
                onChange={handleChange}
                placeholder="Enter your first name"
                className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={user.lastName}
                onChange={handleChange}
                placeholder="Enter your last name"
                className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">Company</label>
              <input
                type="text"
                name="company"
                value={user.company}
                onChange={handleChange}
                placeholder="Enter your company name"
                className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300">Phone</label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Website</label>
            <input
              type="text"
              name="website"
              value={user.website}
              onChange={handleChange}
              placeholder="Enter your website URL"
              className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="mt-1 h-9 block w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
            />
          </div>
          <Button
            type="submit"
            className="w-full mt-4 bg-[#b182dd] hover:bg-[#a072cc] text-white font-bold py-2 px-4 rounded-sm focus:outline-none"
          >
            Update
          </Button>
        </form>
      </div>
    </div>
    );
}