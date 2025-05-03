// Updated OTP Verification Component with proper email storage
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OtpVerification = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [manualEmail, setManualEmail] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  // Enhanced email retrieval with multiple fallbacks
  useEffect(() => {
    const getEmail = () => {
      try {
        // 1. Check URL params first
        const params = new URLSearchParams(location.search);
        let emailParam = params.get("email");
        
        // 2. Check localStorage (from login)
        if (!emailParam) {
          emailParam = localStorage.getItem("userEmail");
        }
        
        // 3. Check sessionStorage (as temporary storage)
        if (!emailParam) {
          emailParam = sessionStorage.getItem("userEmail");
        }
        
        // 4. Check location state (if navigated programmatically)
        if (!emailParam && location.state?.email) {
          emailParam = location.state.email;
        }

        // Validate and set email if found
        if (emailParam) {
          const decodedEmail = decodeURIComponent(emailParam);
          if (validateEmailFormat(decodedEmail)) {
            setEmail(decodedEmail);
            // Persist in sessionStorage as backup
            sessionStorage.setItem("userEmail", decodedEmail);
          } else {
            setError("Invalid email format");
          }
        } else {
          setError("Email not found");
        }
      } catch (err) {
        console.error("Email retrieval error:", err);
        setError("Failed to retrieve email");
      }
    };

    getEmail();
  }, [location]);

  const validateEmailFormat = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleManualEmailSubmit = (e) => {
    e.preventDefault();
    if (!validateEmailFormat(manualEmail)) {
      setError("Please enter a valid email");
      return;
    }

    setEmail(manualEmail);
    // Store in all possible storage locations
    localStorage.setItem("userEmail", manualEmail);
    sessionStorage.setItem("userEmail", manualEmail);
    setShowEmailInput(false);
    setError("");
    resendOtp(manualEmail);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (!email) {
      setError("Email is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`http://localhost:8000/api/verify-otp/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Verification successful!");
        // Clear temporary storage
        sessionStorage.removeItem("userEmail");
        setTimeout(() => navigate("/home"), 2000);
      } else {
        setError(data.detail || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async (emailToUse = email) => {
    if (!emailToUse) {
      setError("No email available for resend");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:8000/api/resend-otp/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("OTP resent successfully");
      } else {
        setError(data.detail || "Failed to resend OTP");
      }
    } catch (err) {
      console.error("Resend error:", err);
      setError("Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-200 font-sans">
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <h2 className="text-3xl font-bold text-center text-blue-400 mb-6">Verify Your Account</h2>

        {error && (
          <div className="mb-4 p-3 bg-red-900/50 border-l-4 border-red-500 text-red-200 rounded animate-pulse">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-900/50 border-l-4 border-green-500 text-green-200 rounded">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              {success}
            </div>
          </div>
        )}

        {/* Show manual email input if there's an email missing error and user wants to input manually */}
        {error && error.includes("Email is missing") && (
          <div className="mt-4 mb-4">
            {!showEmailInput ? (
              <button 
                onClick={() => setShowEmailInput(true)}
                className="text-blue-400 hover:text-blue-300 transition-colors hover:underline"
              >
                Enter your email manually
              </button>
            ) : (
              <form onSubmit={handleManualEmailSubmit} className="mt-4">
                <input
                  type="email"
                  value={manualEmail}
                  onChange={(e) => setManualEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                  required
                />
                <button 
                  type="submit"
                  className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mb-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
          <p className="text-center text-blue-300">
            An OTP has been sent to your email:
            <span className="font-semibold block mt-1 break-all">{email || "Loading email..."}</span>
          </p>
        </div>

        <form onSubmit={verifyOtp} className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">OTP Verification Code</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, '').substring(0, 6))}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-white text-center text-lg tracking-wider"
              placeholder="Enter OTP"
              required
              maxLength="6"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            disabled={isLoading || !email}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Verifying...
              </span>
            ) : "Verify OTP"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => resendOtp()}
            className={`text-blue-400 hover:text-blue-300 transition-colors hover:underline focus:outline-none ${
              isLoading || !email ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isLoading || !email}
          >
            {isLoading ? 'Resending...' : "Didn't receive the code? Resend OTP"}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-gray-400">
            <a href="/" className="text-blue-400 hover:text-blue-300 transition-colors hover:underline">
              Back to login
            </a>
          </p>
        </div>

        <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          <p>Secure authentication powered by OTP verification</p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;