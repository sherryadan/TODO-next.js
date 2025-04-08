"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
const Form = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    website: "",
    email: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First Name is required";
      isValid = false;
    } else if (/\d/.test(formData.firstName)) {
      newErrors.firstName = "Invalid first name";
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last Name is required";
      isValid = false;
    } else if (/\d/.test(formData.lastName)) {
      newErrors.lastName = "Invalid Last Name";
      isValid = false;
    }

    if (!formData.company.trim()) {
      newErrors.company = "Company name is required";
      isValid = false;
    }

    const phoneRegex = /^\+92\d{10}$/;
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format (e.g., +923001234567)";
      isValid = false;
    }

    const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,})(\/\S*)?$/;
    if (!formData.website.trim()) {
      newErrors.website = "Website URL is required";
      isValid = false;
    } else if (!urlRegex.test(formData.website)) {
      newErrors.website = "Enter a valid URL (e.g., https://example.com)";
      isValid = false;
    }

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

    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const res = await fetch("/api/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const result = await res.json();

        if (res.ok) {
          alert(result.message);
          setFormData({
            firstName: "",
            lastName: "",
            company: "",
            phone: "",
            website: "",
            email: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
          });
          setErrors({});
        } else {
          alert(result.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  };

  return (
    <div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg mb-5">
        <h1 className="text-2xl font-bold text-center mb-4">
          Create an account
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                className="mt-1 h-9 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-0"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
              />
              <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                className="mt-1 h-9 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-0"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
              />
              <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Company
              </label>
              <input
                type="text"
                className="mt-1 h-9 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-0"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <p className="text-red-500 text-xs mt-1">{errors.company}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="text"
                className="mt-1 h-9 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-0"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Website
            </label>
            <input
              type="text"
              className="mt-1 h-9 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-0"
              placeholder="Enter your website URL"
              value={formData.website}
              onChange={(e) =>
                setFormData({ ...formData, website: e.target.value })
              }
            />
            <p className="text-red-500 text-xs mt-1">{errors.website}</p>
          </div>

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

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              className="mt-1 h-9 block w-full p-3 border border-gray-300 rounded-sm shadow-sm focus:outline-0"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
              }
            />
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword}
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="submit"
              className="w-20 h-10 bg-black text-white rounded-sm text-sm font-medium hover:bg-gray-800"
            >
              SignUp
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
          Already have an account?{" "}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Form;
