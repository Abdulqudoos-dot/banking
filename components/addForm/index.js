"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
// import { useRouter } from "next/router";
import url from "@/utils/url";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "../navbar";
import Setting from "../../app/pages/setting/page";
const AddForm = () => {
  // const router = useRouter();

  const [formData, setFormData] = useState({
    bankName: "",
    acNo: "",
    location: "",
    currency: "",
    balance: 0,
    usdBalance: 0,
  });

  const [data, setData] = useState([]); // Initialize data state
  const [editedData, setEditedData] = useState({});
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());
  let [ok, setOk] = useState(1);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleEditChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const toggleRow = (rowId) => {
    const expanded = new Set(expandedRows);
    expanded.has(rowId) ? expanded.delete(rowId) : expanded.add(rowId);
    setExpandedRows(expanded);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      const addBankRes = await axios.post(
        `${url}/api/v1/bank/addBank`,
        formData,
        { headers }
      );
      alert("Bank Added.");

      setFormData({
        bankName: "",
        acNo: "",
        location: "",
        currency: "",
        balance: 0,
        usdBalance: 0,
      });
      setOk(ok + 1);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again later.");
    }
  };

  useEffect(() => {
    const fetchBankData = async () => {
      try {
        const response = await fetch(`${url}/api/v1/bank/getAllBanks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });
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

    fetchBankData();
  }, [ok]); // Removed 'ok' dependency as it was undefined in your code

  const handleDelete = async (rowId) => {
    try {
      const response = await fetch(`${url}/api/v1/bank/${rowId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });
      if (response.ok) {
        const updatedData = data.filter((item) => item._id !== rowId);
        setData(updatedData);
      } else {
        console.error("Failed to delete data:", response.statusText);
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  const handleEdit = async (rowId) => {
    if (!isEditing) {
      setEditingRowIndex(rowId);
      const selectedData = data.find((item) => item._id === rowId);
      setEditedData(selectedData);
      setIsEditing(true);
    } else {
      try {
        const response = await fetch(`${url}/api/v1/bank/${rowId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
          body: JSON.stringify(editedData),
        });
        if (response.ok) {
          const updatedData = await response.json();
          console.log(updatedData);
          setEditingRowIndex(null);
          setIsEditing(false);
          setData((prevData) => {
            const newData = prevData.map((item) => {
              if (item._id === rowId) {
                console.log({ ...updatedData.data });
                return { ...item, ...updatedData.data };
              }
              return item;
            });
            return newData;
          });
          console.log("Data updated successfully:", updatedData);
        } else {
          console.error("Failed to update data:", response.statusText);
        }
      } catch (error) {
        console.error("Error during update:", error);
      }
    }
  };
  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <Setting />
      <div className="container w-full p-4">
        {/* <h1 className="text-2xl font-bold mb-4">Banking Dashboard</h1> */}
        <div className="">
          <table className="w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {/* <th className="py-2 px-4 border-b text-left" style={{ backgroundColor: "blue", color: "white" }}>Add Details</th> */}
                <th
                  className="py-2 px-4 border-b text-left"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Bank Name
                </th>
                <th
                  className="py-2 px-4 border-b text-left"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Account Number
                </th>
                <th
                  className="py-2 px-4 border-b text-left"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Location
                </th>
                <th
                  className="py-2 px-4 border-b text-left"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Currency
                </th>
                <th
                  className="py-2 px-4 border-b text-left"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Balance
                </th>
                <th
                  className="py-2 px-4 border-b text-left"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Balance in USD
                </th>
                <th
                  className="py-2 px-4 border-b text-left"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Edit
                </th>
                <th
                  className="py-2 px-4 border-b text-left"
                  style={{ backgroundColor: "blue", color: "white" }}
                >
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data.map((row, index) => (
                  <React.Fragment key={index}>
                    <tr
                      className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
                    >
                      {editingRowIndex === row._id ? (
                        <>
                          {/* <td
                className="py-2 px-4 border-b text-green-500 text-3xl"
                style={{
                  fontSize: "xx-large",
                  paddingLeft: "40px",
                }}
              >
                +
              </td> */}
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
                              className="text-green-500 hover:text-green-700 mr-2"
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
                          {/* <td
                className="py-2 px-4 border-b cursor-pointer text-3xl text-green-500 "
                style={{ fontSize: "x-large", paddingLeft: "40px" }}
                onClick={() => toggleRow(row._id)}
              >
                {expandedRows.has(row._id) ? "-" : "+"}
              </td> */}

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
                              className="text-green-500 hover:text-green-700 mr-2"
                            >
                              <FaEdit className="text-2xl" />
                            </button>
                          </td>
                          <td>
                            <button
                              onClick={() => handleDelete(row._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash className="text-2xl" />
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* <br/><br/> */}
      <div className="container px-20 mt-8 ">
        <form onSubmit={handleSubmit} className="flex flex-col w-[500px]  ">
          <h1 className="text-2xl font-semibold mb-4">
            <b>Add new bank</b>
          </h1>
          {/* <br/><br/> */}
          <div className="mb-4">
            <label
              htmlFor="bankName"
              className="text-bold "
              style={{ marginTop: "12px" }}
            >
              <b>Bank Name:</b>
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          <div className=" mb-4">
            <label
              htmlFor="acNo"
              className="text-bold "
              style={{ marginTop: "12px" }}
              // className="block text-sm font-medium text-gray-600 w-1/4"
            >
              <b>A/c no.:</b>
            </label>
            <input
              type="text"
              id="acNo"
              name="acNo"
              value={formData.acNo}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
              required
            />
          </div>
          <div className=" mb-4">
            <label
              htmlFor="location"
              className="text-bold "
              style={{ marginTop: "12px" }}
              // className="block text-sm font-medium text-gray-600 w-1/4"
            >
              <b>Location:</b>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
          </div>
          {/* <label
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
          /> */}
          <br />
          {/* <div className="flex mb-4">

          <label
            htmlFor="accountNumber"
            className="block text-gray-700 font-bold mb-2"
          >
            A/c no.:
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
          <br /></div> */}
          {/* <label
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
          <br /> */}
          <div className="mb-4">
            <label
              htmlFor="currency"
              className="block text-gray-700 font-bold mb-2"
            >
              {" "}
              <b>Currency: </b>
            </label>
            <input
              type="text"
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
            <br />
          </div>
          {/* 
          <div className="flex mb-4">

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
    required
    className="mt-1 p-2 border rounded-md w-full bg-gray-200"
    />
<br /></div> */}
          <div className="mb-4">
            <label
              htmlFor="balance"
              className="block text-gray-700 font-bold mb-2"
            >
              {" "}
              <b>Balance:</b>
            </label>
            <input
              type="number"
              id="balance"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              required
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
            <br />
          </div>
          <div className="mb-4">
            <label
              htmlFor="usdBalance"
              className="block text-gray-700 font-bold mb-2"
            >
              {" "}
              <b>Balance in USD: </b>
            </label>
            <input
              type="number"
              id="usdBalance"
              name="usdBalance"
              value={formData.usdBalance}
              onChange={handleChange}
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
            />
            <br />
          </div>
          {/* <label
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
          /> */}
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
