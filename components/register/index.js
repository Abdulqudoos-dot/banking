"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import url from "@/utils/url";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    isAdmin: true,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    if (e.target.type === "checkbox") {
      setFormData({
        ...formData,
        [e.target.name]: e.target.checked,
      });
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    }
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
      console.log(formData);
      const response = await axios.post(
        `${url}/api/v1/auth/register`,
        formData
      );
      console.log(formData);
      alert("User added successfully");
      window.location.href = "/";
    } catch (error) {
      console.error("Error registering user:", error);
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
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                id="isAdmin"
                checked={formData.isAdmin}
                name="isAdmin"
                onChange={handleChange}
                className="mr-2 border rounded text-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
              />
              <label htmlFor="admin" className="text-sm text-gray-700">
                Admin
              </label>
            </div>
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
          <Link href="/" className="text-blue-500">
            Login here
          </Link>
        </p>
      </div>
    </>
  );
};

export default Register;
