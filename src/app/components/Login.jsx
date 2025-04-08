"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email (e.g., user@domain.com)";
      isValid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const query = new URLSearchParams({
          email: formData.email,
          password: formData.password,
        }).toString();

        const res = await fetch(`/api/login?${query}`, {
          method: "GET",
        });
        let result;
        try {
          result = await res.json();
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          alert("Unexpected server response. Please try again.");
          return;
        }
  
        if (res.ok) {
          alert(result.message);
          setFormData({
            email: "",
            password: "",
          });
          setErrors({});
          router.push("/");
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: result.message,
          }));
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mb-5">
        <h1 className="text-2xl font-bold text-center mb-4">Login</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="mt-1 h-9 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-0"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 h-9 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-0"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="w-20 h-10 bg-black text-white rounded-sm text-sm font-medium hover:bg-gray-800"
            >
              Login
            </button>
            <button
              className="w-20 h-10 bg-black text-white rounded-sm text-sm font-medium hover:bg-gray-800"
              onClick={() => router.push("/")}
            >
              Back
            </button>
          </div>
        </form>

        <p className="mt-2 text-xs">
          Don't have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;