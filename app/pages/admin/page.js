"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../../components/AdminNavbar";
import url from "@/utils/url";

const Page = () => {
  const [data, setData] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [bankDetail, setBankDetail] = useState([]);

  const [selectedUser, setSelectedUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [userRecords, setUserRecords] = useState([]);

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
        setUserList(response.data);
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
    const userId = event.target.value;
    setSelectedUser(userId);
    console.log(selectedUser);
    // try {
    //   const response = await axios.get(
    //     `${url}/api/v1/bank/getDetailsbyUser/${rowId}/${selectedUser._id}`
    //   );
    //   setBankDetail(response.data); // Assuming the data is inside a 'data' property
    // } catch (error) {
    //   console.error(`Error fetching records for ${userId}`, error);
    //   setUserRecords([]); // Set to an empty array to clear any previous data
    // }
  };

  const toggleRow = async (rowId) => {
    setExpandedRows((prevExpandedRows) => {
      const newExpandedRows = new Set(prevExpandedRows);
      if (newExpandedRows.has(rowId)) {
        newExpandedRows.delete(rowId);
        setBankDetail([]);
      } else {
        (async () => {
          console.log(selectedUser);
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
          <div className="text-2xl m-5 flex items-center">
            {/* <h1>Select User</h1> */}
            <select value={selectedUser} onChange={handleUserChange}>
              <option value="">Select a user</option>
              {userList.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.username}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="m-5">
          <h1>Date</h1>
          <input type="date" />
        </div>
      </div>
      <div className="container w-full p-4">
        <h1 className="text-2xl font-bold mb-4">Banking Dashboard</h1>
        <div className="">
          <table className="w-full bg-white border border-gray-300">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b text-left">
                  See Transactions
                </th>
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
                        <td className="py-2 px-4 border-b">{row.usdBalance}</td>
                      </>
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
                  </React.Fragment>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      ;
    </>
  );
};

export default Page;
