import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [username, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // default role
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const backendURL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";


    try {
      const response = await axios.post(`${backendURL}/api/auth/signup`, {
  username: username.trim(),
  email: email.trim(),
  password,
  role,
});

    

      console.log("Axios response:", response.data);

      localStorage.setItem("token", response.data.token);
      navigate("/home");
    } catch (err) {
      console.error("Axios error:", err);
      // axios errors are cleaner
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Signup failed");
      } else {
        setError("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-center p-10">
        <div className="max-w-md text-center">
          <div className="flex justify-center mb-8">
            <img src="/public/login.jpg" alt="login" />
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center p-10  bg-[#262E3E]">
        <div className="w-full max-w-md bg-white rounded-xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-black mb-3">Sign Up</h3>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Full Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={username}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full pl-3 pr-3 py-3 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 focus:border-black"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full pl-3 pr-3 py-3 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-purple"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full pl-3 pr-3 py-3 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 focus:border-black"
                required
              />
            </div>

            {/* Role Selection */}
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-800">
                Select Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full pl-3 pr-3 py-3 text-black bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-900 focus:border-black"
                required
              >
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FC7C2C] text-white py-3 rounded-lg hover:bg-[#FC7C2C] transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing Up..." : "Sign Up"}
              </button>
            </div>

            {/* Already Have Account */}
            <div className="text-center mt-6">
              <p className="text-gray-800">
                Already have an account?{" "}
                <Link to="/login" className="text-black hover:text-gray-600 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
