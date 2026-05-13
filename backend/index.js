const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const http = require("http");
const path = require("path");
const cron = require("node-cron");
const cookieparser = require("cookie-parser");
const userRouter = require("./routes/userRoute");
const contactRouter = require("./routes/contactRoutes");
const messagesRouter = require("./routes/messagesRoutes");
const channelRouter = require("./routes/channelRoutes");
const { connectDb } = require("./dbconnection");
const { setUpSocket } = require("./socket/setupSocket");

const PORT = process.env.PORT || 3000;

const _dirname = path.resolve();

const app = express();
const server = http.createServer(app);
app.use(cookieparser());
app.use(express.json());

app.use(
  cors({
    origin: process.env.ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);


setInterval(
  async () => {
    const f = await fetch(`${process.env.ORIGIN}/health`);
    const data = await f.text()
    console.log(data);
  },
  1000 * 60 * 10,
);

app.use("/uploads/profiles", express.static("uploads/profiles"));
app.use("/uploads/files", express.static("uploads/files"));

app.use("/user", userRouter);
app.use("/contacts", contactRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/channel", channelRouter);

app.get("/health", (req, res) => {
  return res.json({ msg: "web chat backend running" });
});

setUpSocket(server);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(_dirname, "../frontend/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(_dirname, "../frontend/dist/index.html"));
  });
}

connectDb(process.env.DB_URI).then(() => {
  server.listen(PORT, () => {
    console.log("app running", "http://localhost:" + PORT);
  });
  console.log("db is connected");
});
