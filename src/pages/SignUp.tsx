// import logo from "../assets/logo.png";
// import { Link, useNavigate } from "react-router-dom";
// import { IoMdMail } from "react-icons/io";
// import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
// import { useState, type ChangeEvent, type FormEvent } from "react";
// import { registerUser } from "../services/api";

// interface FormData {
//   email: string;
//   name: string;
//   password: string;
//   venueManager: boolean;
// }

// const SignUp = () => {
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState<FormData>({
//     email: "",
//     name: "",
//     password: "",
//     venueManager: false,
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState("");

//   const handleChange = (
//     e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     const newValue = name === "venueManager" ? value === "true" : value;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: newValue,
//     }));
//   };

//   const togglePassword = () => setShowPassword((prev) => !prev);

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setLoading(true);
//     setMessage("");

//     try {
//       await registerUser(formData);
//       setMessage("🎉 Registration successful!");
//       setFormData({
//         email: "",
//         name: "",
//         password: "",
//         venueManager: false,
//       });
//       setTimeout(() => navigate("/sign-in"), 1000);
//     } catch (err: any) {
//       setMessage(`❌ ${err.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };
//   return (
//     <div className="bg-[#f4f4f4]">
//       <div className="flex justify-between items-center gap-5 md:px-10 px-5 md:py-10 py-5 bg-white">
//         <div className="flex items-center gap-2">
//           <img src={logo} alt="logo" className="w-full" />
//           <h1 className="md:text-3xl text-2xl font-bold">Holidaze</h1>
//         </div>
//         <div className="flex items-center gap-3">
//           <h1 className="text-2xl font-bold md:block hidden">
//             Already have an account?
//           </h1>
//           <Link to="/sign-in">
//             <button className="md:px-6 px-4 py-2 border-3 md:text-2xl text-xl font-bold rounded-2xl cursor-pointer">
//               Login
//             </button>
//           </Link>
//         </div>
//       </div>

//       <div className="md:w-[40%] w-[85%] mx-auto my-20 bg-white md:p-20 p-10 space-y-5">
//         <h1 className="text-4xl font-bold mb-10">Welcome to Holidaze</h1>
//         <p className="text-[#828282]  text-xl font-medium">
//           Welcome to Holidaze were booking of venue have been made easy and
//           effective, join now and get started and watch your life experience
//           become more better.{" "}
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-4 w-[90%] mx-auto">
//           <div className="relative">
//             <IoMdMail className="absolute left-10 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="email"
//               id="email"
//               name="email"
//               required
//               placeholder="Active Email *"
//               pattern="^[\\w\\-.]+@(stud\\.)?noroff\\.no$"
//               value={formData.email}
//               onChange={handleChange}
//               className="w-full pl-20 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>

//           <div className="relative">
//             <FaUser className="absolute left-10 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               id="name"
//               name="name"
//               required
//               placeholder="Username"
//               value={formData.name}
//               onChange={handleChange}
//               className="w-full pl-20 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             />
//           </div>

//           <div className="relative">
//             <FaLock className="absolute left-10 top-2.5 h-5 w-5 text-gray-400" />
//             <input
//               type={showPassword ? "text" : "password"}
//               id="password"
//               name="password"
//               required
//               placeholder="Password"
//               value={formData.password}
//               onChange={handleChange}
//               className="w-full pl-20 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             />
//             <button
//               type="button"
//               onClick={togglePassword}
//               className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
//               tabIndex={-1}
//             >
//               {showPassword ? (
//                 <FaEyeSlash className="h-5 w-5" />
//               ) : (
//                 <FaEye className="h-5 w-5" />
//               )}
//             </button>
//           </div>

//           <div>
//             <label
//               htmlFor="venueManager"
//               className="block text-xl font-medium text-gray-700 mb-1"
//             >
//               Register as a Venue Manager?
//             </label>
//             <select
//               id="venueManager"
//               name="venueManager"
//               value={String(formData.venueManager)}
//               onChange={handleChange}
//               className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
//             >
//               <option value="false">No</option>
//               <option value="true">Yes</option>
//             </select>
//           </div>

//           <div className="text-xl font-semibold">
//             <input type="checkbox" required className="w-5 h-5 mr-2" /> I agree
//             to the <span className="text-[#8BC4FF]">Terms and Service</span> and{" "}
//             <span className="text-[#8BC4FF]">Privacy Policy.</span>
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full py-2 bg-[#8BC4FF] text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 text-xl font-bold mt-5"
//           >
//             {loading ? "Registering..." : "Sign Up"}
//           </button>

//           {message && (
//             <div className="text-center text-sm mt-2 text-red-500">
//               {message}
//             </div>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SignUp;

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api";

interface FormData {
  email: string;
  name: string;
  password: string;
  venueManager: boolean;
}

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
    password: "",
    venueManager: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newValue = name === "venueManager" ? value === "true" : value;
    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await registerUser(formData);
      setMessage("🎉 Registration successful!");
      setFormData({
        email: "",
        name: "",
        password: "",
        venueManager: false,
      });
      setTimeout(() => navigate("/sign-in"), 1000);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Modern Navbar */}
      <nav className="bg-white shadow-md py-4 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </div>
            <span className="font-bold text-xl text-gray-800">Holidaze</span>
          </Link>
          <Link to="/sign-in">
            <button className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 font-semibold rounded-lg px-5 py-2">
              Sign In
            </button>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-4xl w-full flex flex-col md:flex-row">
          {/* Left Panel - Info & Branding */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-8 md:p-12 md:w-2/5">
            <div className="h-full flex flex-col justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-6">
                  Welcome to Holidaze
                </h1>
                <p className="text-blue-100 mb-8">
                  Join our community today and discover the easiest way to book
                  venues for your perfect getaway.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p>Quick and easy booking process</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p>Exclusive venues for all occasions</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-500 bg-opacity-30 p-2 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <p>24/7 customer support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="p-8 md:p-12 md:w-3/5">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Create your account
              </h2>
              <p className="text-gray-500">
                Fill in the details below to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="your.email@stud.noroff.no"
                    pattern="^[\w\-.]+@(stud\.)?noroff\.no$"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Username Field */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    placeholder="Choose a username"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    required
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-10 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Venue Manager Option */}
              <div>
                <label
                  htmlFor="venueManager"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Account Type
                </label>
                <select
                  id="venueManager"
                  name="venueManager"
                  value={String(formData.venueManager)}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="false">Regular User</option>
                  <option value="true">Venue Manager</option>
                </select>
              </div>

              {/* Terms & Conditions */}
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="text-gray-600">
                    I agree to the{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              </div>

              {/* Error Message */}
              {message && (
                <div
                  className={`text-sm rounded-lg p-3 ${
                    message.includes("❌")
                      ? "bg-red-50 text-red-500"
                      : "bg-green-50 text-green-500"
                  }`}
                >
                  {message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 text-white font-medium rounded-lg py-3 transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    <span>Creating Account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </button>

              {/* Sign In Link for mobile */}
              <div className="text-center mt-6 md:hidden">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link to="/sign-in" className="text-blue-600 hover:underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-6 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2025 Holidaze. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
