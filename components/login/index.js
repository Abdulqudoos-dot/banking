"use client";
import React, { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import url from "@/utils/url";

const Login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
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
    // If input is valid, make API request using Axios
    try {
      // Replace 'your_login_api_endpoint' with your actual login API endpoint
      const response = await axios.post(`${url}/api/v1/auth/login`, formData);
      const { token, user } = response.data;
      localStorage.setItem("token", token);
      if (user.isAdmin) {
        router.push("/pages/admin");
      } else {
        router.push("/pages/home");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);

      if (error.response && error.response.status === 401) {
        // Unauthorized (incorrect email or password)
        alert("Incorrect email or password. Please try again.");
      } else {
        // Other error (e.g., server error)
        alert("An error occurred. Please try again later.");
      }
    }
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <div className="container mx-auto p-4 flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold mb-8">Login</h1>
        <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
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
            Login
          </button>
        </form>
        <p className="text-center mt-4">
          Don't have an account?{" "}
          <Link href="/pages/register" className="text-blue-500">
            Register here
          </Link>
        </p>
      </div>
    </>
  );
};

export default Login;
