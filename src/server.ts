import dotenv from "dotenv";
dotenv.config();

import app from "./app";
import databaseConnect from "./config/databaseconnection";

// database connection

const port = process.env.PORT || 3000;

databaseConnect();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
