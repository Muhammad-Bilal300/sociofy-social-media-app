import mongoose from "mongoose";

const dbConnect = () => {
  try {
    const mongoUri = process.env.DATABASE_URL_PRODUCTION;

    if (!mongoUri) {
      throw new Error(
        "DATABASE_URL is not defined in the environment variables"
      );
    }
    mongoose
      .connect(mongoUri)
      .then(() => {
        console.log("Database is connected");
      })
      .catch((error: unknown) => {
        console.log("Database is not connected due to: ", error);
      });
  } catch (error: unknown) {
    console.log("Database is not connected due to: ", error);
  }
};

export default dbConnect;
