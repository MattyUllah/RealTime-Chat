const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // React frontend URL
        methods: ['GET', 'POST'],
    },
});

app.use(express.json());

let messages = []; // Store all messages in memory

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Send previous messages to the newly connected user
    socket.emit('previousMessages', messages);

    // Listen for new messages
    socket.on('sendMessage', (data) => {
        const messageData = {
            ...data,
            senderId: socket.id, // Attach sender's socket ID
        };
        messages.push(messageData);
        io.emit('receiveMessage', messageData); // Broadcast to all connected users
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
