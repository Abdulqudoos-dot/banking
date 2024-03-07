// Import statements remain unchanged
"use client";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import url from "@/utils/url";
import AdminNavbar from "@/components/AdminNavbar";
const AdminPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUserData, setEditedUserData] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const headers = {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("token"),
      };
      try {
        const response = await axios.get(`${url}/api/v1/auth/users`, {
          headers,
        });
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
      await axios.put(`${url}/api/v1/auth/users/${userId}`, editedUserData);
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
      await axios.delete(`${url}/api/v1/auth/users/${userId}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      alert("User deleted successfully");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setEditedUserData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Input validation for new user form
    let validationErrors = {};
    if (!formData.username.trim()) {
      validationErrors.username = "Username is required";
    }
    if (!formData.email.trim()) {
      validationErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }
    if (!formData.password.trim()) {
      validationErrors.password = "Password is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      alert("Please fill in all required fields correctly.");
      return;
    }

    try {
      const response = await axios.post(
        `${url}/api/v1/auth/register`,
        formData
      );
      console.log(response.data);
      alert("User added successfully");
      // Additional logic if needed
    } catch (error) {
      console.error("Error registering user:", error);
      // Handle error response
      // Show an error message or take appropriate action
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Admin User Records</h1>
        <table className="w-full border">
          {/* Table Header */}
          <thead>
            <tr className="bg-gray-200">
              <th
                className="py-2 px-4 border-b font-medium text-left"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Username
              </th>
              <th
                className="py-2 px-4 border-b font-medium text-left"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Email
              </th>
              <th
                className="py-2 px-4 border-b font-medium text-left"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Password
              </th>
              <th
                className="py-2 px-4 border-b font-medium text-left"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Edit
              </th>
              <th
                className="py-2 px-4 border-b font-medium text-left"
                style={{ backgroundColor: "#4069E5FF", color: "white" }}
              >
                Delete
              </th>
            </tr>
          </thead>
          {/* Table Body */}
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
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                    />
                  ) : (
                    user.email
                  )}
                </td>
                <td className="border p-2">
                  {editingUserId === user._id ? (
                    <input
                      type="text"
                      value={editedUserData.password || user.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                    />
                  ) : (
                    "*".repeat(user.password.length)
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
                        <FaEdit className="text-2xl" />
                      </button>
                      {/* <button
              onClick={() => handleDelete(user._id)}
              className="bg-red-500 text-white p-1"
            >
              <FaTrash className="text-2xl" />
            </button> */}
                    </>
                  )}
                </td>
                {/* Additional td for Delete content */}
                <td className="border p-2">
                  {editingUserId !== user._id && (
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white p-1"
                    >
                      <FaTrash className="text-2xl" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <br />
      <br />
      <div className="container px-20 mt-8">
        <h2 className="text-2xl font-semibold mb-4">Add User</h2>
        <form onSubmit={handleFormSubmit} className="w-[500px]">
          <div className="mb-4">
            <label
              htmlFor="username"
              className="text-bold "
              style={{ marginTop: "12px" }}
            >
              <b>Name:</b>
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleFormChange}
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
              required
            />
          </div>

          <div className=" mb-4">
            <label
              htmlFor="email"
              className="text-bold "
              style={{ marginTop: "12px" }}
            >
              <b>Email:</b>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleFormChange}
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
              required
            />
          </div>
          <div className=" mb-4">
            <label
              htmlFor="password"
              className="text-bold "
              style={{ marginTop: "12px" }}
            >
              <b>Password:</b>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleFormChange}
              className="mt-1 p-2 border rounded-md w-full bg-gray-200"
              required
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white p-2">
            Add User
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminPage;
