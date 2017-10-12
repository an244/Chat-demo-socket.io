const socket = io("http://localhost:3000");

$(document).ready(()=>{
    $('#loginForm').show();
    $('#chatForm').hide();

    $('#btnLogin').click(()=>{       
        const userNameFromLogin = $('#txtUserName').val();
        socket.emit('Client-send-UserName',userNameFromLogin);
        $('#txtUserName').val('');    
    });


socket.on('Server-send-Duplicate-user-Login-Fail',(userNameFromLogin)=>{
    alert(userNameFromLogin +' is existed already. Choose another one!');
});

socket.on('Server-send-Login-successful',(newUser)=>{
    $('#loginForm').hide();
    $('#chatForm').show();
    $('#currentUser').html(newUser);
});    
});