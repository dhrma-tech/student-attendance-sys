const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://student-attendance-sys.vercel.app"
  ],
  credentials: true
}));

require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("Connected:", socket.id);
});

app.get("/api/status", (req, res) => {
  res.json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log("Running on", PORT));