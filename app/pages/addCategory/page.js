"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Setting from "../setting/page";
import { FaEdit, FaTrash } from "react-icons/fa";
import Navbar from "@/components/navbar";
import url from "@/utils/url";

function Category() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios
      .get(`${url}/api/v1/category`)
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories", error);
      });
  };

  const addCategory = () => {
    axios
      .post(`${url}/api/v1/category/add`, { name: newCategory })
      .then((response) => {
        console.log("Category added successfully", response.data);
        fetchCategories();
        setNewCategory("");
      })
      .catch((error) => {
        console.error("Error adding category", error);
      });
  };

  const editCategory = (category) => {
    const updatedName = prompt("Edit category:", category.name);

    if (updatedName !== null) {
      axios
        .put(`${url}/api/v1/category/${category._id}`, {
          name: updatedName,
        })
        .then((response) => {
          console.log("Category edited successfully", response.data);
          // Instead of setting the editingCategory state, you should update the specific category in the state
          const updatedCategories = categories.map((cat) =>
            cat._id === category._id ? { ...cat, name: updatedName } : cat
          );
          setCategories(updatedCategories);
        })
        .catch((error) => {
          console.error("Error editing category", error);
        });
    }
  };

  const deleteCategory = (categoryId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (confirmDelete) {
      axios
        .delete(`${url}/api/v1/category/${categoryId}`)
        .then((response) => {
          console.log("Category deleted successfully", response.data);
          fetchCategories();
          alert("Category deleted successfully");
        })
        .catch((error) => {
          console.error("Error deleting category", error);
        });
    }
  };

  return (
    <>
      <Setting />

      <div className="container mx-auto p-4">
        {/* <h1 className="text-3xl font-semibold mb-4">Category Management</h1> */}

        {/* Add Category Form */}

        {/* Category Table */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Categories</h2>
          <table className="w-table-auto w-1/2">
            <thead>
              <tr>
                <th
                  className="px-4 py-2"
                  style={{ backgroundColor: "#4069E5FF", color: "white" }}
                >
                  Name
                </th>
                <th
                  className="px-4 py-2"
                  style={{ backgroundColor: "#4069E5FF", color: "white" }}
                >
                  Edit
                </th>
                <th
                  className="px-4 py-2"
                  style={{ backgroundColor: "#4069E5FF", color: "white" }}
                >
                  Delete
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category._id}>
                  <td className="border px-4 py-2">
                    {editingCategory === category._id ? (
                      <>
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => setEditingCategory(e.target.value)}
                          className="p-2 border rounded mr-2"
                        />
                        <button
                          onClick={() => editCategory(category)}
                          className="bg-blue-500 text-white p-2 rounded"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      category.name
                    )}
                  </td>
                  {editingCategory !== category._id && (
                    <>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => setEditingCategory(category._id)}
                          className="text-blue-500 mr-2"
                        >
                          <FaEdit className="text-2xl" />
                        </button>
                      </td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => deleteCategory(category._id)}
                          className="text-red-500"
                        >
                          <FaTrash className="text-2xl" />
                        </button>
                      </td>
                    </>
                  )}
                  {/* </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mb-8 flex" style={{ marginTop: "50px" }}>
          {/* <br/><br/><br/><br/> */}
          <label
            htmlFor="currencyName"
            className="text-bold "
            style={{ marginTop: "12px" }}
            // className="block text-sm font-medium text-gray-600 w-1/4"
          >
            <b>Add Category </b>
          </label>
          {/* <div className="flex"> */}
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category Name"
            className="mt-1 p-2 border rounded-md w-half bg-gray-200"
            style={{ height: "37px", marginLeft: "17px" }}
          />
          {/* </div> */}
        </div>
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white p-2 rounded"
          style={{ width: "200px" }}
        >
          Add
        </button>
      </div>
    </>
  );
}

export default Category;
