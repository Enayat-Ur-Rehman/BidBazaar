import mongoose from "mongoose";

export const connection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "MERN_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some error occured while connecting to database: ${err}`);
    });
};

// import mongoose from "mongoose";

// export const connection = async () => {
//   try {
//     if (!process.env.MONGO_URI) {
//       throw new Error("MONGO_URI is not defined in .env");
//     }

//     const conn = await mongoose.connect(process.env.MONGO_URI, {
//       dbName: "MERN_AUCTION_PLATFORM",
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     console.log(`✅ Connected to database: ${conn.connection.host}`);
//   } catch (err) {
//     console.error(`❌ Database connection error: ${err.message}`);
//     process.exit(1); // stop the server if DB connection fails
//   }
// };
