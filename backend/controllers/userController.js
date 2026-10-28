import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { User } from "../models/userSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken } from "../utils/jwtToken.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  console.log("📝 Register request received");
  console.log("📁 Files:", req.files);
  console.log("📋 Body:", { ...req.body, password: "****" });

  const {
    userName,
    email,
    password,
    phone,
    address,
    role,
    bankAccountNumber,
    bankAccountName,
    bankName,
    easypaisaAccountNumber,
    paypalEmail,
  } = req.body;

  console.log("🔍 Validating required fields...");
  if (!userName || !email || !phone || !password || !address || !role) {
    console.error("❌ Missing required fields:", {
      userName: !userName,
      email: !email,
      phone: !phone,
      password: !password,
      address: !address,
      role: !role,
    });
    return next(new ErrorHandler("Please fill full form.", 400));
  }

  if (role === "Auctioneer") {
    console.log("🏢 Validating Auctioneer payment details...");
    if (!bankAccountName || !bankAccountNumber || !bankName) {
      console.error("❌ Missing bank details");
      return next(
        new ErrorHandler("Please provide your full bank details.", 400)
      );
    }
    if (!easypaisaAccountNumber) {
      console.error("❌ Missing easypaisa account");
      return next(
        new ErrorHandler("Please provide your easypaisa account number.", 400)
      );
    }
    if (!paypalEmail) {
      console.error("❌ Missing PayPal email");
      return next(new ErrorHandler("Please provide your paypal email.", 400));
    }
  }

  console.log("👤 Checking if user already exists:", email);
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    console.error("❌ User already registered with email:", email);
    return next(new ErrorHandler("User already registered.", 400));
  }

  // Handle profile image upload
  let profileImageData = {
    public_id: "default_user_profile",
    url: "https://via.placeholder.com/200?text=User+Avatar",
  };

  if (req.files && req.files.profileImage) {
    const profileImage = req.files.profileImage;

    console.log("📷 Image info:", {
      name: profileImage.name,
      mimetype: profileImage.mimetype,
      size: profileImage.size,
    });

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(profileImage.mimetype)) {
      console.error("❌ Invalid image format:", profileImage.mimetype);
      return next(new ErrorHandler("File format not supported.", 400));
    }

    try {
      console.log("☁️ Uploading to Cloudinary...");
      const cloudinaryResponse = await cloudinary.uploader.upload(
        profileImage.tempFilePath,
        {
          folder: "MERN_AUCTION_PLATFORM_USERS",
        }
      );

      if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error("❌ Cloudinary error:", cloudinaryResponse.error);
        console.warn("⚠️  Using placeholder image instead");
      } else {
        console.log("✅ Cloudinary upload successful");
        profileImageData = {
          public_id: cloudinaryResponse.public_id,
          url: cloudinaryResponse.secure_url,
        };
      }
    } catch (cloudinaryError) {
      console.error("❌ Cloudinary upload failed:", cloudinaryError.message);
      console.warn("⚠️  Using placeholder image due to Cloudinary error");
      // Continue with placeholder image
    }
  } else {
    console.log("⚠️  No image provided, using placeholder");
  }

  try {
    console.log("💾 Creating user in database...");
    const user = await User.create({
      userName,
      email,
      password,
      phone,
      address,
      role,
      profileImage: profileImageData,
      paymentMethods: {
        bankTransfer: {
          bankAccountNumber,
          bankAccountName,
          bankName,
        },
        easypaisa: {
          easypaisaAccountNumber,
        },
        paypal: {
          paypalEmail,
        },
      },
    });

    console.log("✅ User created successfully:", user._id);
    generateToken(user, "User Registered.", 201, res);
  } catch (dbError) {
    console.error("❌ Database error:", dbError.message);
    return next(
      new ErrorHandler(dbError.message || "Failed to register user.", 500)
    );
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  console.log("🔐 Login request received");
  console.log("📋 Credentials:", { email: req.body.email, password: "****" });

  const { email, password } = req.body;

  if (!email || !password) {
    console.error("❌ Email or password missing");
    return next(new ErrorHandler("Please fill full form.", 400));
  }

  console.log("🔍 Searching for user with email:", email);
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    console.error("❌ User not found with email:", email);
    return next(new ErrorHandler("No account found with this email.", 400));
  }

  console.log("👤 User found:", user._id);
  console.log("🔑 Comparing passwords...");
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    console.error("❌ Password mismatch for user:", email);
    return next(new ErrorHandler("Incorrect password.", 400));
  }

  console.log("✅ Password match successful");
  generateToken(user, "Login successfully.", 200, res);
});

export const getProfile = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});

// Used by CreateAuction.jsx to show the "Unpaid Commission" warning
// and disable the Create button before the user fills in the form.
export const getUnpaidCommission = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({
    success: true,
    unpaidCommission: user.unpaidCommission,
    status: user.unpaidCommission > 0 ? "pending" : "settled",
  });
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
});

export const fetchLeaderboard = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find({ moneySpent: { $gt: 0 } });
  const leaderboard = users.sort((a, b) => b.moneySpent - a.moneySpent);
  res.status(200).json({
    success: true,
    leaderboard,
  });
});
