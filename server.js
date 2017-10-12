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

io.on("connection", socket =>{

 console.log('co nguoi ket noi: '+ socket.id);

  socket.on('disconnect', () =>{

  });

  socket.on('Client-send-data', (data)=>{
   
  });
});

app.get('/',(req,res)=> {
res.render('home');
});