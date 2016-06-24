function isDefined(val) { return val != null; }

var ToggleDisplay = React.createClass({

	propTypes: {
		visible: React.PropTypes.bool,
	},

	shouldvisible: function() {
		var shouldvisible;
		if(isDefined(this.props.visible)) {
			shouldvisible = this.props.visible;
		}
		else {
			shouldvisible = false;
		}

		return shouldvisible;		
	},

	render: function() {
		var style = {};
		
		if(this.shouldvisible()) {
			style.display = 'none';
		}

		return (
			<span style={style} {...this.props} />
		);
	}

});


var CurrentUser = React.createClass({
	render: function() {
		return (<div>Вы вошли как: {this.props.user} </div>);
	}
});

var Friendslist = React.createClass({
    render: function(){
		var i=0;
		var output = this.props.friendList.map(function(friend) {
            return (
		<option className="friendpoint" key={i++}>{friend}</option>);
        });
        return <select name="friends" size='15' id="friendslist" onChange={this.props.friendClick}>{output}</select>;
    }
}); 

var MessageList = React.createClass({
    render: function() {
		var i=0;
        var messageComponents = this.props.messagesRooms.map(function(message) {
            return (
                <div className="messageBig" key={i++}><hr />
                    <div className='messageR' key={i++}>{message.author}</div>
                    <div className='messageR2' key={i++}>{message.dateTime}</div><br/>
                    <div className='messageR1' key={i++}>{message.messageText}</div>
                </div>);
            });
        return <div>{messageComponents}</div>;
    }
});

var App = React.createClass({
     getInitialState: function() {
        return {
            LoginVisible: true,
			visible: true,
			FriendsVisible: false,
			chatVisible:false,
			username: 'not logged in',
			userpass:'',
			usernameR:'',
			userpassR:'',
			Friend:'',
			Message:'',
			friendList: [''],
			messagesRooms:[{
				author: '',
				messageText: '',
				dateTime: ''
			}]
        };
    },
    
    handleClick: function() {
        this.setState({ LoginVisible: !this.state.visible,
			visible: !this.state.visible});
    },
	handleClickLog: function() {
		login(this.state.username,this.state.userPass,this.loginReceived);
		  
	},
	Changelog: function() {
		this.setState({ username: document.getElementById("login").value});		  
	},
	Changepas: function(){
		this.setState({userPass:document.getElementById("pass").value});
	},
	ChangelogR: function() {
		this.setState({ usernameR: document.getElementById("loginR").value});		  
	},
	ChangepasR: function(){
		this.setState({userPassR:document.getElementById("passR").value});
	},
	ChangeFriend: function(){
		document.getElementById('friends_list').value = document.getElementById('friendslist').value;
		this.setState({Friend:document.getElementById("friends_list").value});
	},
	ChangeFriendManual: function(){
		this.setState({Friend:document.getElementById("friends_list").value});
	},
	loginReceived: function(LoginUser,ListofFriend) {
		this.setState({ LoginVisible: false, visible:true,FriendsVisible: true, friendList: ListofFriend});
						
	},
	handleClickRegest: function() {
		this.setState({ LoginVisible: !this.state.visible,visible: !this.state.visible});
		regUsr(this.state.usernameR,this.state.userPassR);
    },
	handleClickAddFriend: function() {
        addfriend(this.state.Friend);
		getFriendsList(this.FriendReceived); 
    },
	FriendReceived: function(listoffriends) {
		this.setState({friendList: listoffriends});
	},  
	handleClickCrtRoom: function() {
        CrtRoom(this.state.Friend);
		this.setState({ chatVisible:true});
		roomGetMeassges(this.MessageReceived);
    },
	MessageReceived: function(messages) {
		this.setState({messagesRooms: messages});
	}, 
	roomSendMeassges: function() {
		roomSendMeassges(this.state.Message);
		document.getElementById("msgR").value='';		
	},
	ChangeMessage: function(){
		this.setState({Message:document.getElementById("msgR").value});
	},
	Exit: function() {
		location.reload();
	},
	
    render: function() {
        return (
            <div>
				<div className="content">
				<ToggleDisplay visible={!this.state.FriendsVisible}>
					<div  className="loginN" >
						<CurrentUser user={this.state.username} />
						<div className="exit" onClick={this.Exit} >Выйти</div>
					</div>
					<div className="Friends" >
						Друзья<br />
						<input id="friends_list" type="text" size="16" onChange={this.ChangeFriendManual}/><br/>
						<Friendslist friendList={this.state.friendList} friendClick={this.ChangeFriend}/>
						<br />
						<input className="button" type="button" value="Добавить в друзья" onClick={this.handleClickAddFriend} /><br />
						<input className="button" type="button" value="Создать чат" onClick={this.handleClickCrtRoom} />
					</div>
				</ToggleDisplay>
				<ToggleDisplay visible={!this.state.chatVisible}>
					<div className="formaL">
						<center><div id="chatW"></div></center>
						<div id="roomContent">
							<MessageList messagesRooms={this.state.messagesRooms}/>
						</div>
						<br/><center>
						<input type="text" size="35" id="msgR" placeholder="Введите сообщение..." onChange={this.ChangeMessage}  />
						<button  className="button" onClick={this.roomSendMeassges} id="sendR" >Отправить</button>
						</center>
					</div> 
				</ToggleDisplay>
				</div>	
				<div className="Vhod">
					<ToggleDisplay visible={!this.state.LoginVisible}>
						Вход<br/>
						Логин<input  type="text" size="20" required id="login" onChange={this.Changelog}/><br/>
						Пароль<input  type="password" size="20" required id="pass" onChange={this.Changepas} /><br/>
						<input className="button" type="button" value="Войти" onClick={this.handleClickLog} /><br/>
						<input className="button" type="button" value="Зарегестрироваться" onClick={this.handleClick} />
					</ToggleDisplay>
					<ToggleDisplay visible={this.state.visible}>
						Регестрация<br/>
						Логин<input  id="loginR" type="text" size="20" required onChange={this.ChangelogR}/><br/>
						Пароль<input  id="passR" type="password" size="20" required	onChange={this.ChangepasR}/><br/>
						<input className="button" type="button" value="Зарегестрироваться" onClick={this.handleClickRegest} /><br/>
						<input className="button" type="button" value="<-Назад" onClick={this.handleClick} />
					</ToggleDisplay>
				</div>
					
		    </div>
        );
    }
});
 
ReactDOM.render(<App />, document.getElementById('chat')); 





