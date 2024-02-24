"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminNavbar from "../../../components/AdminNavbar";

const Page = () => {
  const [selectedUser, setSelectedUser] = useState("");
  const [userList, setUserList] = useState([]);
  const [userRecords, setUserRecords] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/auth/users"
        ); // Replace with your actual API endpoint
        setUserList(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleUserChange = async (event) => {
    const user = event.target.value;

    setSelectedUser(user);

    try {
      const response = await axios.get(
        `http://localhost:5000/api/v1/bank/getAllBanks`
      );
      setUserRecords(response.data);
    } catch (error) {
      console.error(`Error fetching records for ${user}`, error);
    }
  };
  const renderRecords = (data) => {
    if (data && typeof data === "object") {
      const fieldNames = Object.keys(data);

      return (
        <div className="overflow-x-auto">
          <table className="w-full bg-white border border-gray-300">
            <thead>
              <tr>
                {fieldNames.map((fieldName) => (
                  <th key={fieldName} className="py-2 px-4 border-b text-left">
                    {fieldName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                {fieldNames.map((fieldName) => (
                  <td key={fieldName} className="py-2 px-4 border-b text-left">
                    {typeof data[fieldName] === "object"
                      ? renderRecords(data[fieldName]) // Recursively render nested objects
                      : data[fieldName]}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      );
    } else {
      return <p>No records selected</p>;
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="flex">
        <div className="flex-grow">
          <h1 className="text-3xl m-5">Transaction</h1>
          <div className="text-2xl m-5 flex items-center">
            <h1>Select User</h1>
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
      <div className="m-5">{renderRecords(userRecords)}</div>
    </>
  );
};

export default Page;
