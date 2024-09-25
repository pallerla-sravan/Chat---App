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
const port  = process.env.PORT || 3000

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

  socket.on('sendChatRequest', (data) => {
    const { sender, receiver } = data;
    const roomId = [sender, receiver].sort().join('_');
    socket.join(roomId);
    console.log(`${sender} sent a chat request to ${receiver}`);
    io.emit('receiveChatRequest', data);
  });

  socket.on('acceptChatRequest', (data) => {
    const { sender, receiver } = data;
    const roomId = [sender, receiver].sort().join('_');
    socket.join(roomId);
    
    io.emit('chatRequestAccepted', { roomId, sender, receiver });
    console.log(`${sender} and ${receiver} joined room ${roomId}`);
  });
  
  socket.on('sendmessage', (data) => {
    io.to(data.roomId).emit('receiveMessage',data);
    console.log(`Message sent to room ${data.roomId}: ${data.mess}`);
    
    console.log(`Message sent to room `,data); 
   });

  socket.on('disconnect', () => {
    console.log("User disconnected:", socket.id);
  });
});


server.listen(port, () => {
  console.log("Server is running on port 3000");
}); 










































