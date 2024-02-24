"use client";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [navbarOpen, setNavbarOpen] = useState(false);
  const logoutHandle = () => {
    localStorage.clear();
    router.push("/");
  };
  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-blue-500 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <a
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-white"
              href="/"
            >
              Manal Family Office Holdings
            </a>
            <button
              className="text-white cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none"
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
          </div>
          <div
            className={
              "lg:flex flex-grow items-center" +
              (navbarOpen ? " flex" : " hidden")
            }
            id="example-navbar-danger"
          >
            <ul className="flex flex-col lg:flex-row list-none lg:ml-auto">
              <li className="nav-item">
                <button
                  className=" text-white mt-1"
                  style={{ width: "150px", height: "62px" }}
                >
                  <Link href="/pages/addForm" className="">
                    Add new bank
                  </Link>
                </button>
                <button
                  className=" text-white mt-1"
                  style={{ width: "150px", height: "62px" }}
                >
                  <Link href="/pages/addCurrency" className="">
                    Add currency
                  </Link>
                </button>
                <button
                  className=" text-white mt-1"
                  style={{ width: "150px", height: "62px" }}
                >
                  <Link href="/pages/register" className="">
                    Add new user
                  </Link>
                </button>
                <button
                  className=" text-white mt-1"
                  style={{ width: "150px", height: "62px" }}
                >
                  <Link href="/pages/allUsers" className="">
                    Show User
                  </Link>
                </button>
                <button
                  className=" text-white mt-1"
                  style={{ width: "150px", height: "62px" }}
                  onClick={logoutHandle}
                >
                  Logout
                </button>
                {/* <Link
                  className="px-3 py-2 flex items-center text-xs uppercase font-bold leading-snug text-white hover:opacity-75"
                  href="pages/register"
                >
                  <i className="fab fa-twitter text-lg leading-lg text-white opacity-75"></i>
                  <span className="ml-2">Register</span>
                </Link> */}
              </li>
            </ul>
          </div>
        </div>
      </nav>
          
    </>
  );
}
