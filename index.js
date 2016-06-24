var express = require('express');
var messages = []; 
var users = [];
var rooms = []
var app = express();
var fs = require('fs');
var contents;
var React = require('react');
var ReactDOM = require('react-dom');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.set('port', process.env.PORT || 3000);
var jsonfile = require('jsonfile')
app.post('/getmessages', function(req, res) {
	res.json(messages);
});

app.post('/sendmessage/', function(req, res) {
	console.log('new message: ' +req.body.sender+":" +req.body.messageText);
	var a=req.body.sender+":"+req.body.messageText;
	messages.push(a);
	fs.writeFile('messages',messages);
	res.end();
});

	
app.post('/roomSendMessage', function(req, res) {
	for (var i=0;i<rooms.length;i++){
		if ((rooms[i].participants[0] == req.body.room[0]) && (rooms[i].participants[1] == req.body.room[1])){
			rooms[i].messages.push({
				author :req.body.author,
				messageText:req.body.messageText,
				dateTime:req.body.dateTime 
			})
			jsonfile.writeFile('rooms', rooms)	  
		}
	}
	res.end();
});

app.post('/getrooms/', function(req, res) {
	res.json(rooms);
});

app.post('/roomGetMeassges/', function(req, res) {
	var roomid=req.body;
	for (var i=0;i<rooms.length;i++){
		var alroomid =(rooms[i].participants[0]+rooms[i].participants[1]);
		if (alroomid==roomid[0]+roomid[1]){
			res.json(rooms[i].messages);
		}
	}
	
});	

	
app.post('/room/', function(req, res) {
	var newRoom = true;
	var messages =[];
	for (var i=0;i<users.length;i++){
		if (req.body.Usr1==users[i].Login){
			for (var j=0;j<users[i].friends.length;j++){
					if (users[i].friends[j]==req.body.Usr2){
						for (var x=0;x<rooms.length;x++){
							var alroomid =(rooms[x].participants[0]+rooms[x].participants[1]);
							if (alroomid==(req.body.Usr1+req.body.Usr2) || alroomid==(req.body.Usr2+req.body.Usr1)){
								newRoom=false;
								break;
							}
						}
						if (newRoom){
							rooms.push({
								participants :[req.body.Usr1,req.body.Usr2],
								messages: messages
							});
							console.log('new room for user : ' + req.body.Usr1 + ' and user '+ req.body.Usr2);
						}
						else console.log('room '+alroomid+' already exist');
					}
				}
			}
		
	}
	
	res.end();
});

app.post('/addfriend/', function(req, res) {
	var findFriend=req.body.friendSend;
	var addfriend =true;
	for (var i=0;i<users.length;i++){
		if (findFriend==users[i].Login){
			addfriend =true;
			for (var j=0;j<users[i].friends.length;j++){
				if (users[i].friends[j]==req.body.User){
					addfriend=false;
					console.log("already exist")
					break;
				}
			}
			if (addfriend){
				users[i].friends.push(req.body.User);
				console.log("dobavlatmiy")
				console.log(req.body.User)
				break;
			}
		}else{addfriend=false;}
	}
	if (addfriend){
		for (var j=0;j<users.length;j++){
			if (req.body.User==users[j].Login){
				users[j].friends.push(findFriend);
				console.log("dobavisvshiy")
				console.log(findFriend)
				jsonfile.writeFile('UserList', users)
			}
		}
	}
	console.log(users);
	res.json();
	
});	
	
app.post('/registration/', function(req, res) {
	var newuser = true;
	var friends =[];
	for (var i=0;i<users.length;i++){
		if (users[i].Login==(req.body.UsrLogin)){
			newuser=false;
			var error =true;
			res.json(error);
			break;
		}
	}
	if (newuser){
		users.push({
			Login :req.body.UsrLogin,
			Password:req.body.UsrPass,
			friends: friends,
		});
		console.log('new user : ' + req.body.UsrLogin);
		jsonfile.writeFile('UserList', users)
	}
	else console.log(' user already exist '+ req.body.UsrLogin );
	console.log(users );
	res.end();
});

app.post('/login/', function(req, res) {
	var Login = true;
	for (var i=0;i<users.length;i++){
		if (users[i].Login==(req.body.UsrLogin) && users[i].Password==(req.body.UsrPass)){
			var error =false;
			console.log("user enter " + users[i].Login);
			Login= false;
			res.json(users[i].friends);
			break;
		}
	}
	/* if (Login){
		var error =true;
			res.json(error);
	} */
	res.end();
});

app.post('/getFriendsList/', function(req, res) {
	console.log(req.body.username)
	 for (var i=0;i<users.length;i++){
		if (users[i].Login==(req.body.username) ){
			res.json(users[i].friends);
			break;
		}
	} 
});
	
app.listen(app.get('port'), function(){
	fs.readFile('messages', 'utf8', function(err, contents) {
	messages= contents.split(',');});
	jsonfile.readFile('UserList', function(err, obj) {users=obj})
	jsonfile.readFile('rooms', function(err, obj) {rooms=obj})
    console.log('Express started on http://localhost:' + app.get('port') + ' press Ctrl-C to terminate');
});