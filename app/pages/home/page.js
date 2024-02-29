"use client";
import Navbar from "@/components/navbar";
import url from "@/utils/url";
import React, { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { IoSaveOutline } from "react-icons/io5";

export default function Home() {
  const [data, setData] = useState([]);
  const [editingRowIndex, setEditingRowIndex] = useState(null);
  const [editingDetailIndex, setEditingDetailIndex] = useState(null);
  const [toggleSet, setToggleSet] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingDetail, setIsEditingDetail] = useState(false);
  const [editedData, setEditedData] = useState({
    bankName: "",
    acNo: "",
    location: "",
    currency: "",
    balance: "",
    usdBalance: "",
  });
  const currentDate = new Date().toISOString().split("T")[0];

  const [editedDetailData, setEditedDetailData] = useState({
    date: currentDate,
    checkNo: "",
    payee: "",
    memo: "",
    category: "",
    payment: "",
    deposit: "",
    balance: "",
  });

  const [expandedRows, setExpandedRows] = useState(new Set());
  const [formData, setFormData] = useState({
    date: currentDate,
    checkNo: "",
    payee: "",
    memo: "",
    category: "",
    payment: "",
    deposit: "",
    balance: "",
  });
  const [bankDetail, setBankDetail] = useState([]);
  let [ok, setOk] = useState(1);
  const [openDetail, setOpenDetail] = useState(false);

  const handleEditChange = (field, value) => {
    setEditedData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleDetailEditChange = (field, value) => {
    setEditedDetailData((prevData) => ({
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
  }, [ok]);

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

  const handleDetailDelete = async (detailId) => {
    try {
      const response = await fetch(
        `${url}/api/v1/bank/bankDetail/${detailId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        }
      );
      if (response.ok) {
        const updatedbankDetail = [...bankDetail];
        updatedbankDetail.splice(detailId, 1);
        setBankDetail(updatedbankDetail);
      } else {
        console.error("Failed to delete data:", response.statusText);
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  const handleDetailEdit = async (detail, row) => {
    if (!isEditingDetail) {
      setEditingDetailIndex(detail._id);
      const selectedData = bankDetail.find((item) => item._id === detail._id);
      setEditedDetailData(selectedData);
      setIsEditingDetail(true);
    } else {
      try {
        const updateDetailresponse = await fetch(
          `${url}/api/v1/bank/bankDetail/${detail._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
            body: JSON.stringify(editedDetailData),
          }
        );
        if (updateDetailresponse.ok) {
          const updatedData = await updateDetailresponse.json();
          let newBalance = parseFloat(row.balance);

          if (!isNaN(parseFloat(editedDetailData.payment)) && newBalance > 0) {
            newBalance -= parseFloat(editedDetailData.payment);
          }
          // Check if deposit is a valid number
          if (!isNaN(parseFloat(editedDetailData.deposit))) {
            newBalance += parseFloat(editedDetailData.deposit);
          }

          const updatedRow = { ...row, balance: newBalance.toString() };
          setData((prevData) =>
            prevData.map((item) => (item._id === row._id ? updatedRow : item))
          );
          const bankResponse = await fetch(
            `${url}/api/v1/bank/getBank/${row._id}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
            }
          );
          const data = await bankResponse.json();
          const bankUpdateResponse = await fetch(
            `${url}/api/v1/bank/${row._id}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "auth-token": localStorage.getItem("token"),
              },
              body: JSON.stringify({
                balance: newBalance,
                currency: data.data.currency,
              }),
            }
          );

          if (bankUpdateResponse.ok) {
            const updateBalanceOfTrans = await fetch(
              `${url}/api/v1/bank/bankDetail/${detail._id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token"),
                },
                body: JSON.stringify({ balance: newBalance }),
              }
            );

            setOk((ok += 1));
          }

          setEditingDetailIndex(null);
          setIsEditingDetail(false);
          setBankDetail((prevData) => {
            const newData = prevData.map((item) => {
              if (item._id === detail._id) {
                return { ...item, ...updatedData.data };
              }
              return item;
            });
            return newData;
          });
          const updatedDetail = { ...detail, balance: newBalance.toString() };
          setBankDetail((prevData) =>
            prevData.map((item) =>
              item._id === detail._id ? updatedDetail : item
            )
          );
          console.log("Data updated successfully:", updatedData);
        } else {
          // console.error("Failed to update data:", response.statusText);
        }
      } catch (error) {
        console.error("Error during update:", error);
      }
    }
  };

  const toggleRow = async (rowId) => {
    setExpandedRows((prevExpandedRows) => {
      const isRowExpanded = prevExpandedRows.has(rowId);
      const newExpandedRows = new Set(prevExpandedRows);
      // console.log(toggleSet);
      if (isRowExpanded) {
        // if (toggleSet === rowId) {
        setOpenDetail(false);
        // }
        newExpandedRows.delete(rowId);
        setBankDetail([]);
      } else {
        // if (toggleSet === rowId) {
        setOpenDetail(true);
        // }
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
          display: "flex",
          overflowX: "auto",
          whiteSpace: "nowrap",
        }}
      >
        <table className="w-full bg-white border border-collapse border-gray-300">
          <thead>
            <tr>
              {[
                "DATE",
                "CHECK",
                "PAYEE",
                "MEMO",
                "CATEGORY",
                "PAYMENT",
                "DEPOSIT",
                "ENTRY",
              ].map((header, index) => (
                <th
                  key={index}
                  className="py-2 px-2 border-b border-r text-left header-cell"
                  style={{
                    backgroundColor: "rgb(100 116 139)",
                    color: "black",
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <input
                  type="date"
                  placeholder="Date"
                  className="border w-30 rounded px-1 py-1 ml-1 my-3"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={(e) => handleChange(e, row)}
                />
              </td>
              <td>
                <textarea
                  type="text"
                  placeholder="checkNo"
                  className="border w-[140px] rounded px-2 py-1  ml-1  my-3"
                  id="checkNo"
                  name="checkNo"
                  value={formData.checkNo}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  rows={1}
                />
              </td>
              <td>
                <textarea
                  type="text"
                  placeholder="payee"
                  className="border w-[140px] rounded px-2 py-1  ml-1 my-3 "
                  id="payee"
                  name="payee"
                  value={formData.payee}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  rows={1}
                />
              </td>
              <td>
                <textarea
                  type="text"
                  placeholder="memo"
                  className="border w-[140px] rounded px-2 py-1 ml-1 my-3"
                  id="memo"
                  name="memo"
                  value={formData.memo}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  rows={1}
                />
              </td>
              <td>
                <textarea
                  type="text"
                  placeholder="category"
                  className="border w-[140px] rounded px-2 py-1  ml-1 my-3 "
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                  rows={1}
                />
              </td>

              <td>
                <textarea
                  type="text"
                  placeholder="payment"
                  className="border w-[140px] rounded px-2 py-1 ml-1 my-3 "
                  id="payment"
                  name="payment"
                  value={formData.payment}
                  onChange={(e) => {
                    handlePaymentChange(e);
                  }}
                  rows={1}
                />
              </td>

              <td>
                <textarea
                  type="text"
                  placeholder="deposit"
                  className="border w-[140px] rounded px-2 py-1 ml-1 my-3 "
                  id="deposit"
                  name="deposit"
                  value={formData.deposit}
                  onChange={(e) => {
                    handleDepositChange(e);
                  }}
                  rows={1}
                />
              </td>
              <td>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold ml-2 rounded focus:outline-none focus:shadow-outline"
                  style={{ height: "37px", width: "90px" }}
                >
                  Submit
                </button>
              </td>
            </tr>
          </tbody>
        </table>
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
    }));
    e.target.style.height = e.target.scrollHeight + "px";
  };
  const handleDepositChange = (e) => {
    const depositValue = e.target.value;
    const numericValue = depositValue.replace(/[^0-9.]/g, "");
    setFormData((prevData) => ({
      ...prevData,
      deposit: numericValue,
    }));
    e.target.style.height = e.target.scrollHeight + "px";
  };

  const handleSubmit = async (e, row) => {
    e.preventDefault();
    let newBalance = parseFloat(row.balance);
    if (!isNaN(parseFloat(formData.payment)) && newBalance > 0) {
      newBalance -= parseFloat(formData.payment);
    }
    // Check if deposit is a valid number
    if (!isNaN(parseFloat(formData.deposit))) {
      newBalance += parseFloat(formData.deposit);
    }

    const updatedRow = { ...row, balance: newBalance.toString() };
    setData((prevData) =>
      prevData.map((item) => (item._id === row._id ? updatedRow : item))
    );
    const bankResponse = await fetch(`${url}/api/v1/bank/getBank/${row._id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
    });
    const data = await bankResponse.json();
    // Update balance on the server
    const response = await fetch(`${url}/api/v1/bank/${row._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        balance: newBalance,
        currency: data.data.currency,
      }),
    });
    if (response.ok) {
      setOk((ok += 1));
    }

    try {
      // Submit form data
      const response = await fetch(`${url}/api/v1/bank/addDetails/${row._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
        body: JSON.stringify({ ...formData, balance: newBalance }),
      });

      if (response.ok) {
        console.log("Form submitted successfully");
        setFormData({
          date: currentDate,
          checkNo: "",
          payee: "",
          memo: "",
          category: "",
          payment: "",
          deposit: "",
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
      <div className="flex flex-col justify-center  p-4">
        <h1 className="text-2xl font-bold mb-4">Banking Dashboard</h1>
        <table className="w-full bg-white border border-collapse border-gray-300">
          <thead>
            <tr>
              <th
                className="py-2 px-2 border-b border-r text-left"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Add Details
              </th>
              <th
                className="py-2 px-2 border-b border-r text-left"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Bank Name
              </th>
              <th
                className="py-2 px-2 border-b border-r text-left"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Account Number
              </th>
              <th
                className="py-2 px-2 border-b border-r text-left"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Location
              </th>
              <th
                className="py-2 px-2 border-b border-r text-left"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Currency
              </th>
              <th
                className="py-2 px-2 border-b border-r text-left"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Balance
              </th>
              <th
                className="py-2 px-2 border-b border-r text-left"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Balance in USD
              </th>
              <th
                className="py-2 px-2 border-b text-left border-r"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Edit
              </th>
              <th
                className="py-2 px-2 border-b text-left border-r"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((row, index) => (
                <React.Fragment key={index}>
                  <tr className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    {editingRowIndex === row._id ? (
                      <>
                        <td
                          className="py-2 px-2 border-b text-center text-green-500 text-3xl border-r"
                          style={{ fontSize: "xx-large" }}
                        >
                          +
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          <input
                            type="text"
                            value={editedData.bankName}
                            onChange={(e) =>
                              handleEditChange("bankName", e.target.value)
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          <input
                            type="text"
                            value={editedData.acNo}
                            onChange={(e) =>
                              handleEditChange("acNo", e.target.value)
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          <input
                            type="text"
                            value={editedData.location}
                            onChange={(e) =>
                              handleEditChange("location", e.target.value)
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          <input
                            type="text"
                            value={editedData.currency}
                            onChange={(e) =>
                              handleEditChange("currency", e.target.value)
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          <input
                            type="text"
                            value={editedData.balance}
                            onChange={(e) =>
                              handleEditChange("balance", e.target.value)
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          <input
                            type="text"
                            value={editedData.usdBalance}
                            onChange={(e) =>
                              handleEditChange("usdBalance", e.target.value)
                            }
                            className="border rounded px-2 py-1 w-full"
                          />
                        </td>
                        <td className="py-2 px-2 border-b border-r ">
                          <button
                            onClick={() => handleEdit(row._id)}
                            className=" text-green-500 hover:text-green-700 mr-2"
                          >
                            Save
                          </button>
                        </td>
                        <td className="py-2 px-2 border-b border-r">
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
                          className="py-2 px-2 border-b text-center cursor-pointer text-3xl border-r text-green-500 "
                          style={{ fontSize: "x-large" }}
                          onClick={() => toggleRow(row._id)}
                        >
                          {expandedRows.has(row._id) ? "-" : "+"}
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          {row.bankName}
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          {row.acNo}
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          {row.location}
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          {row.currency}
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          {row.balance}
                        </td>
                        <td className="py-2 px-2 border-b border-r">
                          {row.usdBalance}
                        </td>
                        <td className="py-2 px-2 border-b border-r text-center ">
                          <button
                            onClick={() => handleEdit(row._id)}
                            className=" text-green-500 hover:text-green-700 mr-2"
                          >
                            <FaEdit className="text-2xl" />
                          </button>
                        </td>
                        <td className="py-2 px-2 border-b border-r text-center">
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
                  {Array.isArray(bankDetail) &&
                    openDetail &&
                    bankDetail &&
                    expandedRows && (
                      <tr>
                        <td colSpan={9}>
                          <table className="w-full bg-white border border-collapse border-gray-300">
                            <thead
                              className={
                                expandedRows.has(row._id) ? "" : "hidden"
                              }
                            >
                              <tr>
                                <th
                                  className="py-2 px-2 border-b border-r text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  DATE
                                </th>
                                <th
                                  className="py-2 px-2 border-b border-r text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  CHECK
                                </th>
                                <th
                                  className="py-2 px-2 border-b border-r text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  PAYEE
                                </th>
                                <th
                                  className="py-2 px-2 border-b border-r text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  MEMO
                                </th>
                                <th
                                  className="py-2 px-2 border-b border-r text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  CATEGORY
                                </th>
                                <th
                                  className="py-2 px-2 border-b border-r text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  PAYMENT
                                </th>
                                <th
                                  className="py-2 px-2 border-b border-r text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  DEPOSIT
                                </th>
                                <th
                                  className="py-2 px-2 border-b text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  BAlANCE
                                </th>
                                <th
                                  className="py-2 px-2 border-b text-left"
                                  style={{
                                    backgroundColor: "#C5D1F7",
                                    color: "black",
                                  }}
                                >
                                  ENTRY
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {bankDetail.map((item, subIndex) => {
                                return (
                                  <React.Fragment key={subIndex}>
                                    {item.bankId === row._id && (
                                      <tr>
                                        {editingDetailIndex === item._id ? (
                                          <>
                                            <td className="py-2 px-2 border-b border-r">
                                              <input
                                                type="text"
                                                value={editedDetailData.date}
                                                onChange={(e) =>
                                                  handleDetailEditChange(
                                                    "date",
                                                    e.target.value
                                                  )
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                              />
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              <input
                                                type="text"
                                                value={editedDetailData.checkNo}
                                                onChange={(e) =>
                                                  handleDetailEditChange(
                                                    "checkNo",
                                                    e.target.value
                                                  )
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                              />
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              <input
                                                type="text"
                                                value={editedDetailData.payee}
                                                onChange={(e) =>
                                                  handleDetailEditChange(
                                                    "payee",
                                                    e.target.value
                                                  )
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                              />
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              <input
                                                type="text"
                                                value={editedDetailData.memo}
                                                onChange={(e) =>
                                                  handleDetailEditChange(
                                                    "memo",
                                                    e.target.value
                                                  )
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                              />
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              <input
                                                type="text"
                                                value={
                                                  editedDetailData.category
                                                }
                                                onChange={(e) =>
                                                  handleDetailEditChange(
                                                    "category",
                                                    e.target.value
                                                  )
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                              />
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              <input
                                                type="text"
                                                value={editedDetailData.payment}
                                                onChange={(e) =>
                                                  handleDetailEditChange(
                                                    "payment",
                                                    e.target.value
                                                  )
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                              />
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              <input
                                                type="text"
                                                value={editedDetailData.deposit}
                                                onChange={(e) =>
                                                  handleDetailEditChange(
                                                    "deposit",
                                                    e.target.value
                                                  )
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                              />
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              <input
                                                type="text"
                                                value={editedDetailData.balance}
                                                onChange={(e) =>
                                                  handleDetailEditChange(
                                                    "balance",
                                                    e.target.value
                                                  )
                                                }
                                                className="border rounded px-2 py-1 w-full"
                                              />
                                            </td>
                                            <td className="py-2 px-2 border-b border-r flex justify-center items-center">
                                              <button
                                                onClick={() =>
                                                  handleDetailEdit(item, row)
                                                }
                                                className=" text-green-500 hover:text-green-700 mr-2"
                                              >
                                                <IoSaveOutline className="text-1xl" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleDetailDelete(item._id)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                <FaTrash className="text-1xl" />
                                              </button>
                                            </td>
                                          </>
                                        ) : (
                                          <>
                                            <td className="py-2 px-2 border-b border-r">
                                              {new Date(
                                                item.date
                                              ).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              {item.checkNo}
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              {item.payee}
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              {item.memo}
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              {item.category}
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              {item.payment}
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              {item.deposit}
                                            </td>
                                            <td className="py-2 px-2 border-b border-r">
                                              {item.balance}
                                            </td>
                                            <td className="py-2 px-2 border-b border-r flex justify-center items-center">
                                              <button
                                                onClick={() =>
                                                  handleDetailEdit(item, row)
                                                }
                                                className=" text-green-500 hover:text-green-700 mr-2"
                                              >
                                                <FaEdit className="text-1xl" />
                                              </button>
                                              <button
                                                onClick={() =>
                                                  handleDetailDelete(item._id)
                                                }
                                                className="text-red-500 hover:text-red-700"
                                              >
                                                <FaTrash className="text-1xl" />
                                              </button>
                                            </td>
                                          </>
                                        )}
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  {expandedRows.has(row._id) && (
                    <tr>
                      <td colSpan="9">{renderForm(row)}</td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
