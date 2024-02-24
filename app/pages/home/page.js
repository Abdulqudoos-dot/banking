"use client";
import Navbar from "@/components/navbar";
import url from "@/utils/url";
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
  const currentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    date: currentDate,
    checkNo: "",
    payee: "",
    memo: "",
    category: "",
    payment: "",
    deposit: "",
    amount: "",
  });
  const [bankDetail, setBankDetail] = useState([]);

  const handleEditChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
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
  }, []);

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
        const updatedData = [...data];
        updatedData.splice(rowId, 1);
        setData(updatedData);
      } else {
        console.error("Failed to delete data:", response.statusText);
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  const toggleRow = async (rowId) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
        setBankDetail([]);
      } else {
        (async () => {
          const response2 = await fetch(
            `${url}/api/v1/bank/getDetails/${rowId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
            }
          );
          if (response2.ok) {
            const apiData = await response2.json();
            console.log(apiData.data);
            setBankDetail(apiData.data);
          }
        })();
        newExpandedRows.add(rowId);
      }
      return newExpandedRows;
    });
  };

  const renderForm = (row) => {
    return (
      <form
        onSubmit={(e) => handleSubmit(e, row)}
        style={{
          // margin: "12px",
          display: "flex",
          alignItems: "center",
          // width: "1800px",
        }}
      >
        <input
          type="date"
          placeholder="Date"
          className="border w-30 rounded px-1 py-1"
          id="date"
          name="date"
          value={formData.date}
          onChange={(e) => handleChange(e, row)}
        />
        <textarea
          type="text"
          placeholder="checkNo"
          className="border w-[170px] rounded px-2 py-1  ml-1"
          id="checkNo"
          name="checkNo"
          value={formData.checkNo}
          onChange={(e) => {
            handleChange(e);
          }}
          rows={1}
        />
        <textarea
          type="text"
          placeholder="payee"
          className="border w-[170px] rounded px-2 py-1  ml-1 "
          id="payee"
          name="payee"
          value={formData.payee}
          onChange={(e) => {
            handleChange(e);
          }}
          rows={1}
        />
        <textarea
          type="text"
          placeholder="memo"
          className="border w-[170px] rounded px-2 py-1 ml-1"
          id="memo"
          name="memo"
          value={formData.memo}
          onChange={(e) => {
            handleChange(e);
          }}
          rows={1}
        />

        <textarea
          type="text"
          placeholder="category"
          className="border w-[170px] rounded px-2 py-1  ml-1 "
          id="category"
          name="category"
          value={formData.category}
          onChange={(e) => {
            handleChange(e);
          }}
          rows={1}
        />
        <textarea
          type="text"
          placeholder="payment"
          className="border w-[170px] rounded px-2 py-1 ml-1 "
          id="payment"
          name="payment"
          value={formData.payment}
          onChange={(e) => {
            handlePaymentChange(e);
          }}
          rows={1}
        />
        <textarea
          type="text"
          placeholder="deposit"
          className="border w-[170px] rounded px-2 py-1 ml-1 "
          id="deposit"
          name="deposit"
          value={formData.deposit}
          onChange={(e) => {
            handleDepositChange(e);
          }}
          rows={1}
        />
        <textarea
          type="text"
          placeholder="amount"
          className="border w-[170px] rounded px-2 py-1  ml-1"
          id="amount"
          name="amount"
          value={formData.amount}
          onChange={(e) => {
            handleChange(e);
          }}
          rows={1}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-2  rounded focus:outline-none focus:shadow-outline w-25"
          style={{ height: "37px", width: "90px" }}
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
    // e.target.style.height = "auto";
    e.target.style.height = e.target.scrollHeight + "px";
  };
  const handlePaymentChange = (e) => {
    const paymentValue = e.target.value;
    const numericValue = paymentValue.replace(/[^0-9.]/g, "");
    setFormData((prevData) => ({
      ...prevData,
      payment: numericValue,
      amount: numericValue, // Set amount to payment value
    }));
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleDepositChange = (e) => {
    const depositValue = e.target.value;
    const numericValue = depositValue.replace(/[^0-9.]/g, "");
    setFormData((prevData) => ({
      ...prevData,
      deposit: numericValue,
      amount: numericValue,
    }));
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = async (e, row) => {
    e.preventDefault();

    // Parse balance to a float
    let newBalance = parseFloat(row.balance);

    // Check if payment is a valid number and balance is greater than 0
    if (!isNaN(parseFloat(formData.payment)) && newBalance > 0) {
      newBalance -= parseFloat(formData.payment);
    }

    // Check if deposit is a valid number
    if (!isNaN(parseFloat(formData.deposit))) {
      newBalance += parseFloat(formData.deposit);
    }

    console.log(newBalance);

    // Update the row with the new balance
    const updatedRow = { ...row, balance: newBalance.toString() };
    setData((prevData) =>
      prevData.map((item) => (item._id === row._id ? updatedRow : item))
    );

    // Update balance on the server
    await fetch(`${url}/api/v1/bank/${row._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({ balance: newBalance }),
    });

    try {
      // Submit form data
      const response = await fetch(`${url}/api/v1/bank/addDetails/${row._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log("Form submitted successfully");

        // Clear the form data
        setFormData({
          date: currentDate,
          checkNo: "",
          payee: "",
          memo: "",
          category: "",
          payment: "",
          deposit: "",
          amount: "",
        });
        const response2 = await fetch(
          `${url}/api/v1/bank/getDetails/${row._id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );
        if (response2.ok) {
          const apiData = await response2.json();
          console.log(apiData.data);
          setBankDetail(apiData.data);
        }
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
      <div className="container w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Banking Dashboard</h1>
        <div className="">
          <table className="w-full bg-white border border-gray-300">
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
                    {bankDetail &&
                      toggleRow &&
                      bankDetail.map((item, index) => {
                        return (
                          <React.Fragment key={index}>
                            {item.bankId === row._id && (
                              <tr>
                                <td className="py-2 px-4 border-b">
                                  Date :
                                  {new Date(item.date).toLocaleDateString()}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  Check# : {item.checkNo}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  Payee : {item.payee}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  Memo : {item.memo}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  Category : {item.category}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  Payment : {item.payment}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  Deposit : {item.deposit}
                                </td>
                                <td className="py-2 px-4 border-b">
                                  Amount : {item.amount}
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
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
      </div>
    </>
  );
}
