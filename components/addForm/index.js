"use client";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import url from "@/utils/url";

const AddForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    bankName: "",
    acNo: "",
    location: "",
    currency: "",
    balance: 0,
    usdBalance: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    // for (const key in formData) {
    //   if (!formData[key]) {
    //     alert(`Please fill in the ${key} field`);
    //     return;
    //   }
    // }

    // Use Axios to send data (you may need to adjust the URL and method based on your server)
    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      await axios.post(`${url}/api/v1/bank/addBank`, formData, { headers });
      router.push("/pages/home");
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again later.");
    }
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white  shadow-md rounded px-8 pt-6 pb-8 mb-4"
          style={{ width: "600px" }}
        >
          <label
            htmlFor="bankName"
            className="block text-gray-700 font-bold mb-2"
          >
            Bank Name:
          </label>
          <input
            type="text"
            id="bankName"
            name="bankName"
            value={formData.bankName}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <br />

          <label
            htmlFor="accountNumber"
            className="block text-gray-700 font-bold mb-2"
          >
            A/c no.:
          </label>
          <input
            type="text"
            id="acNo"
            name="acNo"
            value={formData.acNo}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <br />

          <label
            htmlFor="location"
            className="block text-gray-700 font-bold mb-2"
          >
            Location:
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <br />

          <label
            htmlFor="currency"
            className="block text-gray-700 font-bold mb-2"
          >
            Currency:
          </label>
          <input
            type="text"
            id="currency"
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <br />

          <label
            htmlFor="balance"
            className="block text-gray-700 font-bold mb-2"
          >
            Balance:
          </label>
          <input
            type="number"
            id="balance"
            name="balance"
            value={formData.balance}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <br />

          <label
            htmlFor="usdEquivalent"
            className="block text-gray-700 font-bold mb-2"
          >
            US$ Equivalent Balance:
          </label>
          <input
            type="number"
            id="usdBalance"
            name="usdBalance"
            value={formData.usdBalance}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <br />
          <br />

          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-32"
          >
            Submit
          </button>
        </form>
      </div>
    </>
  );
};

export default AddForm;
