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

  //Bước 1.2: Server nhận user từ client gửi lên. Sau đó kiểm tra tên trong mảng 
  socket.on('Client-send-UserName', (userNameFromLogin)=>{
    //kiểm tra sự tồn tại user trong mảng
    const isExist = usersArray.some(user =>{
      return user === userNameFromLogin;
    });

    //Bước 1.2.1: Nếu đã tồn tại user thì đáp trả về cho client biết chọn user khác
    if(isExist) return socket.emit('Server-send-Duplicate-user-Login-Fail',userNameFromLogin);
    
    //Nếu ko trùng thì thêm phần tử vô mảng userArray
    usersArray.push(userNameFromLogin);
    socket.userNameSocket = userNameFromLogin; //tự tạo biến userNameSocket để phân biệt các socketid bằng tên.
    
    //Bước 1.2.3: sau khi thêm phần tử vô mảng userArray thì server sẽ gửi thông báo về client để tạo newUserFromLogin
    socket.emit('Server-send-Login-successful', userNameFromLogin);

    //Bước 2.1: server gửi mảng userArray cho client để hiện trong phần List User Online
    io.sockets.emit('Server-send-list-username-online',(usersArray));

  });

//Bước 3.2: Server lăng nghe client gửi sự kiện user click nut logout.
  socket.on('user-logout',()=>{
    //xóa phần tử trong mảng.
    usersArray.splice(usersArray.indexOf(socket.userNameSocket),1);

    //sử dụng lại sự kiện server gủi mảng usersArray để client cập nhật lại List User Online
    //bên client sẽ ko cần thêm sự nghe về sự kiện này vì đã viết trc đó rồi
    io.sockets.emit('Server-send-list-username-online',(usersArray));
  });

});

app.get('/',(req,res)=> {
res.render('home');
});