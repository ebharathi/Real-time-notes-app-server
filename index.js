const express = require("express");
const cors = require("cors");
const http = require('http');
const { Server } = require('socket.io');
//importing routers
const userRoutes = require("./routes/userRoutes");
const notesRoutes = require("./routes/notesRoutes");
const sharedAccess = require("./routes/sharedAccessRoutes");
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    }
});

// Enable CORS
app.use(cors());
app.use(express.json())
io.on('connection', (socket) => {
    console.log('A user connected with socket');

    // Join the room corresponding to the noteId
    socket.on('joinNote', (noteId) => {
        socket.join(noteId);
        console.log(`User joined Note : ${noteId}`);
    });

    socket.on('leaveNote', (noteId) => {
        socket.leave(noteId);
        console.log(`User left Note : ${noteId}`);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});


//user route
app.use("/user", userRoutes);
app.use("/notes", notesRoutes(io));
app.use("/access", sharedAccess);


const PORT = 5000;
server.listen(PORT, () => console.log("Server is listening on port", PORT));
