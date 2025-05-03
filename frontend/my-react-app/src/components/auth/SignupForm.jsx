import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Custom animations (same as login page)
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

const SignupForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password1: "",
    password2: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formShake, setFormShake] = useState(false);
  const [inputFocus, setInputFocus] = useState({
    username: false,
    email: false,
    phone_number: false,
    password1: false,
    password2: false
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError("");
  };

  const handleFocus = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field) => {
    setInputFocus(prev => ({ ...prev, [field]: false }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (formData.password1 !== formData.password2) {
      setError("Passwords don't match");
      setFormShake(true);
      setTimeout(() => setFormShake(false), 500);
      return;
    }
    
    if (!formData.phone_number || !/^\d{10}$/.test(formData.phone_number)) {
      setError("Phone number must be 10 digits");
      setFormShake(true);
      setTimeout(() => setFormShake(false), 500);
      return;
    }

    setIsLoading(true);
    setError("");
    
    try {
      const response = await fetch(`https://career-backend-production.up.railway.app/api/api/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      console.log("✅ Backend response:", data);
  
      if (response.ok) {
        setSuccess("Registration successful! OTP sent to your email.");
        // Store email in localStorage as backup
        localStorage.setItem("userEmail", formData.email);
        
        setTimeout(() => {
          navigate(`/verify-otp?email=${encodeURIComponent(formData.email)}`);
        }, 2000);
      } else {
        setError(data.error || "Registration failed. Try again.");
        setFormShake(true);
        setTimeout(() => setFormShake(false), 500);
      }
    } catch (err) {
      console.error("🌐 Network error:", err);
      setError("Network error. Please check your connection.");
      setFormShake(true);
      setTimeout(() => setFormShake(false), 500);
    } finally {
      setIsLoading(false);
    }
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
              CREATE ACCOUNT
            </div>
          </div>
        </div>
        
        {/* Right side - Signup form */}
        <div className="bg-white w-full md:max-w-md lg:max-w-full md:mx-auto md:w-1/2 xl:w-1/3 h-screen px-6 lg:px-16 xl:px-12 flex items-center justify-center">
          <div className={`w-full max-w-md ${formShake ? 'animate-shake' : ''}`}>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600 animate-fadeIn staggered-fade-in-1">
              CREATE ACCOUNT
            </h1>
            
            <h1 className="text-3xl font-bold leading-tight mt-8 animate-fadeIn staggered-fade-in-2">
              Join Us Today
              <div className="h-1 w-10 bg-blue-500 mt-2 rounded-full"></div>
            </h1>
            
            <p className="text-gray-600 mt-3 animate-fadeIn staggered-fade-in-2">
              Create your account to get started
            </p>
            
            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg animate-fadeIn">
                {error}
              </div>
            )}
            
            {/* Success Message */}
            {success && (
              <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg animate-fadeIn">
                {success}
              </div>
            )}
            
            <form onSubmit={handleRegister} className="mt-6 animate-fadeIn staggered-fade-in-3">
              {/* Username Field */}
              <div className="relative mb-4">
                <label className={`absolute left-3 ${inputFocus.username || formData.username ? '-top-2.5 text-xs bg-white px-1' : 'top-3.5'} text-gray-500 transition-all duration-300`}>
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${inputFocus.username ? 'border-blue-500 shadow-md' : 'border-gray-300'}`}
                  value={formData.username}
                  onChange={handleChange}
                  onFocus={() => handleFocus('username')}
                  onBlur={() => handleBlur('username')}
                  required
                />
              </div>
              
              {/* Email Field */}
              <div className="relative mb-4">
                <label className={`absolute left-3 ${inputFocus.email || formData.email ? '-top-2.5 text-xs bg-white px-1' : 'top-3.5'} text-gray-500 transition-all duration-300`}>
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${inputFocus.email ? 'border-blue-500 shadow-md' : 'border-gray-300'}`}
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={() => handleBlur('email')}
                  required
                />
              </div>
              
              {/* Phone Number Field */}
              <div className="relative mb-4">
                <label className={`absolute left-3 ${inputFocus.phone_number || formData.phone_number ? '-top-2.5 text-xs bg-white px-1' : 'top-3.5'} text-gray-500 transition-all duration-300`}>
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone_number"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${inputFocus.phone_number ? 'border-blue-500 shadow-md' : 'border-gray-300'}`}
                  value={formData.phone_number}
                  onChange={handleChange}
                  onFocus={() => handleFocus('phone_number')}
                  onBlur={() => handleBlur('phone_number')}
                  required
                />
              </div>
              
              {/* Password Field */}
              <div className="relative mb-4">
                <label className={`absolute left-3 ${inputFocus.password1 || formData.password1 ? '-top-2.5 text-xs bg-white px-1' : 'top-3.5'} text-gray-500 transition-all duration-300`}>
                  Password
                </label>
                <input
                  type="password"
                  name="password1"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${inputFocus.password1 ? 'border-blue-500 shadow-md' : 'border-gray-300'}`}
                  value={formData.password1}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password1')}
                  onBlur={() => handleBlur('password1')}
                  required
                />
              </div>
              
              {/* Confirm Password Field */}
              <div className="relative mb-6">
                <label className={`absolute left-3 ${inputFocus.password2 || formData.password2 ? '-top-2.5 text-xs bg-white px-1' : 'top-3.5'} text-gray-500 transition-all duration-300`}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  name="password2"
                  className={`w-full px-4 py-3 rounded-lg border transition-all duration-300 ${inputFocus.password2 ? 'border-blue-500 shadow-md' : 'border-gray-300'}`}
                  value={formData.password2}
                  onChange={handleChange}
                  onFocus={() => handleFocus('password2')}
                  onBlur={() => handleBlur('password2')}
                  required
                />
              </div>
              
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl focus:outline-none animate-pulse-blue"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Creating Account...
                  </>
                ) : "Sign Up"}
              </button>
            </form>
            
            <div className="my-8 flex items-center animate-fadeIn staggered-fade-in-4">
              <hr className="flex-1 border-gray-300" />
              <p className="mx-4 text-gray-500">or</p>
              <hr className="flex-1 border-gray-300" />
            </div>
            
            <p className="mt-8 text-center text-gray-600 animate-fadeIn staggered-fade-in-5">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-blue-600 hover:text-blue-800 transition-colors duration-300">
                Sign in
              </a>
            </p>
            
            
          </div>
        </div>
      </section>
    </>
  );
};

export default SignupForm;