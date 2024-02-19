"use client";
import Navbar from "@/components/navbar";
import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function Home() {
  const [data, setData] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    bankName: "",
    acNo: "",
    location: "",
    currency: "",
    balance: "",
    usdBalance: "",
  });
  const [expandedRows, setExpandedRows] = useState(new Set());

  const [formData, setFormData] = useState({
    date: "",
    checkNo: "",
    payee: "",
    memo: "",
    category: "",
    payment: "",
    deposit: "",
    amount: "",
  });

  const handleEditChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/v1/bank/getAllBanks"
        );
        if (response.ok) {
          const apiData = await response.json();
          setData(apiData.data);
          setEditedData(apiData.data);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error during data fetch:", error);
      }
    };

    fetchData();
  }, []);

  const handleEdit = async (rowId) => {
    if (!isEditing) {
      setEditingRowIndex(rowId);
      const selectedData = data.find((item) => item._id === rowId);
      setEditedData(selectedData);
      setIsEditing(true);
    } else {
      try {
        const response = await fetch(
          `http://localhost:5000/api/v1/bank/${rowId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedData),
          }
        );
        if (response.ok) {
          setEditingRowIndex(null);
          setIsEditing(false);
          console.log(await response.json());
          setData((prevData) => {
            const newData = prevData.map((item) => {
              if (item._id === rowId) {
                return editedData;
              }
              return item;
            });
            return newData;
          });
          console.log("Data updated successfully:", editedData);
        } else {
          console.error("Failed to update data:", response.statusText);
        }
      } catch (error) {
        console.error("Error during update:", error);
      }
    }
  };

  const handleDelete = async (rowId) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/bank/${rowId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const updatedData = [...data];
        updatedData.splice(rowId, 1);
        setData(updatedData);
        console.log("Data deleted successfully");
      } else {
        console.error("Failed to delete data:", response.statusText);
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  const toggleRow = (rowId) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
      } else {
        newExpandedRows.add(rowId);
      }
      return newExpandedRows;
    });
  };

  const renderForm = (row) => {
    return (
      <form onSubmit={(e) => handleSubmit(e, row)}>
        <input
          type="date"
          placeholder="Date"
          className="border rounded px-2 py-1"
          id="date"
          name="date"
          value={formData.date}
          onChange={(e) => handleChange(e, row)}
          required
        />
        <input
          type="text"
          placeholder="checkNo"
          className="border rounded px-2 py-1"
          id="checkNo"
          name="checkNo"
          value={formData.checkNo}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="payee"
          className="border rounded px-2 py-1 "
          id="payee"
          name="payee"
          value={formData.payee}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="memo"
          className="border rounded px-2 py-1 "
          id="memo"
          name="memo"
          value={formData.memo}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          placeholder="category"
          className="border rounded px-2 py-1"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="payment"
          className="border rounded px-2 py-1"
          id="payment"
          name="payment"
          value={formData.payment}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="deposit"
          className="border rounded px-2 py-1"
          id="deposit"
          name="deposit"
          value={formData.deposit}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          placeholder="amount"
          className="border rounded px-2 py-1 "
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-32"
        >
          Submit
        </button>
      </form>
    );
  };

  const handleChange = (e, row) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e, row) => {
    e.preventDefault();
    console.log(formData);
    // const submitData = {
    //   ...row,
    //   formData: formData,
    // };

    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/bank/addDetails`,
        // `http://localhost:5000/api/v1/bank/${row._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        console.log("Form submitted successfully");
        // Handle any other logic after successful form submission
      } else {
        console.error("Failed to submit form:", response.statusText);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
    }
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <Navbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Banking Dashboard</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">Add Details</th>
                <th className="py-2 px-4 border-b text-left">Bank Name</th>
                <th className="py-2 px-4 border-b text-left">Account Number</th>
                <th className="py-2 px-4 border-b text-left">Location</th>
                <th className="py-2 px-4 border-b text-left">Currency</th>
                <th className="py-2 px-4 border-b text-left">Balance</th>
                <th className="py-2 px-4 border-b text-left">
                  US$ Equivalent Balance
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      {editingRowIndex === row._id ? (
                        <>
                          <td
                            className="py-2 px-4 border-b "
                            style={{
                              fontSize: "xx-large",
                              paddingLeft: "40px",
                            }}
                          >
                            +
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={editedData.bankName}
                              onChange={(e) =>
                                handleEditChange("bankName", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={editedData.acNo}
                              onChange={(e) =>
                                handleEditChange("acNo", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={editedData.location}
                              onChange={(e) =>
                                handleEditChange("location", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={editedData.currency}
                              onChange={(e) =>
                                handleEditChange("currency", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={editedData.balance}
                              onChange={(e) =>
                                handleEditChange("balance", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="py-2 px-4 border-b">
                            <input
                              type="text"
                              value={editedData.usdBalance}
                              onChange={(e) =>
                                handleEditChange("usdBalance", e.target.value)
                              }
                              className="border rounded px-2 py-1 w-full"
                            />
                          </td>
                          <td className="py-2 px-4 border-b flex gap-9">
                            <button
                              onClick={() => handleEdit(row._id)}
                              className=" text-green-500 hover:text-green-700 mr-2"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => handleDelete(row._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td
                            className="py-2 px-4 border-b cursor-pointer "
                            style={{ fontSize: "x-large", paddingLeft: "40px" }}
                            onClick={() => toggleRow(row._id)}
                          >
                            {expandedRows.has(row._id) ? "-" : "+"}
                          </td>

                          <td className="py-2 px-4 border-b">{row.bankName}</td>
                          <td className="py-2 px-4 border-b">{row.acNo}</td>
                          <td className="py-2 px-4 border-b">{row.location}</td>
                          <td className="py-2 px-4 border-b">{row.currency}</td>
                          <td className="py-2 px-4 border-b">{row.balance}</td>
                          <td className="py-2 px-4 border-b">
                            {row.usdBalance}
                          </td>

                          <td className="py-2 px-4 border-b flex gap-9">
                            <button
                              onClick={() => handleEdit(row._id)}
                              className=" text-green-500 hover:text-green-700 mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(row._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              Delete
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                    {expandedRows.has(row._id) && (
                      <tr>
                        <td colSpan="8">{renderForm(row)}</td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
        <button
          className="border rounded bg-black text-white mt-4"
          style={{ width: "150px", height: "62px" }}
        >
          <Link href="/pages/addForm" className="">
            Add new bank
          </Link>
        </button>
      </div>
    </>
  );
}
