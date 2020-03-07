
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

//Enable cors for serve api
app.use(cors());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));


// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});




app.listen(port,()=>console.log('Server is ready in port:  ' + port));

