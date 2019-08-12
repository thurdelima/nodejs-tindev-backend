const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const routes = require('./routes');
const server = require('http').Server(app);
const io = require('socket.io')(server);

const connectedUsers = {};

io.on('connection', socket => {
  const { user } = socket.handshake.query;

  console.log(user, socket.id);

  connectedUsers[user] = socket.id;

});


mongoose.connect("mongodb://arthur:arthur@192.168.99.101:27017/admin", {useNewUrlParser: true});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;

  return next();

});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);