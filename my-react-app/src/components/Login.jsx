import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const JobSeaLogin = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password1: "",
    password2: "",
    role: "user",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError(""); // Clear errors when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!isLogin && formData.password1 !== formData.password2) {
      setError("Passwords don't match");
      setIsLoading(false);
      return;
    }

    const url = isLogin ? "/api/login/" : "/api/register/";
    const requestData = isLogin
      ? { username: formData.username, password: formData.password1 }
      : formData;

    try {
      const response = await fetch(`http://127.0.0.1:8000${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok) {
        if (isLogin) {
          if (!data.access || !data.refresh) {
            setError("Invalid response from server: Missing tokens");
            return;
          }

          // localStorage.clear()

          // Store JWT tokens
          localStorage.setItem("access_token", data.access);
          localStorage.setItem("refresh_token", data.refresh);

          // Decode token to get user info
          try {
            const tokenPayload = JSON.parse(atob(data.access.split(".")[1]));
            localStorage.setItem("user_id", tokenPayload.user_id);
            localStorage.setItem("username", tokenPayload.username);
          } catch (e) {
            console.error("Error decoding token:", e);
          }
        }

        navigate("/home"); // Redirect to home page after login/signup
      } else {
        if (data.detail) {
          setError(data.detail);
        } else if (data.non_field_errors) {
          setError(data.non_field_errors.join(" "));
        } else if (typeof data === "object") {
          setError(Object.values(data).flat().join(" "));
        } else {
          setError("Something went wrong. Please try again.");
        }
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Panel - Image/Brand */}
      <div className="bg-blue-900 md:w-2/5 relative overflow-hidden"></div>

      {/* Right Panel - Form */}
      <div className="bg-white md:w-3/5 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center md:text-left mb-12">
            <h2 className="text-3xl font-bold text-gray-800">
              {isLogin ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-gray-600 mt-2">
              {isLogin
                ? "Please enter your details to access your account"
                : "Fill in your information to get started"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              {isLogin ? "Sign In" : "Create Account"}
            </h2>

            {/* Username Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Email Field (Optional for Login) */}
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            {/* Phone Number Field (Only for Signup) */}
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            {/* Role Selection (Only for Signup) */}
            {!isLogin && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                  <option value="company_staff">Company Staff</option>
                </select>
              </div>
            )}

            {/* Password Field */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                name="password1"
                value={formData.password1}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            {/* Confirm Password Field (Only for Signup) */}
            {!isLogin && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  name="password2"
                  value={formData.password2}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                  Processing...
                </span>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>

            {/* Switch Between Login and Signup */}
            <div className="mt-4 text-center text-sm">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError("");
                }}
                className="text-blue-600 ml-2 hover:underline focus:outline-none"
              >
                {isLogin ? "Sign up" : "Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default JobSeaLogin;