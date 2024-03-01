"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import url from "@/utils/url";
import Setting from "../setting/page";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "@/components/navbar";

const CurrencyForm = () => {
  const [showForm, setShowForm] = useState(false); // State for form visibility
  const [currencyInfo, setCurrencyInfo] = useState({
    currencyName: "",
    currencySymbol: "",
    currencyCode: "",
    exchangeRate: "",
    currencyFormat: "",
  });

  const [entries, setEntries] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrencyInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingIndex !== null) {
      // If editing, update the existing entry
      try {
        const headers = {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        };
        const response = await axios.put(
          `${url}/api/v1/currency/currencies/${entries[editingIndex]._id}`,
          currencyInfo,
          { headers }
        );
        if (response.status === 200) {
          const updatedEntries = [...entries];
          updatedEntries[editingIndex] = response.data;
          setEntries(updatedEntries);
          setEditingIndex(null);
          alert("Currency Added");
        } else {
          console.error("Failed to update entry:", response.statusText);
        }
      } catch (error) {
        console.error("Error during update:", error);
      }
    } else {
      // If not editing, add a new entry
      try {
        const headers = {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        };
        const response = await axios.post(
          `${url}/api/v1/currency/currencies`,
          currencyInfo,
          { headers }
        );
        if (response.status === 201) {
          const newEntry = response.data;
          setEntries((prevEntries) => [...prevEntries, newEntry]);
        } else {
          console.error("Failed to add new entry:", response.statusText);
        }
      } catch (error) {
        console.error("Error during entry creation:", error);
      }
    }

    // Clear the form fields
    setCurrencyInfo({
      currencyName: "",
      currencySymbol: "",
      currencyCode: "",
      exchangeRate: "",
      currencyFormat: "",
    });

    // Close the form after submission
    setShowForm(false);
  };

  useEffect(() => {
    // Fetch initial currency data
    const fetchData = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        };

        const response = await axios.get(`${url}/api/v1/currency/currencies`, {
          headers,
        });
        if (response.status === 200) {
          setEntries(response.data);
        } else {
          console.error("Failed to fetch currencies:", response.statusText);
        }
      } catch (error) {
        console.error("Error during data fetch:", error);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run once on component mount

  const handleEdit = (index) => {
    setCurrencyInfo(entries[index]);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      const response = await axios.delete(
        `${url}/api/v1/currency/currencies/${entries[index]._id}`,
        { headers }
      );
      if (response.status === 200) {
        const updatedEntries = [...entries];
        updatedEntries.splice(index, 1);
        setEntries(updatedEntries);

        // Clear the form fields if the deleted entry is being edited
        if (editingIndex === index) {
          setEditingIndex(null);
          setCurrencyInfo({
            currencyName: "",
            currencySymbol: "",
            currencyCode: "",
            exchangeRate: "",
            currencyFormat: "",
          });
        }
      } else {
        console.error("Failed to delete entry:", response.statusText);
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  return (
    <>
      {/* <Navbar/> */}
      <Setting />
      <div className="mt-8">
        {/* <h3 className="text-lg font-semibold mb-4">Entered Data</h3> */}
        <table
          className=" bg-white border border-gray-300 text-center w-3/4"
          style={{ marginLeft: "30px" }}
        >
          <thead>
            <tr>
              <th
                className="py-2 px-4 border-b border-white font-medium"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Currency Name
              </th>
              <th
                className="py-2 px-4 border-b font-medium"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Currency Symbol
              </th>
              <th
                className="py-2 px-4 border-b font-medium"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Currency Code
              </th>
              <th
                className="py-2 px-4 border-b font-medium"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Exchange Rate
              </th>
              <th
                className="py-2 px-4 border-b font-medium"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Currency Format
              </th>
              <th
                className="py-2 px-4 border-b font-medium"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Edit
              </th>
              <th
                className="py-2 px-4 border-b font-medium"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b">{entry.currencyName}</td>
                <td className="py-2 px-4 border-b">{entry.currencySymbol}</td>
                <td className="py-2 px-4 border-b">{entry.currencyCode}</td>
                <td className="py-2 px-4 border-b">{entry.exchangeRate}</td>
                <td className="py-2 px-4 border-b">{entry.currencyFormat}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(index)}
                    className="text-green-500 hover:text-green-700 mr-2"
                  >
                    <FaEdit className="text-2xl" />
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleDelete(index)}
                    className="text-red-500 hover:text-red-700"
                    style={{ marginLeft: "15px" }}
                  >
                    <FaTrash className="text-2xl" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        {/* Button to toggle the form visibility */}
        {/* <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 mr-2"
          style={{ marginLeft: "70px" }}
        >
          Add Another Currency
        </button> */}

        {/* {showForm && ( */}
        <div className="container px-20 mt-8">
          <h2 className="text-2xl font-semibold mb-4">Add Currency</h2>

          <form onSubmit={handleSubmit} className="w-[500px]">
            <div className=" mb-4">
              <label
                htmlFor="currencyName"
                className="text-bold "
                style={{ marginTop: "12px" }}
                // className="block text-sm font-medium text-gray-600 w-1/4"
              >
                <b>Currency Name:</b>
              </label>
              <input
                type="text"
                id="currencyName"
                name="currencyName"
                value={currencyInfo.currencyName}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full bg-gray-200"
                required
              />
            </div>

            <div className=" mb-4">
              <label
                htmlFor="currencySymbol"
                className="text-bold "
                style={{ marginTop: "12px" }}
                // className="block text-sm font-medium text-gray-600 w-1/4"
              >
                <b>Currency Symbol:</b>
              </label>
              <input
                type="text"
                id="currencySymbol"
                name="currencySymbol"
                value={currencyInfo.currencySymbol}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full bg-gray-200"
                required
              />
            </div>

            <div className=" mb-4">
              <label
                htmlFor="currencyCode"
                className="text-bold "
                style={{ marginTop: "12px" }}
                // className="block text-sm font-medium text-gray-600 w-1/4"
              >
                <b>Currency Code:</b>
              </label>
              <input
                type="text"
                id="currencyCode"
                name="currencyCode"
                value={currencyInfo.currencyCode}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full bg-gray-200"
                required
              />
            </div>

            <div className=" mb-4">
              <label
                htmlFor="exchangeRate"
                className="text-bold "
                style={{ marginTop: "12px" }}
                // className="block text-sm font-medium text-gray-600 w-1/4"
              >
                <b>Exchange Rate:</b>
              </label>
              <input
                type="number"
                id="exchangeRate"
                name="exchangeRate"
                value={currencyInfo.exchangeRate}
                onChange={handleChange}
                step="0.01"
                className="mt-1 p-2 border rounded-md w-full bg-gray-200"
                required
              />
            </div>

            <div className=" mb-4">
              <label
                htmlFor="currencyFormat"
                className="text-bold "
                style={{ marginTop: "12px" }}
                // className="block text-sm font-medium text-gray-600 w-1/4"
              >
                <b>Currency Format:</b>
              </label>
              <input
                type="text"
                id="currencyFormat"
                name="currencyFormat"
                value={currencyInfo.currencyFormat}
                onChange={handleChange}
                className="mt-1 p-2 border rounded-md w-full bg-gray-200"
                required
              />
            </div>
            {/* <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
                style={{marginLeft: "224px",width:"200px",height:"40px"}}
              >
                Go back
              </button> */}
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 mb-5 ml-[370px]"
              style={{ width: "130px", height: "40px" }}
            >
              {editingIndex !== null ? "Update" : "Submit"}
            </button>
          </form>
        </div>
        {/* )} */}
      </div>
    </>
  );
};

export default CurrencyForm;
