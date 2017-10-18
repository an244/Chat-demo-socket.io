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

//Bước 4.1: client gửi nội dung chat của user lên server khi click nút 'Send'
$('#btnSendMessage').click(()=>{
    //lấy nội dung từ textbox chat
    const contentMsgFromClient = $('#txtMessage').val();
    //gửi nội dung chat lên server
  socket.emit('Client-send-msg',contentMsgFromClient);
  $('#txtMessage').empty();
});

//Bước 4.3: client lắng nghe dữ liệu "tên người chat + nội dung chat" gửi từ server.
socket.on('Server-spread-msg-to-all-client',(userNameAndMessageFromServer)=>{
    //sau đó thêm nội dụng chat vô khung chat.
    $('#listMessages').append("<div class='msg'>"+userNameAndMessageFromServer.username+ ": " + userNameAndMessageFromServer.message +"</div>");
    $('#txtMessage').empty();
});

//Bước 5.1.1: client bắt sự kiện user trỏ chuột vào ô nhập liêu chat
$('#txtMessage').focusin(()=>{
    //gửi lên server sự kiện user gõ phím
    socket.emit('Client-user-is-typing');
});

//Bước 5.1.4: client lắng nghe sự kiện gõ phím đáp trả từ server
socket.on('Server-respond-user-is-typing',(userNameSocket)=>{
    $('#chattingStatus').append("<div class='chatting'>"+userNameSocket+" is typing");
});

//Bước 5.2.1: client bắt sự kiện user RỜI trỏ chuột khỏi ô nhập liêu chat
$('#txtMessage').focusout(()=>{
    //gửi lên server sự kiện user STOP gõ phím
    socket.emit('Client-user-stop-typing');
});

//Bước 5.2.4: client lắng nghe sự kiện STOP gõ phím đáp trả từ server
socket.on('Server-respond-user-stop-typing',(userNameSocket)=>{
    $('#chattingStatus').clear();
});
});