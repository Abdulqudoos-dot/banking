"use client";
// import React from 'react'
// import Link from 'next/link';

// const page = () => {
//   return (
//     <div className="flex item-center justify-center">
//         <Link href="/"clasName="ml-4">
//             Bank
//         </Link>
//         <Link href="/"clasName="ml-4">
//             Currency
//         </Link>
//         <Link href="/"clasName="ml-4">
//             Categories
//         </Link>

//     </div>
//   )
// }

// export default page

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaBank,
  FaMoneyBillWave,
  FaUserPlus,
  FaUsers,
  FaFilter,
} from "react-icons/fa";
import { HiCurrencyEuro } from "react-icons/hi";
import { CiBank } from "react-icons/ci";
import { BsBank2 } from "react-icons/bs";
import Navbar from "@/components/navbar";
const Page = () => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    setIsClicked(true);
  };
  return (
    <div>
      <Navbar />
      <nav className="p-4 flex justify-around items-center">
        <button
          className={`mt-1 text-blue ${
            isClicked ? "text-blue-500 border-b border-blue-500" : ""
          } hover:text-blue-500 hover:border-b hover:border-blue-500`}
          style={{ width: "150px", height: "62px" }}
          onClick={handleClick}
        >
          <Link
            href="/pages/addForm"
            className="text-black text-2xl mt-1 flex "
          >
            {/* <a > */}
            <BsBank2 size={50} />
            Add new bank
            {/* </a> */}
          </Link>
        </button>

        <button
          className={`mt-1 text-blue ${
            isClicked ? "text-blue-500 border-b border-blue-500" : ""
          } hover:text-blue-500 hover:border-b hover:border-blue-500`}
          style={{ width: "150px", height: "62px" }}
          onClick={handleClick}
        >
          <Link
            href="/pages/addCurrency"
            className="text-black text-2xl mt-1 flex "
          >
            {/* <a > */}
            <HiCurrencyEuro size={50} />
            Add currency
            {/* </a> */}
          </Link>
        </button>

        <button
          className={`mt-1 text-blue ${
            isClicked ? "text-blue-500 border-b border-blue-500" : ""
          } hover:text-blue-500 hover:border-b hover:border-blue-500`}
          style={{ width: "150px", height: "62px" }}
          onClick={handleClick}
        >
          <Link
            href="/pages/addCategory"
            className="text-black text-2xl mt-1 flex"
          >
            {/* <a > */}
            <FaFilter size={50} />
            Categories
            {/* </a> */}
          </Link>
        </button>

        {/* <button
                  className={`mt-1 text-blue ${isClicked ? 'text-blue-500 border-b border-blue-500' : ''} hover:text-blue-500 hover:border-b hover:border-blue-500`}
                  style={{ width: '150px', height: '62px' }}
                  onClick={handleClick}
                >
        <Link href="/pages/home"className="text-gray-200 text-2xl mt-1 flex">
          {/* <a > */}
        {/* <FaUsers size={50} />
            Users
          {/* </a> */}
        {/* </Link></button>  */}
      </nav>

      {/* Add this style in your global CSS or as a module */}
      <style jsx>{`
        .nav-link {
          text-decoration: none;
          color: black;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          padding-bottom: 4px;
          border-bottom: 2px solid transparent;
        }

        .nav-link:hover,
        .nav-link.active {
          color: blue;
          border-bottom-color: blue;
        }
      `}</style>
    </div>
  );
};

export default Page;
