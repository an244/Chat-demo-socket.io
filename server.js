//Server Express
const express = require('express');
const app = express();
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views','./views');

const server = require("http").Server(app);
//socket io
const io = require("socket.io")(server);

server.listen(3000,()=>console.log('server started'));

const usersArray = [];

io.on("connection", socket =>{

 console.log(socket.id + ' : Connected');

  socket.on('disconnect', () =>{
    console.log(socket.id + ' : Disconnected!');
  });

  socket.on('Client-send-UserName', (userNameFromLogin)=>{
    const isExist = usersArray.some(user =>{
      return user === userNameFromLogin;
    });

    if(isExist) return socket.emit('Server-send-Duplicate-user-Login-Fail',userNameFromLogin);
    usersArray.push(userNameFromLogin);
    socket.emit('Server-send-Login-successful', userNameFromLogin);
  });
});

app.get('/',(req,res)=> {
res.render('home');
});