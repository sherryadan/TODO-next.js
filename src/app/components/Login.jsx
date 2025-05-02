"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";

//  Zod schema
const loginSchema = z.object({
  email: z.string().email("Enter a valid email (e.g., user@domain.com)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const Login = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      let result;
      try {
        result = await res.json();
      } catch (error) {
        toast.error("Failed to parse server response. Please try again.");
        setIsLoading(false);
        return;
      }

      if (res.ok) {
        reset();
        toast.success("Login successful!");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError("password", {
          type: "manual",
          message: result.message || "Invalid credentials",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r w-sm h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-[#100224] p-8 rounded-lg shadow-lg w-full max-w-lg mb-5">
        <h1 className="text-2xl font-bold text-center text-gray-300 mb-4">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              className="mt-1 h-9 block w-full p-3 border text-gray-300 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              placeholder="Enter your email"
              {...register("email")}
            />
            <p className="text-red-500 text-xs mt-1 min-h-[20px]">
              {errors.email?.message}
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
                {...register("password")}
              />
              <span
                className="absolute right-2 top-2.5 cursor-pointer text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <p className="text-red-500 text-xs mt-1 min-h-[20px]">
              {errors.password?.message}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              className="bg-black text-white px-4 rounded-md font-bold h-9 hover:bg-violet-500 cursor-pointer"
              disabled={isLoading}
            >
              {isLoading ? "Logging in..." : "Login"}
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
