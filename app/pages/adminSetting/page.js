"use client";
import Link from "next/link";
import Navbar from "@/components/navbar";
import React, { useState } from "react";
import { FaFilter, FaUsers } from "react-icons/fa";
import { BsBank2 } from "react-icons/bs";
import { BiDollarCircle } from "react-icons/bi";
import AdminNavbar from "@/components/AdminNavbar";

const Page = () => {
  const [buttonStates, setButtonStates] = useState({
    isClicked: false,
    isClicked1: false,
    isClicked2: false,
  });

  const handleClick = () => {
    setButtonStates({
      isClicked3: false,
      isClicked: true,
      isClicked1: false,
      isClicked2: false,
    });
  };

  const handleClick1 = () => {
    setButtonStates({
      isClicked3: false,
      isClicked1: true,
      isClicked: false,
      isClicked2: false,
    });
  };

  const handleClick2 = () => {
    setButtonStates({
      isClicked3: false,
      isClicked2: true,
      isClicked: false,
      isClicked1: false,
    });
  };
  const handleClick3 = () => {
    setButtonStates({
      isClicked3: true,
      isClicked2: false,
      isClicked: false,
      isClicked1: false,
    });
  };
  return (
    <>
      <AdminNavbar />
      <div className="flex ml-4 pl-4 gap-8">
        <button
          className={`mt-1 text-blue ${
            buttonStates.isClicked
              ? "text-blue-500 border-b border-blue-500"
              : ""
          } hover:text-blue-500 hover:border-b hover:border-blue-500`}
          onClick={handleClick}
        >
          <Link
            href="/pages/addForm"
            className="text-gray-500 text-2xl mt-1 flex hover:text-blue-500 focus:outline-none"
          >
            <BsBank2 size={35} />
            <p
              style={{
                marginLeft: "11px",
                marginTop: "8px",
                borderBottom: "2px solid transparent",
              }}
              className="hover:border-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            >
              Bank
            </p>
          </Link>
        </button>

        <button
          className={`mt-1 text-blue ${
            buttonStates.isClicked1
              ? "text-blue-500 border-b border-blue-500"
              : ""
          } hover:text-blue-500 hover:border-b hover:border-blue-500`}
          onClick={handleClick1}
        >
          <Link
            href="/pages/addCurrency"
            className="text-gray-500 text-2xl mt-1 flex hover:text-blue-500 focus:outline-none"
          >
            <BiDollarCircle size={35} />
            <p
              style={{
                marginLeft: "11px",
                marginTop: "3px",
                borderBottom: "2px solid transparent",
              }}
              className="hover:border-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            >
              Currency
            </p>
          </Link>
        </button>

        <button
          className={`mt-1 text-blue ${
            buttonStates.isClicked2
              ? "text-blue-500 border-b border-blue-500"
              : ""
          } hover:text-blue-500 hover:border-b hover:border-blue-500`}
          onClick={handleClick2}
        >
          <Link
            href="/pages/addCategory"
            className="text-gray-500 text-2xl mt-1 flex hover:text-blue-500 focus:outline-none"
          >
            <FaFilter size={35} />
            <p
              style={{
                marginLeft: "11px",
                marginTop: "3px",
                borderBottom: "2px solid transparent",
              }}
              className="hover:border-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            >
              Categories
            </p>
          </Link>
        </button>

        <button
          className={`mt-1 text-blue ${
            buttonStates.isClicked3
              ? "text-blue-500 border-b border-blue-500"
              : ""
          } hover:text-blue-500 hover:border-b hover:border-blue-500`}
          style={{ width: "150px", height: "62px" }}
          onClick={handleClick3}
        >
          <Link
            href="/pages/allUsers"
            className="text-gray-500 text-2xl mt-1 flex hover:text-blue-500 focus:outline-none"
          >
            <FaUsers size={35} />
            <p
              style={{
                marginLeft: "11px",
                marginTop: "3px",
                borderBottom: "2px solid transparent",
              }}
              className="hover:border-blue-500 focus:border-blue-500 transition duration-300 ease-in-out"
            >
              Users
            </p>
          </Link>
        </button>
      </div>
      <br />
      <br />
    </>
  );
};

export default Page;
