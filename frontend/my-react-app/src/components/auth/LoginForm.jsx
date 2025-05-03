import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Custom animations
const styles = `
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
}

@keyframes gradientBg {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

@keyframes shake {
  0% { transform: translateX(0); }
  20% { transform: translateX(-10px); }
  40% { transform: translateX(10px); }
  60% { transform: translateX(-10px); }
  80% { transform: translateX(10px); }
  100% { transform: translateX(0); }
}

.animate-shake {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
}

.animate-fadeIn {
  animation: fadeIn 0.8s ease-out forwards;
}

.animate-pulse-blue {
  animation: pulse 2s infinite;
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.gradient-bg {
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientBg 15s ease infinite;
}

.staggered-fade-in-1 { animation-delay: 0.2s; opacity: 0; }
.staggered-fade-in-2 { animation-delay: 0.4s; opacity: 0; }
.staggered-fade-in-3 { animation-delay: 0.6s; opacity: 0; }
.staggered-fade-in-4 { animation-delay: 0.8s; opacity: 0; }
.staggered-fade-in-5 { animation-delay: 1.0s; opacity: 0; }
`;

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formShake, setFormShake] = useState(false);
  const [inputFocus, setInputFocus] = useState({
    email: false,
    password: false
  });
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      setError("Both email and password are required.");
      setFormShake(true);
      setTimeout(() => setFormShake(false), 500);
      return;
    }
  
    setIsLoading(true);
    setError("");
    setSuccess("");
  
    try {
      const response = await fetch("http://127.0.0.1:8000/api/api/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }
  
      // Optional: Save token or user info to localStorage/context here
      setSuccess("Login successful. Proceeding to OTP verification...");
  
      setTimeout(() => {
        navigate("/verify-otp");
      }, 1500);
    } catch (err) {
      setError(err.message);
      setFormShake(true);
      setTimeout(() => setFormShake(false), 500);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFocus = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: false }));
  };

  return (
    <>
      <style>{styles}</style>
      <section className="flex flex-col md:flex-row h-screen items-center overflow-hidden">
        {/* Left side - Animated background */}
        <div className="gradient-bg hidden lg:block w-full md:w-1/2 xl:w-2/3 h-screen relative">
          <div className="absolute inset-0 bg-black bg-opacity-20 z-10"></div>
          
          {/* Floating elements */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-2/3 left-1/3 w-24 h-24 bg-purple-500 rounded-full opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-2/3 w-40 h-40 bg-pink-500 rounded-full opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
          
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <div className="text-white text-5xl font-bold tracking-wider animate-fadeIn staggered-fade-in-1">
              OTP VERIFICATION
            </div>
          </div>
        </div>
        
        {/* Right side - Login form */}
        <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
          <div className={`w-full max-w-md ${formShake ? 'animate-shake' : ''}`}>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 animate-fadeIn staggered-fade-in-1">
              OTP VERIFICATION
            </h1>
            
            <h1 className="text-3xl font-bold leading-tight mt-8 animate-fadeIn staggered-fade-in-2">
              Welcome Back
              <div className="h-1 w-10 bg-blue-500 mt-2 rounded-full"></div>
            </h1>
            
            <p className="text-gray-600 mt-3 animate-fadeIn staggered-fade-in-2">
              Sign in to access your account
            </p>
            
            {/* Success Message */}
            {success && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg animate-fadeIn">
                {success}
              </div>
            )}
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg animate-fadeIn">
                {error}
              </div>
            )}
            
            <div className="mt-6 animate-fadeIn staggered-fade-in-3">
              <div className="relative">
                <label className={`absolute left-3 ${inputFocus.email || email ? '-top-2.5 text-xs bg-white px-1' : 'top-3.5'} text-gray-500 transition-all duration-300`}>
                  Email Address
                </label>
                <input 
                  type="email" 
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${inputFocus.email ? 'border-blue-500 shadow-md' : 'border-gray-300'}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  required 
                />
              </div>
              
              <div className="relative mt-6">
                <label className={`absolute left-3 ${inputFocus.password || password ? '-top-2.5 text-xs bg-white px-1' : 'top-3.5'} text-gray-500 transition-all duration-300`}>
                  Password
                </label>
                <input 
                  type="password" 
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${inputFocus.password ? 'border-blue-500 shadow-md' : 'border-gray-300'}`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => handleFocus('password')}
                  onBlur={() => handleBlur('password')}
                  required 
                />
              </div>
              
              <div className="text-right mt-2">
                <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300">
                  Forgot Password?
                </a>
              </div>
              
              <button 
                onClick={handleLogin}
                disabled={isLoading}
                className="w-full mt-8 bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none animate-pulse-blue"
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Logging in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
            
            <div className="my-8 flex items-center animate-fadeIn staggered-fade-in-4">
              <hr className="flex-1 border-gray-300" />
              <p className="mx-4 text-gray-500">or</p>
              <hr className="flex-1 border-gray-300" />
            </div>
            
            <p className="mt-8 text-center text-gray-600 animate-fadeIn staggered-fade-in-5">
              Need an account? {" "}
              <a href="/register" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300">
                Create an account
              </a>
            </p>
            
            <p className="text-xs text-center text-gray-500 mt-12 animate-fadeIn staggered-fade-in-5">
              Secure authentication powered by OTP verification
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginForm;