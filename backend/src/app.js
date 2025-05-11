import express from 'express';
import cors from 'cors';
import authRoute from './routes/authRoutes.js';
import shiftRoute from './routes/shiftRoutes.js';
import notificationRoute from './routes/notificationRoutes.js';
import swapRequestRoute from './routes/swapRequest.route.js';
import http from "http"; // Needed to attach socket to HTTP server
import { Server } from "socket.io";


const app = express();
app.use(express.json({ limit: '50mb' }));  // Adjust the limit as needed
app.use(express.urlencoded({ limit: '50mb', extended: true }));


app.use(cors({
  origin: '*', // Allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use("/api/user", authRoute);


//app.use("/api/shift", shiftRoute);
app.use("/api", shiftRoute);


//notification routes

app.use("/api", notificationRoute); // <-- New route

// Swap request routes

app.use("/api", swapRequestRoute); // <-- New route


const server = http.createServer(app); // Attach express to HTTP server

const io = new Server(server, {
  cors: {
    origin: "*", // Or your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("New client connected: bittu", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




export  {io,app};