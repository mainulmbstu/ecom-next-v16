import mongoose, { connection } from "mongoose";

// const URI = process.env.MONGO_LOCAL;
const URI = process.env.MONGO_ATLAS;

export default async function dbConnect() {
  if (connection.readyState === 1) {
    console.log("Already connected to database");
    return;
  }
  try {
    let db = await mongoose.connect(URI, {
      dbName: "ecomnext",
    });
    console.log(
      `MongoDB connected to ${db.connection.host}/${db.connection.name}`,
    );
  } catch (error) {
    console.log({ msg: "db, mongo error", error });
    // process.exit(1)
  }
}
