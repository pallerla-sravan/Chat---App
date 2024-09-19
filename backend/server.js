const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const signupRoute = require('./routes/signup');
const signinRoute = require('./routes/signin');
const usersRoute = require('./routes/users');
const { Server } = require('socket.io');
const { createServer } = require('http');
require('dotenv').config();

const mongoURL  = process.env.MONGODB_URI

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(mongoURL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use('/api/auth/signup', signupRoute);
app.use('/api/auth/signin', signinRoute);
app.use('/api/auth/users', usersRoute);

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true
  }
});

io.on('connection', (socket) => {

  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`Socket ${socket.id} joined room ${roomId}`);
  });
  
  socket.on('sendmessage', (data) => {
    io.to(data.roomId).emit('receiveMessage',data);
    
    console.log(`Message sent to room `,data);
   });

  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("This is Sravan's chat application");
});

server.listen(3000, () => {
  console.log("Server is running on port 3000");
}); 