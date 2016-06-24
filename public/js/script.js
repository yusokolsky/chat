var User;

function ajaxReq(url, data, callback){
	$.ajax({
        url: url,
        type: 'POST',
        contentType:'application/json',
        data: JSON.stringify(data),
        dataType:'json'
    }).done(callback);
}

function regUsr(username,userPass) {
	if (username!='' && userPass!=''){
		var UsrCreate = {
			UsrLogin: username,
			UsrPass: userPass
		}	
		ajaxReq("/registration/", UsrCreate, function(error) {
            if (error){
				alert("Имя пользователя уже сущестувет ")
			}
        });

	}
}

function login(username,userPass,callback) {
		var Login = {
			UsrLogin: username,
			UsrPass: userPass
		}
		ajaxReq("/login/", Login, function(usersfriends)  {
			User=Login.UsrLogin;
			if(callback)
				callback(User,usersfriends);
		});
}

function addfriend(Friend) {
	if (User!=Friend){
		var addfriendU = {
			friendSend:Friend,
			User:User
		};
		ajaxReq("/addfriend/", addfriendU, function(){})
	}

}
	
function getFriendsList(callback) {
		ajaxReq("/getFriendsList/", {username: User}, function(usersfriends){
			callback(usersfriends);
		})
}
	
var roomid;
var roomMessageInterval;

function CrtRoom(Friend) {
	if (User!=Friend && Friend!=""){
		var RoomCreate = {
			Usr1: User,
			Usr2: Friend
		}	
		ajaxReq("/room/", RoomCreate, function(){})
		JoinRoom(Friend);
	}
	else alert('choose friend')
}

function roomSendMeassges(msg){
	if (msg!=''){
		var date = new Date();
		var time = date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
		var messageDataRoom = {
			room: roomid,
			author: User,
			messageText: msg,
			dateTime: time
		};
		 ajaxReq("/roomsendmessage/", messageDataRoom, function(){})
	}
}

 function JoinRoom(Friend) {
	clearInterval(roomMessageInterval);
	$.post( 'http://localhost:3000/getrooms/', {}).done(function(req1) {
		for (var z=0;z<req1.length;z++){
			var rom=req1[z];
			roomid=rom.participants;
			usr1=rom.participants[0];
			usr2=rom.participants[1];
			if ((usr1==User && usr2==Friend) || (usr2==User && usr1==Friend)){
				document.getElementById("chatW").innerHTML='Chat with '+usr1+' & '+usr2;
                roomGetMeassges();
				break;
			}	
		}
	});	
}
/* 
function AddtoRoom() {
	if (User!=document.getElementById("friends_list").value && document.getElementById("friends_list").value!=""){
		var RoomCreate = {
			Usr1: User,
			Usr2: document.getElementById("friends_list").value
		}	
		$.ajax({
			url: "/room/",
			type: 'POST',
			contentType:'application/json',
			data: JSON.stringify(RoomCreate),
			dataType:'json'
		});
		JoinRoom();
	}
	else alert('choose friend')
} */

function roomGetMeassges(callback) {
    var prevmsgroom;
	roomMessageInterval = setInterval(function(){  
		ajaxReq("/roomGetMeassges/", roomid, function(reqRoom){
			if (prevmsgroom != reqRoom) {
				prevmsgroom = reqRoom;
				if (callback) 
					callback(reqRoom)
				setTimeout(messagesup(), 1000);
			}
		})
   }, 1000);
}
function messagesup(){
	document.getElementById('roomContent').scrollTop = 99999999
}


