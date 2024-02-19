"use client";
import React, { useState } from "react";

const Form = () => {
  const [showInputForm, setShowInputForm] = useState(false);

  const handleToggleInputForm = () => {
    setShowInputForm(!showInputForm);
  };

  const renderInputForm = () => {
    if (!showInputForm) {
      return null;
    }

    return (
      <div className="my-4">
        <label>Date:</label>
        <input
          type="date"
          placeholder="Date"
          className="mr-2 ml-4 border-none"
          value={new Date().toISOString().split("T")[0]}
        />
        <br />
        <label>Check#:</label>
        <input type="text" placeholder="Check#" className="mr-2" />
        <br />
        <label>Payee:</label>
        <input type="text" placeholder="Payee" className="mr-2" />
        <br />
        <label>Memo:</label>
        <input type="text" placeholder="Memo" className="mr-2" />
        <br />
        <label>Category:</label>
        <input type="text" placeholder="Category" className="mr-2" />
        <br />
        <label>Payment:</label>
        <input type="text" placeholder="Payment" className="mr-2" />
        <br />
        <label>Deposit:</label>
        <input type="text" placeholder="Deposit" className="mr-2" />
        <br />
        <label>Balance:</label>
        <input type="text" placeholder="Balance" className="mr-2" />
        <br />
        <label>Equivalent US$ Balance:</label>
        <input
          type="text"
          placeholder="Equivalent US$ Balance"
          className="mr-2"
          readOnly
        />
        <br />
        <button
          onClick={handleToggleInputForm}
          className="bg-blue-500 text-white px-4 py-2 mr-2"
        >
          Cancel
        </button>
        <button
          onClick={handleToggleInputForm}
          className="bg-green-500 text-white px-4 py-2"
        >
          Save
        </button>
      </div>
    );
  };

  return (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
      />
      <h2 className="text-2xl font-bold mb-4">Banking Information</h2>
      <h3 className="text-xl font-bold mb-2">Banking</h3>
      <table className="w-full table-auto mb-6">
        <thead>
          <tr>
            <th className="bg-gray-100 ">Actions</th>
            <th className="border bg-gray-100 px-4 py-2 ">Bank Name</th>
            <th className="border bg-gray-100 px-4 py-2">A/c no.</th>
            <th className="border bg-gray-100 px-4 py-2">Location</th>
            <th className="border bg-gray-100 px-4 py-2">Currency</th>
            <th className="border bg-gray-100 px-4 py-2 ">Balance</th>
            <th className="border bg-gray-100 w-32">US$ Equivalent Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank #1</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Dubai</td>
            <td className="border px-4 py-2">EUR</td>
            <td className="border px-4 py-2">80</td>
            <td className="border px-4 py-2">80</td>
            {/* <td>
              <button>Edit</button>
            </td>
            <td>
              {" "}
              <button>Delete</button>
            </td> */}
          </tr>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank # 1</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Dubai</td>
            <td className="border px-4 py-2">EUR</td>
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2" />
          </tr>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank # 1</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Dubai</td>
            <td className="border px-4 py-2">AED</td>
            <td className="border px-4 py-2" />
            <input type="text" />
            <td className="border px-4 py-2" />
          </tr>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank # 2</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Jersey</td>
            <td className="border px-4 py-2">USD</td>
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2" />
          </tr>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank # 2</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Jersey</td>
            <td className="border px-4 py-2">EUR</td>
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2" />
          </tr>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank # 2</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Jersey</td>
            <td className="border px-4 py-2">GBP</td>
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2" />
          </tr>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank # 3</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Cayman</td>
            <td className="border px-4 py-2">USD</td>
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2" />
          </tr>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank # 3</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Cayman</td>
            <td className="border px-4 py-2">EUR</td>
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2" />
          </tr>
          <tr>
            <td>
              <span
                onClick={handleToggleInputForm}
                className=" text-blue-500 text-center text-2xl"
              >
                Add+
              </span>
            </td>
            <td className="border px-4 py-2">Bank # 3</td>
            <td className="border px-4 py-2">XXXXX0000</td>
            <td className="border px-4 py-2">Cayman</td>
            <td className="border px-4 py-2">KYD</td>
            <td className="border px-4 py-2" />
            <td className="border px-4 py-2" />
          </tr>
        </tbody>
      </table>
      <h3 className="text-xl font-bold mb-2">Credit Cards</h3>
      {renderInputForm()}
    </>
  );
};

export default Form;
