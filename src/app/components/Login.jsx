"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      try {
        const res = await fetch(`/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        let result;
        try {
          result = await res.json();
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          toast.error("Failed to parse server response. Please try again.");
          setIsLoading(false);
          return;
        }

        if (res.ok) {
          setFormData({
            email: "",
            password: "",
          });
          setErrors({});
          toast.success("Login successful!");
          setTimeout(() => {
            router.push("/");
          }, 2000);
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            password: result.message,
          }));
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An error occurred. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r w-sm h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-[#100224] p-8 rounded-lg shadow-lg w-full max-w-lg mb-5">
        <h1 className="text-2xl font-bold text-center text-gray-300 mb-4">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 h-9 block w-full p-3 border text-gray-300 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
            <p className="text-red-500 text-xs mt-1 min-h-[20px]">
              {errors.email}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 h-9 block w-full p-3 border text-gray-300 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <span
                className="absolute right-2 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p className="text-red-500 text-xs mt-1 min-h-[20px]">
              {errors.password}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              className="bg-black text-white px-4 rounded-md font-bold h-9  hover:bg-violet-500 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Logging in" : "Login"}
            </Button>
          </div>
        </form>

        <p className="mt-2 text-xs text-gray-600">
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
