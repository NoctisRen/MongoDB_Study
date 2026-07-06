const mongoose = require("mongoose");
const CONNECTION_STRING = 'mongodb://localhost:27017/CmpWrld';

const connectDb = async () => {
  try {
    console.log(`Connecting to: ${CONNECTION_STRING}`);
    const connect = await mongoose.connect(CONNECTION_STRING);
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};
module.exports = connectDb;
