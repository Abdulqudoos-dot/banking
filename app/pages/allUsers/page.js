"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/v1/auth/users"
        );
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching user records:", error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (userId, userData) => {
    setEditingUserId(userId);
    setEditedUserData(userData);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedUserData({});
  };

  const handleSaveEdit = async (userId) => {
    try {
      await axios.put(
        `http://localhost:5000/api/v1/auth/users/${userId}`,
        editedUserData
      );
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, ...editedUserData } : user
        )
      );
      setEditingUserId(null);
      setEditedUserData({});
    } catch (error) {
      console.error("Error saving user edit:", error);
    }
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/auth/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin User Records</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Username</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="bg-white">
              <td className="border p-2">
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    value={editedUserData.username || user.username}
                    onChange={(e) =>
                      handleInputChange("username", e.target.value)
                    }
                  />
                ) : (
                  user.username
                )}
              </td>
              <td className="border p-2">
                {editingUserId === user._id ? (
                  <input
                    type="email"
                    value={editedUserData.email || user.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="border p-2">
                {editingUserId === user._id ? (
                  <>
                    <button
                      onClick={() => handleSaveEdit(user._id)}
                      className="bg-green-500 text-white p-1 mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-red-500 text-white p-1"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user._id, user)}
                      className="bg-blue-500 text-white p-1 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white p-1"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
