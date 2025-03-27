"use client";
import React, { useState } from "react";

const Form = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    website: "",
    visitors: "",
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

    if (!formData.visitors) {
      newErrors.visitors = "Please select an option";
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

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = "You must accept the terms and conditions";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
      console.log("Form Data:", formData);
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        phone: "",
        website: "",
        visitors: "",
        email: "",
        password: "",
        confirmPassword: "",
        termsAccepted: false,
      });
      setErrors({});
    }
  };

  return (
    <div className="max-w-lg mx-auto p-5 bg-white shadow-md rounded-md">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label>First Name</label>
            <input
              className="w-full p-3 border rounded"
              placeholder="Enter First Name"
              value={formData.firstName}
              onChange={(e) =>
                setFormData({ ...formData, firstName: e.target.value })
              }
            />
            <p className="text-red-500 text-xs">{errors.firstName}</p>
          </div>
          <div>
            <label>Last Name</label>
            <input
              className="w-full p-3 border rounded"
              placeholder="Enter Last Name"
              value={formData.lastName}
              onChange={(e) =>
                setFormData({ ...formData, lastName: e.target.value })
              }
            />
            <p className="text-red-500 text-xs">{errors.lastName}</p>
          </div>
        </div>

        <div>
          <label>Company</label>
          <input
            className="w-full p-3 border rounded"
            placeholder="Enter Company Name"
            value={formData.company}
            onChange={(e) =>
              setFormData({ ...formData, company: e.target.value })
            }
          />
          <p className="text-red-500 text-xs">{errors.company}</p>
        </div>

        <div>
          <label>Phone Number</label>
          <input
            className="w-full p-3 border rounded"
            placeholder="+92xxxxxxxxxx"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
          <p className="text-red-500 text-xs">{errors.phone}</p>
        </div>

        <div>
          <label>Website URL</label>
          <input
            className="w-full p-3 border rounded"
            placeholder="Enter URL"
            value={formData.website}
            onChange={(e) =>
              setFormData({ ...formData, website: e.target.value })
            }
          />
          <p className="text-red-500 text-xs">{errors.website}</p>
        </div>

        <div>
          <label>Unique Visitors (Per Month)</label>
          <select
            className="w-full p-3 border rounded"
            value={formData.visitors}
            onChange={(e) =>
              setFormData({ ...formData, visitors: e.target.value })
            }
          >
            <option value="">Choose monthly visitors</option>
            <option>0 - 1,000</option>
            <option>1,000 - 5,000</option>
            <option>5,000+</option>
          </select>
          <p className="text-red-500 text-xs">{errors.visitors}</p>
        </div>

        <div>
          <label>Email</label>
          <input
            className="w-full p-3 border rounded"
            placeholder="user@company.com"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <p className="text-red-500 text-xs">{errors.email}</p>
        </div>

        <div>
          <label>Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded"
            placeholder="Enter Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <p className="text-red-500 text-xs">{errors.password}</p>
        </div>

        <div>
          <label>Confirm Password</label>
          <input
            type="password"
            className="w-full p-3 border rounded"
            placeholder="Re-enter Password"
            value={formData.confirmPassword}
            onChange={(e) =>
              setFormData({ ...formData, confirmPassword: e.target.value })
            }
          />
          <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
        </div>

        <button className="w-full bg-blue-600 text-white py-3 rounded text-lg">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Form;
