// "use client";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import React, { useState } from "react";

// const page = () => {
//   const router = useRouter();
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (password === "superadmin") {
//       router.push("/pages/superAdmin");
//     } else {
//       alert("Enter correct password");
//     }
//   };
//   return (
//     <div className="container mx-auto p-4 flex flex-col items-center justify-center mt-20">
//       <form className="w-full max-w-md space-y-4" onSubmit={handleSubmit}>
//         <div className="flex flex-col">
//           <label htmlFor="password" className="text-sm mb-2">
//             Enter password to go to Super Admin panel
//           </label>
//           <input
//             type="text"
//             id="password"
//             name="password"
//             value={password}
//             onChange={(e) => {
//               setPassword(e.target.value); // Fix here
//             }}
//             className={`shadow-sm border rounded w-full py-2 px-3 text-gray-700 focus:ring focus:ring-blue-500 focus:ring-opacity-50 `}
//             required
//           />
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-sm"
//           >
//             Go
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default page;
