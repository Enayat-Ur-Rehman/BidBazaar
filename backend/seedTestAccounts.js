// Creates the 5 accounts the automated tests in Testing/ log in with
// (see Testing/shared_config.py). Safe to run again: existing accounts
// are left alone, apart from resetting their unpaid commission to 0.
//
//   cd backend
//   node seedTestAccounts.js
import path from "path";
import { fileURLToPath } from "url";
import { config } from "dotenv";
import mongoose from "mongoose";
import { User } from "./models/userSchema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
config({ path: path.join(__dirname, "config", "config.env") });

const AVATAR = {
  public_id: "seed/default_avatar",
  url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
};
const PAYOUT = (email) => ({
  bankTransfer: { bankAccountNumber: "1234567890", bankAccountName: "Test Auctioneer", bankName: "Meezan Bank" },
  easypaisa: { easypaisaAccountNumber: 3001234567 },
  paypal: { paypalEmail: email },
});

const ACCOUNTS = [
  { userName: "Ammar Auctioneer", email: "ammar@gmail.com", password: "ammar@12", role: "Auctioneer" },
  { userName: "Ammar Auctioneer One", email: "ammar1@gmail.com", password: "12345678", role: "Auctioneer" },
  { userName: "Ammar Auctioneer Three", email: "ammar3@gmail.com", password: "12345678", role: "Auctioneer" },
  { userName: "Super Admin", email: "superadmin@gmail.com", password: "12345678", role: "Super Admin" },
  { userName: "Ammar Amir", email: "ammarkhanty2@gmail.com", password: "12345678", role: "Bidder" },
];

await mongoose.connect(process.env.MONGO_URI, { dbName: process.env.SEED_DB_NAME || "MERN_AUCTION_PLATFORM" });
for (const a of ACCOUNTS) {
  const existing = await User.findOne({ email: a.email });
  if (existing) {
    existing.unpaidCommission = 0;
    await existing.save();
    console.log(`exists   ${a.role.padEnd(11)} ${a.email}`);
    continue;
  }
  await User.create({
    ...a,
    phone: "03001234567",
    address: "Test Street, Karachi",
    profileImage: AVATAR,
    paymentMethods: a.role === "Auctioneer" ? PAYOUT(a.email) : undefined,
  }); // password is hashed by the schema's pre("save") hook
  console.log(`created  ${a.role.padEnd(11)} ${a.email}`);
}
await mongoose.disconnect();
console.log("Test accounts ready.");
