"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import url from "@/utils/url";
import AdminNavbar from "@/components/AdminNavbar";
import { MdKeyboardArrowDown } from "react-icons/md";

const Page = () => {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [bankDetail, setBankDetail] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(currentDate);
  const [selectedUser, setSelectedUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [all, setAll] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const headers = {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        };
        const response = await axios.get(`${url}/api/v1/auth/users`, {
          headers,
        });
        console.log(response.data);
        const nonAdminUsers = response.data.filter((user) => !user.isAdmin);
        setUserList(nonAdminUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

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
          // setEditedData(apiData.data);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        console.error("Error during data fetch:", error);
      }
    };

    fetchBankData();
  }, []);

  const handleUserChange = async (event) => {
    event.preventDefault();
    const userId = event.target.value;
    if (userId !== "All") {
      setAll(false);

      setSelectedUser(userId);
      setExpandedRows(new Set());
      setBankDetail([]);
      console.log("not all");
    } else {
      setAll(true);
      setExpandedRows(new Set());
      setBankDetail([]);
    }
    // The rest of your code...
  };

  const toggleRow = async (rowId) => {
    if (!expandedRows.has(rowId)) {
      setExpandedRows(new Set());
    }
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
        setBankDetail([]);
      } else {
        if (!all) {
          (async () => {
            const response2 = await fetch(
              `${url}/api/v1/bank/getDetailsbyUser/${rowId}/${selectedUser}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response2.ok) {
              const apiData = await response2.json();
              console.log(apiData.data);
              setBankDetail(apiData.data);
            }
          })();
        } else {
          (async () => {
            const response2 = await fetch(
              `${url}/api/v1/bank/getDetailsWithoutUser/${rowId}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );
            if (response2.ok) {
              const apiData = await response2.json();
              console.log(apiData.data);
              setBankDetail(apiData.data);
            }
          })();
        }

        newExpandedRows.add(rowId);
      }
      return newExpandedRows;
    });
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex">
        <div className="flex-grow">
          <h1 className="text-3xl m-5">Transaction</h1>
          <div className="text-2xl m-5 flex justify-between">
            <select
              className="border w-[240px] rounded px-2 py-1 ml-1 my-3"
              value={all ? "All" : selectedUser}
              onChange={handleUserChange}
            >
              <option value="">Select a user</option>
              <option value={"All"}>All</option>
              {userList.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center p-4">
        <table className="w-full bg-white border border-collapse border-gray-300">
          <thead
            style={{
              position: "sticky",
              top: "0",
              backgroundColor: "#C5D1F7",
              zIndex: "1",
            }}
          >
            <tr>
              <th
                className="py-2 px-2 border-b border-r text-left"
                style={{ backgroundColor: "#4069E5", color: "white" }}
              >
                View Transactions
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
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((row, index) => (
                <React.Fragment key={index}>
                  <tr className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}>
                    <td
                      className="py-2 px-2 border-b text-center cursor-pointer text-3xl border-r text-green-500 "
                      style={{ fontSize: "x-large" }}
                      onClick={() => toggleRow(row._id)}
                    >
                      {expandedRows.has(row._id) ? (
                        <MdKeyboardArrowDown className=" m-auto" />
                      ) : (
                        "+"
                      )}
                    </td>
                    <td className="py-2 px-2 border-b border-r">
                      {row.bankName}
                    </td>
                    <td className="py-2 px-2 border-b border-r">{row.acNo}</td>
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
                      {row.usdBalance.toFixed(3)}
                    </td>
                  </tr>
                  {Array.isArray(bankDetail) && bankDetail && expandedRows && (
                    <tr>
                      <td colSpan={9}>
                        <div style={{ maxHeight: "270px", overflowY: "auto" }}>
                          <table className="w-full bg-white border border-collapse border-gray-300">
                            <thead
                              className={
                                expandedRows.has(row._id) ? "" : "hidden"
                              }
                              style={{
                                position: "sticky",
                                top: "0",
                                backgroundColor: "#C5D1F7",
                                zIndex: "1",
                              }}
                            >
                              <tr>
                                {all && (
                                  <th
                                    className="py-2 px-2 border-b border-r text-left"
                                    style={{
                                      backgroundColor: "#C5D1F7",
                                      color: "black",
                                    }}
                                  >
                                    Username
                                  </th>
                                )}
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
                              </tr>
                            </thead>
                            <tbody>
                              {bankDetail.map((item, subIndex) => {
                                return (
                                  <React.Fragment key={subIndex}>
                                    {item.bankId === row._id && (
                                      <tr>
                                        {all && (
                                          <td
                                            className={`${
                                              item.userId
                                                ? "py-2 px-2 border-b border-r"
                                                : "py-2 px-2 border-b border-r text-red-600"
                                            }`}
                                          >
                                            {item.userId
                                              ? item.userId.username
                                              : "User Not Found"}
                                          </td>
                                        )}
                                        <td className="py-2 px-2 border-b border- ">
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
                                        <td
                                          className={`py-2 px-2 border-b border-r ${
                                            item.payment ? "text-red-500" : ""
                                          } ${
                                            item.deposit ? "text-green-500" : ""
                                          }`}
                                        >
                                          {item.balance}
                                        </td>
                                      </tr>
                                    )}
                                  </React.Fragment>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      ;
    </>
  );
};

export default Page;
