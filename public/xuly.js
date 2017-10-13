const socket = io("http://localhost:3000");

$(document).ready(()=>{
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnLogin').click(()=>{       
        const userNameFromLogin = $('#txtUserName').val();

        //Bước 1.1: từ browser gửi user từ textbox lên server
        socket.emit('Client-send-UserName',userNameFromLogin);
        $('#txtUserName').val('');    
    });

//Bước 1.2.2: sau khi server kiểm tra và phát hiện trùng user thì gửi về client để báo người dùng đổi tên khác.
socket.on('Server-send-Duplicate-user-Login-Fail',(userNameFromLogin)=>{
    alert(userNameFromLogin +' is existed already. Choose another one!');
});

//Bước 1.2.4: client lắng nghe sau khi server đã thêm phần tử vô mảng
//ẩn form login, mở form chat và hiện Hello tên người login
socket.on('Server-send-Login-successful',(newUserFromLogin)=>{
    $('#loginForm').hide();
    $('#chatForm').show();
    $('#currentUser').html(newUserFromLogin);
    alert(newUserFromLogin+ ': login');
}); 

//Bước 2.2: client nhận mảng usersArray từ server để hiện thị trong List User Online
socket.on('Server-send-list-username-online', (usersArrayFromServer)=>{
    $('#namesOnline').html('')//xoa noi dung trc ghi gan user online;
    usersArrayFromServer.forEach((name)=>{
        $('#namesOnline').append("<div class='usersOnline'>"+name+ "</div>");
    });
});

//Bước 3.1: client gửi sự kiện user click nút logout 
$('#btnLogout').click(()=>{
    socket.emit('user-logout');
    $('#loginForm').show();
    $('#chatForm').hide();
});

$('#btnSendMessage').click(()=>{
    const contentMsgFromClient = $('#txtMessage').val();
  socket.emit('Client-send-msg',contentMsgFromClient);
});

socket.on('Server-spread-msg-to-all-client',(userNameAndMessageFromServer)=>{
    $('#listMessages').append("<div class='msg'>"+userNameAndMessageFromServer.username+ ": " + userNameAndMessageFromServer.message +"</div>");
});


});