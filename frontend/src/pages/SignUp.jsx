import { register } from "@/store/slices/userSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [bankAccountName, setBankAccountName] = useState("");
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [easypaisaAccountNumber, setEasypaisaAccountNumber] = useState("");
  const [paypalEmail, setPaypalEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [profileImagePreview, setProfileImagePreview] = useState("");

  const { loading, isAuthenticated } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  const dispatch = useDispatch();

  // 🔍 DEBUG: Log role changes
  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    console.log("👤 Role changed to:", newRole);
    setRole(newRole);
  };

  // 🔍 DEBUG: Log form field changes
  const handleFieldChange = (fieldName, setValue) => {
    return (e) => {
      const value = e.target.value;
      console.log(`📝 ${fieldName} changed:`, value);
      setValue(value);
    };
  };

  const handleRegister = (e) => {
    e.preventDefault();
    console.log("🚀 Register form submitted");
    console.log("📋 Form Data:", {
      userName,
      email,
      phone,
      address,
      role,
      hasProfileImage: !!profileImage,
      hasPassword: !!password,
    });

    // Validation checks
    if (!userName || !email || !phone || !address || !role || !password) {
      console.warn("⚠️  Some required fields are empty!");
      console.warn("Missing fields:", {
        userName: !userName,
        email: !email,
        phone: !phone,
        address: !address,
        role: !role,
        password: !password,
      });
      toast.error("Please fill in all personal details and select a role.");
      return;
    }

    console.log("ℹ️  Image is optional - can proceed without uploading");

    // Check auctioneer-specific fields
    if (role === "Auctioneer") {
      console.log("🏦 Auctioneer mode - validating payment details...");
      if (!bankName || !bankAccountNumber || !bankAccountName) {
        console.warn("⚠️  Bank details incomplete for Auctioneer!");
        toast.error("Please provide your full bank details.");
        return;
      }
      if (!easypaisaAccountNumber || !paypalEmail) {
        console.warn("⚠️  Easypaisa or PayPal details missing for Auctioneer!");
        toast.error("Please provide your Easypaisa number and PayPal email.");
        return;
      }
      console.log("✅ Auctioneer payment details complete");
    }

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("role", role);
    
    // Only append image if selected
    if (profileImage) {
      formData.append("profileImage", profileImage);
      console.log("📸 Image details:", {
        name: profileImage.name,
        type: profileImage.type,
        size: profileImage.size,
      });
    } else {
      console.log("⚠️  No image selected - server will use placeholder");
    }
    
    if (role === "Auctioneer") {
      formData.append("bankAccountName", bankAccountName);
      formData.append("bankAccountNumber", bankAccountNumber);
      formData.append("bankName", bankName);
      formData.append("easypaisaAccountNumber", easypaisaAccountNumber);
      formData.append("paypalEmail", paypalEmail);
      console.log("💳 Added Auctioneer payment methods to FormData");
    }
    
    console.log("📤 Dispatching register action...");
    dispatch(register(formData));
  };

  useEffect(() => {
    console.log("📊 Auth state changed:", { isAuthenticated, loading });
    if (isAuthenticated) {
      console.log("✅ User registered successfully. Redirecting to home...");
      navigateTo("/");
    }
  }, [dispatch, loading, isAuthenticated, navigateTo]);

  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (!file) {
      console.log("📸 No file selected");
      return;
    }
    console.log("📷 Image file selected:", { name: file.name, type: file.type, size: file.size });
    
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      console.error("❌ Invalid image format. Allowed: PNG, JPEG, WebP");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      console.log("✅ Image preview generated successfully");
      setProfileImagePreview(reader.result);
      setProfileImage(file);
    };
    reader.onerror = () => {
      console.error("❌ Error reading file:", reader.error);
    };
  };

  return (
    <>
    <section className="w-full px-5 flex flex-col min-h-screen items-center py-4 justify-center">
        <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
          <h1
            className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
          >
            Register
          </h1>
          <form
            className="flex flex-col gap-5 w-full"
            onSubmit={handleRegister}
          >
            <p className="font-semibold text-xl md:text-2xl">
              Personal Details
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={handleFieldChange("Full Name", setUserName)}
                  autoComplete="name"
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={handleFieldChange("Email", setEmail)}
                  autoComplete="email"
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Phone</label>
                <input
                  type="number"
                  value={phone}
                  onChange={handleFieldChange("Phone", setPhone)}
                  autoComplete="tel"
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={handleFieldChange("Address", setAddress)}
                  autoComplete="street-address"
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Role</label>
                <select
                  value={role}
                  onChange={handleRoleChange}
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                >
                  <option value="">Select Role</option>
                  <option value="Auctioneer">Auctioneer</option>
                  <option value="Bidder">Bidder</option>
                </select>
              </div>
              <div className="flex flex-col sm:flex-1">
                <label className="text-[16px] text-stone-600">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={handleFieldChange("Password", setPassword)}
                  autoComplete="current-password"
                  className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-1 gap-2">
              <label className="text-[16px] text-stone-600">
                Profile Image
              </label>
              <div className="flex items-center gap-3">
                <img
                  src={
                    profileImagePreview
                      ? profileImagePreview
                      : "/imageHolder.jpg"
                  }
                  alt="profileImagePreview"
                  className="w-14 h-14 rounded-full"
                />
                <input type="file" onChange={imageHandler} />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <label className="font-semibold text-xl md:2xl flex flex-col">
                Payment Method Details{" "}
                <span className="text-[12px] text-stone-500">
                  Fill Payment Details Only If you are registering as an
                  Auctioneer
                </span>
              </label>
              <div className="flex flex-col gap-2">
                <label className="text-[16px] text-stone-500">
                  Bank Details
                </label>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <select
                    value={bankName}
                    onChange={handleFieldChange("Bank Name", setBankName)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  >
                    <option value="">Select Your Bank</option>
                    <option value="Meezan Bank">Meezan Bank</option>
                    <option value="UBL">UBL</option>
                    <option value="HBL">HBL</option>
                    <option value="Allied Bank">Allied Bank</option>
                  </select>
                  <input
                    type="text"
                    value={bankAccountNumber}
                    placeholder="IBAN / IFSC"
                    onChange={handleFieldChange("Bank Account Number", setBankAccountNumber)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  />
                  <input
                    type="text"
                    value={bankAccountName}
                    placeholder="Bank Account UserName"
                    onChange={handleFieldChange("Bank Account Name", setBankAccountName)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  />
                </div>
              </div>
              <div>
                <label className="text-[16px] text-stone-600 font-semibold">
                  Easypaisa And Paypal Details
                </label>
                <div className="flex flex-col gap-1 sm:flex-row sm:gap-4">
                  <input
                    type="number"
                    value={easypaisaAccountNumber}
                    placeholder="Easypaisa Account Number"
                    onChange={handleFieldChange("Easypaisa Account", setEasypaisaAccountNumber)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  />
                  <input
                    type="email"
                    value={paypalEmail}
                    placeholder="Paypal Email"
                    onChange={handleFieldChange("PayPal Email", setPaypalEmail)}
                    className="text-[16px] py-2 bg-transparent border-b-[1px] border-b-stone-500 focus:outline-none sm:flex-1"
                    disabled={role === "Bidder"}
                  />
                </div>
              </div>
            </div>

            <button
              className="bg-[#d6482b] w-[420px] font-semibold hover:bg-[#b8381e] transition-all duration-300 text-xl py-2 px-4 rounded-md text-white mx-auto lg:w-[640px] my-4"
              type="submit"
              disabled={loading}
            >
              {loading && "Registering..."}
              {!loading && "Register"}
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default SignUp;
