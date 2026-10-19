import { login } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ArrowRight } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { loading, isAuthenticated, user, loginError } = useSelector((state) => state.user);

  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  // 🔍 DEBUG: Log email changes
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    console.log("📧 Email changed:", newEmail);
    setEmail(newEmail);
  };

  // 🔍 DEBUG: Log password changes
  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    console.log("🔐 Password changed: (length: " + newPassword.length + ")");
    setPassword(newPassword);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("🚀 Login form submitted");
    console.log("📧 Email:", email);
    console.log("🔐 Password length:", password.length);
    
    if (!email || !password) {
      console.warn("⚠️  Email or password is empty!");
      return;
    }

    // Send as JSON, not FormData
    const loginData = {
      email,
      password,
    };
    
    console.log("📤 Dispatching login with data:", { email, password: "****" });
    dispatch(login(loginData));
  };

  useEffect(() => {
    console.log("📊 Auth state changed:", { isAuthenticated, loading, userRole: user?.role });
    
    if (isAuthenticated && user) {
      console.log("✅ User authenticated. Redirecting based on role:", user.role);
      // Redirect based on user role
      if (user.role === "Auctioneer") {
        console.log("↩️  Redirecting to /view-my-auctions");
        navigateTo("/view-my-auctions");
      } else if (user.role === "Bidder") {
        console.log("↩️  Redirecting to /auctions");
        navigateTo("/auctions");
      } else if (user.role === "Super Admin") {
        console.log("↩️  Redirecting to /dashboard");
        navigateTo("/dashboard");
      } else {
        console.log("↩️  Redirecting to home");
        navigateTo("/");
      }
    } else if (!loading) {
      console.log("❌ Not authenticated and not loading");
    }
  }, [isAuthenticated, user, navigateTo, loading]);

  return (
    <section className="w-full px-5 py-8 lg:px-8 flex flex-col min-h-screen justify-center items-center">
      <div className="bg-white mx-auto w-full max-w-md rounded-2xl shadow-xl border border-stone-200 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D6482B] to-[#ff6b4a]">Back</span>
          </h1>
          <p className="text-stone-600">Login to your BidBazaar account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          
          {/* Email Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              autoComplete="email"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6482B] focus:border-transparent transition-all ${loginError && loginError.toLowerCase().includes("email") ? "border-red-500" : "border-stone-300"}`}
              required
            />
            {loginError && loginError.toLowerCase().includes("email") && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-stone-700 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your password"
              autoComplete="current-password"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D6482B] focus:border-transparent transition-all ${loginError && loginError.toLowerCase().includes("password") ? "border-red-500" : "border-stone-300"}`}
              required
            />
            {loginError && loginError.toLowerCase().includes("password") && (
              <p className="text-red-500 text-sm">{loginError}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="flex justify-end">
            <Link 
              to="/forgot-password" 
              className="text-sm text-[#D6482B] hover:text-[#b8381e] font-medium transition-colors"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-[#D6482B] to-[#b8381e] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg hover:shadow-[#D6482B]/50 transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging In...
              </>
            ) : (
              <>
                Login
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-stone-600">
            Don't have an account?{" "}
            <Link 
              to="/sign-up" 
              className="text-[#D6482B] hover:text-[#b8381e] font-semibold transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-stone-500">Or continue with</span>
          </div>
        </div>

        
      </div>
    </section>
  );
};

export default Login;