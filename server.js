// ─── REQUIREMENT ────────────────────────────────────────────────────────────────
const express = require('express');
const cat = require('cat-me');
const http = require('http');
const colors = require('colors');
const path = require('path');
const socketio = require('socket.io');
//*** Security
const cors = require('cors');
const helmet = require('helmet');
const xssClean = require('xss-clean');
const hpp = require('hpp');

//
// ─── UTILS IMPORT MESSAGE OBJECT ────────────────────────────────────────────────
    
const formatMessage = require('./utils/messages');
//*** Utils import Users
const {userJoin, 
    getCurrentUser, 
    userLeave, 
    getRoom,
    addMessage, 
    getMessages
} = require('./utils/users');
//*** Chat boot
const chatService = 'Chat service';

//*** Create app
const app = express();
// Create server 
const server = http.createServer(app);
const io = socketio(server);
//*** Security middlewares
app.use(cors());
app.use(helmet());
app.use(xssClean());
app.use(hpp());

 // ─── SET STATIC FOLDER ──────────────────────────────────────────────────────────
 app.use(express.static(path.join(__dirname, 'public/reactFrontEnd')));

 //
 // ─── SOCKETIO EVENTS LISTENERS ────────────────────────────────────────────────────
io.on('connection', (socket) =>{
    //*** ON JOIN ROOM
    socket.on('joinRoom', ({username, room})=>{
        let user = userJoin(socket.id, username, room);
        // Join the room 
        socket.join(user.room);
        // Emit wellcome to the current user
     socket.emit('message', formatMessage(chatService, `Wellcome to the chat.`));

    // Broadcast when user connet EXCEPT the user that emit the message
    socket.broadcast.to(user.room).emit('message', formatMessage(chatService, `${user.username} join the chat room.`) );
    
    // Send users and room informations
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoom(user.room)
    });

    });

    //**** Listen for chat messages
    socket.on('chatMessage', (msg)=>{
        const user = getCurrentUser(socket.id);
        // Save the message in the messages array
       addMessage(user.username, msg, user.room);
       // Get all messages by room
        io.to(user.room).emit('messages', getMessages(user.room));
        // Emit message to everybody
        // io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //*** Listen to typing event
    socket.on('typing', data =>{
    // console.log(data)
    // Broadcast when user is typing EXCEPT the user that is typing
    socket.broadcast.to(data.room).emit('message', formatMessage(chatService, `${data.username} is typing something.`) );
    })

    //**** On disconnect event
    socket.on('disconnect', ()=>{
        const user = userLeave(socket.id);

        if(user){
            // Send to all users
        io.to(user.room).emit('message', formatMessage(chatService,  `${user.username} left the chat, bye.`));
        
        // Send users and room informations
    io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoom(user.room)
    });
    
    }
        
    });
})

//**************** Listener
const PORT = 3001 || proccess.env.PORT;
server.listen(PORT, ()=> {
    console.log(cat());
    console.log(`CHAT SERVER UP ON PORT ${PORT}`.bgGreen.bold);
});