const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const ConnectDB = require("./config/db");
const routes = require("./Routes/Routes");
const app = express();
dotenv.config();
app.use(express.json());

const allowedOrigins = ["http://localhost:8081", "exp://192.168.180.121:8081"];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log(`Blocked by CORS: ${origin}`); // Debugging log
        callback(new Error("CORS Policy Violation: Access Denied"));
      }
    },
    credentials: true, // Allows cookies and creden
  })
);

app.use("/api", routes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  try {
    await ConnectDB();
    console.log(`server running http://localhost:${PORT}`);
  } catch (error) {
    console.error(error);
  }
});
