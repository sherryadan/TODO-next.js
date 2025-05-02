"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import toast, { Toaster } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod Schema
const formSchema = z.object({
  firstName: z
    .string()
    .min(1, "First Name is required")
    .regex(/^[^\d]+$/, "Invalid first name"),
  lastName: z
    .string()
    .min(1, "Last Name is required")
    .regex(/^[^\d]+$/, "Invalid last name"),
  company: z.string().min(1, "Company name is required"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+92\d{10}$/, "Invalid phone number format (e.g., +923001234567)"),
  website: z
    .string()
    .min(1, "Website URL is required")
    .url("Enter a valid URL (e.g., https://example.com)"),
  email: z
    .string()
    .min(1, "Email is required")
    .email("Enter a valid email (e.g., user@domain.com)"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string().min(1, "Please confirm your password"),
}).refine((data) => data.password === data.confirmPassword, {
  path: ["confirmPassword"],
  message: "Passwords do not match",
});

const Form = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    setSignupLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Account created successfully!");
        reset();
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r w-lg min-h-screen">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="bg-[#100224] p-8 rounded-lg shadow-lg w-full max-w-lg mb-5">
        <h1 className="text-2xl font-bold text-center mb-4 text-gray-300">Create an account</h1>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300">First Name</label>
              <input
                type="text"
                className="mt-1 h-9 w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
                placeholder="Enter your first name"
                {...register("firstName")}
              />
              <p className="text-red-500 text-xs mt-1 min-h-[17px]">{errors.firstName?.message}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Last Name</label>
              <input
                type="text"
                className="mt-1 h-9 w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
                placeholder="Enter your last name"
                {...register("lastName")}
              />
              <p className="text-red-500 text-xs mt-1 min-h-[17px]">{errors.lastName?.message}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300">Company</label>
              <input
                type="text"
                className="mt-1 h-9 w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
                placeholder="Enter your company name"
                {...register("company")}
              />
              <p className="text-red-500 text-xs mt-1 min-h-[17px]">{errors.company?.message}</p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-300">Phone</label>
              <input
                type="text"
                className="mt-1 h-9 w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
                placeholder="Enter your phone number"
                {...register("phone")}
              />
              <p className="text-red-500 text-xs mt-1 min-h-[17px]">{errors.phone?.message}</p>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Website</label>
            <input
              type="text"
              className="mt-1 h-9 w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              placeholder="Enter your website URL"
              {...register("website")}
            />
            <p className="text-red-500 text-xs mt-1 min-h-[17px]">{errors.website?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Email</label>
            <input
              type="email"
              className="mt-1 h-9 w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              placeholder="Enter your email"
              {...register("email")}
            />
            <p className="text-red-500 text-xs mt-1 min-h-[17px]">{errors.email?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="mt-1 h-9 w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
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
            <p className="text-red-500 text-xs mt-1 min-h-[17px]">{errors.password?.message}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300">Confirm Password</label>
            <input
              type="password"
              className="mt-1 h-9 w-full p-3 border text-amber-50 border-gray-300 rounded-sm shadow-sm focus:outline-0 placeholder-gray-600"
              placeholder="Re-enter your password"
              {...register("confirmPassword")}
            />
            <p className="text-red-500 text-xs mt-1 min-h-[17px]">{errors.confirmPassword?.message}</p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="submit"
              className="w-20 h-10 bg-black text-white rounded-sm text-sm font-medium hover:bg-violet-500"
              disabled={signupLoading}
            >
              {signupLoading ? "..." : "SignUp"}
            </Button>
          </div>
        </form>

        <p className="mt-2 text-xs text-gray-600">
          Already have an account?{" "}
          <span className="text-blue-500 cursor-pointer" onClick={() => router.push("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Form;
