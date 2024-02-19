"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    setErrors({
      ...errors,
      [e.target.name]: "", // Clear previous error when input changes
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Input validation
    let validationErrors = {};
    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      // Make API request using Axios
      const response = await axios.post(
        "https://fine-teal-zebra-kilt.cyclic.app/api/v1/auth/register",
        formData
      );

      // Handle successful response
      console.log(response.data);

      // Assuming your API returns a success message, you can show an alert to the user
      alert("User added successfully");

      // Redirect to the login page
      window.location.href = "/";
    } catch (error) {
      console.error("Error registering user:", error.message);
      // Handle error response
      // Show an error message or take appropriate action
    }
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <div className="container mx-auto p-4 flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-8">Register</h1>
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <label htmlFor="username" className="text-sm mb-2">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors.username ? "border-red-500" : ""
              }`}
              required
            />
            {errors.username && (
              <p className="text-red-500 text-xs mt-1">{errors.username}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="email" className="text-sm mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors.email ? "border-red-500" : ""
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="password" className="text-sm mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50 ${
                errors.password ? "border-red-500" : ""
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm"
          >
            Register
          </button>
        </form>
        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link href="login" className="text-blue-500">
            Login here
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
