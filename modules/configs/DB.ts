import mongoose, { ConnectOptions } from "mongoose";
import config from "./configs";

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(config.connectionString, {} as ConnectOptions);

    mongoose.Promise = global.Promise;
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

export default connectDB;
