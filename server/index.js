
const http = require('http')
const express = require('express');
const path = require('path');
const socketio = require('socket.io');
const cors = require('cors');
const port = process.env.PORT || 5000;


// if declare express app without http.createServer() socket-io break according socket-io docs
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const { addUser, removeUser, getUser, getUsersInRoom } = require('./UserController');

//Enable cors for serve api
app.use(cors());

// Serve the static files from the React app
app.use('/static', express.static(path.join(__dirname, "./../client/build/static")));
app.use('/manifest.json', express.static(path.join(__dirname, "./../client/build", "manifest.json")))


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'./../client/build/index.html'));
});


io.on('connect', (socket) => {
    socket.on('join', ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });
  
      if(error) return callback(error);
  
      socket.join(user.room);
  
      socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
      socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });
  
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
  
      callback();
    });
  
  });


server.listen(port,()=>console.log('Server is ready in port:  ' + port));

