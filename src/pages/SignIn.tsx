import logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router-dom";
import { IoMdMail } from "react-icons/io";
import { FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { loginUser } from "../services/api";

interface FormData {
  email: string;

  password: string;
}

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",

    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await loginUser(formData);
      setMessage("🎉 Registration successful!");
      setFormData({
        email: "",

        password: "",
      });

      const { accessToken, venueManager } = response.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("venueManager", JSON.stringify(venueManager));

      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-[#f4f4f4] h-[100dvh]">
      <div className="flex justify-between items-center gap-5 md:px-10 px-5 md:py-10 py-5 bg-white">
        <div className="flex items-center gap-2">
          <img src={logo} alt="logo" className="w-full" />
          <h1 className="md:text-3xl text-2xl font-bold">Holidaze</h1>
        </div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold md:block hidden">
            Don't have an account?
          </h1>
          <Link to="/sign-up">
            <button className="md:px-6 px-4 py-2 border-3 md:text-2xl text-xl font-bold rounded-2xl cursor-pointer">
              Register
            </button>
          </Link>
        </div>
      </div>

      <div className="md:w-[40%] w-[85%] mx-auto my-20 bg-white md:p-20 p-10 space-y-5">
        <h1 className="text-4xl font-bold mb-10">Welcome to Holidaze</h1>
        <p className="text-[#828282]  text-xl font-medium">
          Welcome to Holidaze were booking of venue have been made easy and
          effective, join now and get started and watch your life experience
          become more better.{" "}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 w-[90%] mx-auto">
          <div className="relative">
            <IoMdMail className="absolute left-10 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Active Email *"
              pattern="^[\\w\\-.]+@(stud\\.)?noroff\\.no$"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-20 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-10 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              required
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-20 pr-12 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute right-4 top-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5" />
              ) : (
                <FaEye className="h-5 w-5" />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-[#8BC4FF] text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 text-xl font-bold mt-5"
          >
            {loading ? "Logging in..." : "Sign In"}
          </button>

          {message && (
            <div className="text-center text-sm mt-2 text-red-500">
              {message}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default SignIn;
