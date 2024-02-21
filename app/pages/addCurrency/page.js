"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import url from "@/utils/url";

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
        const response = await axios.put(
          `${url}/api/v1/currency/currencies/${entries[editingIndex]._id}`,
          currencyInfo
        );
        if (response.status === 200) {
          const updatedEntries = [...entries];
          updatedEntries[editingIndex] = response.data;
          setEntries(updatedEntries);
          setEditingIndex(null);
        } else {
          console.error("Failed to update entry:", response.statusText);
        }
      } catch (error) {
        console.error("Error during update:", error);
      }
    } else {
      // If not editing, add a new entry
      try {
        const response = await axios.post(
          `${url}/api/v1/currency/currencies`,
          currencyInfo
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
        const response = await axios.get(`${url}/api/v1/currency/currencies`);
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
    // Set the form fields to the values of the selected entry
    setCurrencyInfo(entries[index]);
    setEditingIndex(index);
    // Open the form for editing
    setShowForm(true);
  };

  const handleDelete = async (index) => {
    // Remove the selected entry
    try {
      const response = await axios.delete(
        `${url}/api/v1/currency/currencies/${entries[index]._id}`
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
      <div className="mt-8" style={{ marginLeft: "56px" }}>
        <h3 className="text-lg font-semibold mb-4">Entered Data</h3>
        <table className=" bg-white border border-gray-300">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b font-medium">currencyName</th>
              <th className="py-2 px-4 border-b font-medium">currencySymbol</th>
              <th className="py-2 px-4 border-b font-medium">currencyCode</th>
              <th className="py-2 px-4 border-b font-medium">exchangeRate</th>
              <th className="py-2 px-4 border-b font-medium">
                exchangeRatecurrencyFormat
              </th>
              <th className="py-2 px-4 border-b font-medium">currencyFormat</th>
              <th className="py-2 px-4 border-b font-medium">actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
                <td className="py-2 px-4 border-b font-medium">
                  Currency {index + 1}
                </td>
                <td className="py-2 px-4 border-b">{entry.currencyName}</td>
                <td className="py-2 px-4 border-b">{entry.currencySymbol}</td>
                <td className="py-2 px-4 border-b">{entry.currencyCode}</td>
                <td className="py-2 px-4 border-b">{entry.exchangeRate}</td>
                <td className="py-2 px-4 border-b">{entry.currencyFormat}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600 mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8">
        {/* Button to toggle the form visibility */}
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 mr-2"
          style={{ marginLeft: "70px" }}
        >
          Add Another Currency
        </button>

        {showForm && (
          <div className="container px-20 mt-8">
            <h2 className="text-2xl font-semibold mb-4">
              Currency Information
            </h2>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="currencyName"
                  className="block text-sm font-medium text-gray-600"
                >
                  Currency Name:
                </label>
                <input
                  type="text"
                  id="currencyName"
                  name="currencyName"
                  value={currencyInfo.currencyName}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="currencySymbol"
                  className="block text-sm font-medium text-gray-600"
                >
                  Currency Symbol:
                </label>
                <input
                  type="text"
                  id="currencySymbol"
                  name="currencySymbol"
                  value={currencyInfo.currencySymbol}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="currencyCode"
                  className="block text-sm font-medium text-gray-600"
                >
                  Currency Code:
                </label>
                <input
                  type="text"
                  id="currencyCode"
                  name="currencyCode"
                  value={currencyInfo.currencyCode}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="exchangeRate"
                  className="block text-sm font-medium text-gray-600"
                >
                  Exchange Rate:
                </label>
                <input
                  type="number"
                  id="exchangeRate"
                  name="exchangeRate"
                  value={currencyInfo.exchangeRate}
                  onChange={handleChange}
                  step="0.01"
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="currencyFormat"
                  className="block text-sm font-medium text-gray-600"
                >
                  Currency Format:
                </label>
                <input
                  type="text"
                  id="currencyFormat"
                  name="currencyFormat"
                  value={currencyInfo.currencyFormat}
                  onChange={handleChange}
                  className="mt-1 p-2 border rounded-md w-full"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
              >
                {editingIndex !== null ? "Update" : "Submit"}
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
};

export default CurrencyForm;
