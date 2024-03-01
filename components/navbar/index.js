import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FaBars, FaSignOutAlt } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoSettings } from "react-icons/io5";

export default function Navbar() {
  const router = useRouter();

  const [navbarOpen, setNavbarOpen] = useState(false);
  const logoutHandle = () => {
    localStorage.clear();
    router.push("/");
  };

  const [isClicked, setIsClicked] = useState(false);
  const [isClicked1, setIsClicked1] = useState(false);
  const [isClicked2, setIsClicked2] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const handleClick = () => {
    setIsClicked(true);
  };
  const handleClick1 = () => {
    setIsClicked1(true);
  };
  const handleClick2 = () => {
    setIsClicked2(true);
  };
  useEffect(() => {
    setInitialLoad(false);
  }, []);

  return (
    <>
      <nav className="relative flex flex-wrap items-center justify-between px-2 py-3 bg-gray-200 mb-3">
        <div className="container px-4 mx-auto flex flex-wrap items-center justify-between">
          <div className="w-full relative flex justify-between lg:w-auto lg:static lg:block lg:justify-start">
            <Link
              className="text-sm font-bold leading-relaxed inline-block mr-4 py-2 whitespace-nowrap uppercase text-black"
              href="/pages/home"
            >
              <Image src={"/manal.png"} width={150} height={100} />
            </Link>
            <button
              className={`text-black cursor-pointer text-xl leading-none px-3 py-1 border border-solid border-transparent rounded bg-transparent block lg:hidden outline-none focus:outline-none ${
                initialLoad ? "initial-icon-size" : ""
              }`}
              type="button"
              onClick={() => setNavbarOpen(!navbarOpen)}
            >
              <FaBars />
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
              <li className="nav-item flex">
                {/* <button
                  className={`mt-1 text-black ${isClicked ? 'text-blue-500 border-b border-blue-500' : ''} hover:text-blue-500 hover:border-b hover:border-blue-500`}
                  style={{ width: '150px', height: '62px' }}
                  onClick={handleClick}
                >
                  <Link href="/pages/addForm" className="">
                  Add new bank
                  </Link>
                </button>
                <button
                  className={`mt-1 text-black ${isClicked1 ? 'text-blue-500 border-b border-blue-500' : ''} hover:text-blue-500 hover:border-b hover:border-blue-500`}
                  style={{ width: '150px', height: '62px' }}
                  onClick={handleClick1}
                >
                  <Link href="/pages/addCurrency" className="">
                    Add currency
                  </Link>
                </button>
                <button
                  className={`mt-1 text-black ${isClicked2 ? 'text-blue-500 border-b border-blue-500' : ''} hover:text-blue-500 hover:border-b hover:border-blue-500`}
                  style={{ width: '150px', height: '62px' }}
                  onClick={handleClick2}
                >
                  <Link href="/pages/addcategory" className="">
                    Add category
                  </Link>
                </button> */}
                <button
                  className={`mt-1 text-blue ${
                    isClicked2 ? "text-blue-500 border-b border-blue-500" : ""
                  } hover:text-blue-500 hover:border-b hover:border-blue-500`}
                  style={{ width: "150px", height: "62px" }}
                  onClick={handleClick2}
                >
                  <Link
                    href="/pages/setting"
                    className="text-black text-2xl mt-1 flex items-center"
                  >
                    <IoSettings size={30} />
                    Setting
                  </Link>
                </button>
                <button
                  className="text-red-500 text-2xl mt-1 flex items-center"
                  style={{ width: "150px", height: "62px" }}
                  onClick={logoutHandle}
                >
                  <FaSignOutAlt size={30} className="mr-2" />
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}
