var http = require("http");
var express = require("express");
//var createGzipStatic = require("connect-static");
var serveStatic = require('serve-static');
var yawl = require("yawl");
var fs = require("fs");

//var checkersGame = require("./checkers");

var games = {};
games['Checkers'] = require("./checkers");
games['Twilight Struggle'] = require("./twilight_struggle");
games['War of the Ring'] = require("./war_of_the_ring_lome");
games['Star Wars: Rebellion'] = require("./star_wars_rebellion");

function main() {
  // load previously saved serverdata
  fs.stat('serverdata.txt', function (err, stats) {
    if (err) return console.error("could not find serverdata.txt");
    if (!stats.isFile()) return;
    console.log("loading previously saved serverdata.txt");
    fs.readFile('serverdata.txt', function (err, data) {
      if (err) return console.error(err);
      var serverData = JSON.parse(data.toString());
      roomsById = serverData.rooms;
      usersById = serverData.users;
    });
  });

  var app = express();
//  createGzipStatic({dir:"public"}, function(err, middleware) {
//    if (err) throw err;
    app.use(serveStatic("public"));
    var httpServer = http.createServer(app);
    var webSocketServer = yawl.createServer({
      server: httpServer,
      allowTextMessages: true,
      maxFrameSize: 16 * 1024 * 1024, // 16 MB
      origin: null,
    });
    webSocketServer.on("error", function(err) {
      console.log("web socket server error:", err.stack);
    });
    webSocketServer.on("connection", function(socket) {
      handleNewSocket(socket);
    });
    httpServer.listen(25407, "127.0.0.1", function(err) {
      console.log("serving: http://127.0.0.1:25407/");
    });
//  });
}

var roomsById = {
  //"roomCode": {
  //  id: "roomCode",
  //  game: checkersGame,
  //  usersById: {
  //    "userId": {
  //      id: "userId",
  //      username: "Josh",
  //      role: "red",
  //      socket: socket,
  //    },
  //  },
  //  changeHistory: [
  //    message, ...
  //  ],
  //  unusedTimeoutHandle: null || setTimeout(),
  //},
};

var usersById = {
  //"username": {
  //  id: username
  //  password: hashed password
  //  socket: (null for not logged in)
  //}
};

function newRoom(gameName) {
  var room = {
    id: generateRoomCode(),
    game: games[gameName],
    usersById: {},
    changeHistory: [],
    unusedTimeoutHandle: null,
    log: "",
  };
  /*for (var i = 0; i < room.game.roles.length; i++) {
    room.rolePasswords[room.game.roles[i].id] = "";
  }*/
  roomsById[room.id] = room;
  return room;
}
var STALE_ROOM_TIMEOUT = 7*24*60*60*1000; // 7 days
function checkForNoUsers(room) {
  for (var id in room.usersById) {
    if (room.usersById.socket) return; // nevermind. it's not empty.
  }
  // No, Mr. Room. I expect you to die.
  room.unusedTimeoutHandle = setTimeout(function() {
    console.log("deleting stale room:", room.id);
    delete roomsById[room.id];
  }, STALE_ROOM_TIMEOUT);
}

/*function findAvailableRole(room) {
  for (var i = 0; i < room.game.roles.length; i++) {
    var roleId = room.game.roles[i].id;
    var used = false;
    for (var userId in room.usersById) {
      var user = room.usersById[userId];
      if (user.role === roleId) {
        used = true;
        break;
      }
    }
    if (!used) return roleId;
  }
  return ""; // spectator
}*/

function newUser(room, username, socket) {
//  var role = findAvailableRole(room);
  if (usersById[username].socket != socket) throw asdf; //trying to log in one user from another user's connection
  if (room.unusedTimeoutHandle != null) {
    // hold the phone. we've got someone interested after all.
    clearTimeout(room.unusedTimeoutHandle);
    room.unusedTimeoutHandle = null;
  }
  if (room.usersById[username]){
    room.usersById[username].socket = socket;
    return room.usersById[username];
  }
  var user = {
    id: username,
    username: username,
    role: "",
    socket: socket,
  };
  room.usersById[user.id] = user;
  return user;
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length === 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var CLIENT_STATE_DISCONNECTING = 0;
var CLIENT_STATE_WAITING_FOR_LOGIN = 1;
var CLIENT_STATE_WAITING_FOR_JOIN = 2;
var CLIENT_STATE_PLAY = 3;
function handleNewSocket(socket) {
  console.log("web socket connected");

  var clientState = CLIENT_STATE_WAITING_FOR_LOGIN;
  var room;
  var user;

  socket.on("textMessage", function(msg) {
    if (clientState === CLIENT_STATE_DISCONNECTING) return;
    console.log(msg);
    var allowedCommands = (function() {
      switch (clientState) {
        case CLIENT_STATE_WAITING_FOR_LOGIN:
          return ["login"];
        case CLIENT_STATE_WAITING_FOR_JOIN:
          return ["joinRoom", "backup"];
        case CLIENT_STATE_PLAY:
          return ["makeAMove", "changeMyName", "changeMyRole", "logMessage"];
        default: throw asdf;
      }
    })();
    var message = parseAndValidateMessage(msg, allowedCommands);
    if (message == null) return;

    switch (message.cmd) {
      case "login":
        var username = message.args.username;
        var password = message.args.password.toString().hashCode();
        if (message.args.create){
          if(message.args.code != "***password***") socket.sendText(JSON.stringify({cmd: "loginFailed", args:"Error: ask Scott for the code."}));
          else if(usersById[username]) socket.sendText(JSON.stringify({cmd: "loginFailed", args:"Error: username already exists."}));
          else{
            user = {id: username, password: password, socket: socket};
            usersById[username] = user;
            socket.sendText(JSON.stringify({cmd:"login", args:{username: username, gameList: {}}}));
            clientState = CLIENT_STATE_WAITING_FOR_JOIN;
          }
        } else {
          if (!usersById[username]) socket.sendText(JSON.stringify({cmd: "loginFailed", args:"Incorrect username or password."}));
          else if (usersById[username].password != password) socket.sendText(JSON.stringify({cmd: "loginFailed", args:"Incorrect username or password."}));
          else {
            usersById[username].socket = socket; // they're on this connection now
            user = usersById[username];
            var gameList = [];
            for (var r in roomsById) {
              if (username in roomsById[r].usersById){
                var players = {};
                for(var otherUser in roomsById[r].usersById) players[otherUser] = roomsById[r].usersById[otherUser].role;
                gameList.push({id: r,  gameName: roomsById[r].game.name, players: players});
              }
            }
            socket.sendText(JSON.stringify({cmd:"login", args:{username: username, gameList: gameList}}));
            clientState = CLIENT_STATE_WAITING_FOR_JOIN;
          }
        }
        break;
      case "joinRoom":
        var roomCode = message.args.roomCode;
        if (roomCode === "new") {
          room = newRoom(message.args.gameName);
          user = newUser(room, user.id, socket);
        } else {
          var possibleRoom = roomsById[roomCode];
          if (possibleRoom == null) {
            // sorry buddy
            sendMessage({cmd:"badRoomCode"});
            // goodbye
            //disconnect();
            return;
          }
          room = possibleRoom;
          user = newUser(room, user.id, socket);
        }
        var users = [];
        for (var id in room.usersById) {
          if (id === user.id) continue;
          var otherUser = room.usersById[id];
          users.push({
            id:       otherUser.id,
            username: otherUser.username,
            role:     otherUser.role,
            loggedIn: (otherUser.socket == null ? false : true),
          });
          // nice to meet you
          if (otherUser.socket == null) continue;
          otherUser.socket.sendText(JSON.stringify({cmd:"userJoined", args:{
            id:       user.id,
            username: user.username,
            role:     user.role,
            loggedIn: true,
          }}));
        }
        sendMessage({cmd:"joinRoom", args:{
          roomCode: room.id,
          userId:   user.id,
          username: user.username,
          role:     user.role,
          game:     room.game,
          history:  room.changeHistory,
          users:    users,
        }});
        clientState = CLIENT_STATE_PLAY;
        break;
      case "backup":
        console.log("backup");
        var roomsCleaned = {};
        for (var r in roomsById){
          roomsCleaned[r] = {id: roomsById[r].id, game: roomsById[r].game, usersById: {}, changeHistory: roomsById[r].changeHistory, unusedTimeOutHandle: null};
          for (var u in roomsById[r].usersById){
            roomsCleaned[r].usersById[u] = {id: roomsById[r].usersById[u].id, username: roomsById[r].usersById[u].username, role: roomsById[r].usersById[u].role, socket: null}
          }
        }
        var usersCleaned = {};
        for (var u in usersById) usersCleaned[u] = {id: usersById[u].id, password: usersById[u].password, socket: null};
        fs.writeFile('serverdata.txt', JSON.stringify({rooms: roomsCleaned, users: usersCleaned}));
        console.log(roomsById);
        console.log(usersById);
        socket.sendText("{\"cmd\":\"successfully backed up\"}");
        break;
      case "makeAMove":
        // change userID to be readable by humans joining later
        message.args[0] = room.usersById[message.args[0]].username + "(" + room.usersById[message.args[0]].role + ")";
        msg = JSON.stringify(message);
        for (var otherId in room.usersById) {
          if (otherId === user.id || room.usersById[otherId].socket == null) continue;
          room.usersById[otherId].socket.sendText(msg);
        }
        room.changeHistory.push(message.args);
        break;
      /*case "changeMyName":
        var newName = message.args;
        user.username = newName;
        for (var id in room.usersById) {
          if (id === user.id) continue;
          room.usersById[id].socket.sendText(JSON.stringify({cmd:"changeMyName", args:{
            id:       user.id,
            username: user.username,
          }}));
        }
        break;*/
      case "changeMyRole":
        var newRole = message.args.newRole;
        //var oldPassword = room.rolePasswords[newRole];
	//var password = message.args.password;
        if (newRole != "") { // check whether someone has already claimed this role
          for(var u in room.usersById){
            if(room.usersById[u].id != user.id && room.usersById[u].role == newRole) return;
          }
        }
        user.role = newRole;
        room.usersById[user.id].role = newRole; // does js use pointers well enough that this isn't needed?
        for (var id in room.usersById) {
          if(room.usersById[id].socket == null) continue;
          room.usersById[id].socket.sendText(JSON.stringify({cmd:"changeMyRole", args:{
            id:   user.id,
            role: user.role,
          }}));
        }
        break;
      case "logMessage":
        msg = JSON.stringify(message);
        for (var otherId in room.usersById) {
          if (otherId === user.id || room.usersById[id].socket == null) continue;
          room.usersById[otherId].socket.sendText(msg);
        }
        room.changeHistory.push(message.args);
        break;
      default: throw new Error("TODO: handle command: " + message.cmd);
    }
  });

  /*function disconnect() {
    // we initiate a disconnect
    socket.close();
    // and anticipate
    handleDisconnect();
  }*/
  socket.on('error', function(err) {
    console.log("web socket error:", err.stack);
    handleDisconnect();
  });
  socket.on('close', function() {
    console.log("web socket client disconnected");
    handleDisconnect();
  });
  var keepAliveHandle = setInterval(function() {
    try {
      socket.sendText("keepAlive");
    } catch (e) {}
  }, 10 * 1000);
  function handleDisconnect() {
    clientState = CLIENT_STATE_DISCONNECTING;
    if (room != null) {
      // see you guys later
      for (var id in room.usersById) {
        if (id === user.id) continue;
        var otherUser = room.usersById[id];
        if(otherUser.socket != null) otherUser.socket.sendText(JSON.stringify({cmd:"userLeft", args:{id: user.id}}));
      }
      room.usersById[user.id].socket = null;
      checkForNoUsers(room);
      room = null;
    }
    user = null;
    if (keepAliveHandle != null) {
      clearInterval(keepAliveHandle);
      keepAliveHandle = null;
    }
  }

  function sendMessage(message) {
    var msg = JSON.stringify(message);
    socket.sendText(msg);
  }

  function parseAndValidateMessage(msg, allowedCommands) {
    try {
      var message = JSON.parse(msg);
    } catch (e) {
      return failValidation(e);
    }
    // TODO: rethink validation so that it only protects the server, not other clients
    if (typeof message != "object") return failValidation("JSON root data type expected to be object");
    // ignore all unexpected fields.
    message = {
      cmd: message.cmd,
      args: message.args,
    };
    if (allowedCommands.indexOf(message.cmd) === -1) return failValidation("invalid command", message.cmd);
    switch (message.cmd) {
      case "createRoom":
        if (message.args != null) return failValidation("expected no args. got:", message.args);
        delete message.args;
        break;
      case "joinRoom":
        message.args = {
          roomCode: message.args.roomCode,
          gameName: message.args.gameName,
        };
        if (typeof message.args.roomCode !== "string") return failValidation("expected string:", message.args.roomCode);
        // although the room code might be bogus, that's a reasonable mistake, not a malfunction.
        break;
      case "makeAMove":
        var move = message.args;
        if (!Array.isArray(move)) return failValidation("expected args to be an array");
        break;
      case "changeMyName":
        var newName = message.args;
        if (typeof newName !== "string") return failValidation("expected string:", newName);
        if (newName.length > 16) newName = newName.substring(0, 16);
        if (newName.length === 0) return failValidation("new name is empty string");
        message.args = newName;
        break;
      case "changeMyRole":
        message.args = {
          newRole: message.args.newRole,
        }
        if (typeof message.args.newRole !== "string") return failValidation("expected string:", message.args.newRole);
        break;
      case "logMessage":
        var logMessage = message.args;
        if (typeof logMessage !== "string") return failValidation("expected string:", logMessage);
        if (logMessage.length === 0) return failValidation("message is empty string");
        break;
      case "login":
        var username = message.args.username;
        var password = message.args.password;
        if (typeof username !== "string") return failValidation("expected string:", username);
        if (typeof password !== "number") return failValidation("expected number:", password);
        break;
      case "backup":
        break;
      default: throw new Error("TODO: handle command: " + message.cmd);
    }

    // seems legit
    return message;

    function failValidation(blurb, offendingValue) {
      if (arguments.length >= 2) {
        if (typeof offendingValue === "string") {
          // make whitespace easier to see
          offendingValue = JSON.stringify(offendingValue);
        }
        console.log("message failed validation:", blurb, offendingValue);
      } else {
        console.log("message failed validation:", blurb);
      }
      return null;
    }
  }
}

var roomCodeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function generateRoomCode() {
  return generateFromAlphabet(5, roomCodeAlphabet);
}
var idAlphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
function generateUserId() {
  return generateFromAlphabet(8, idAlphabet);
}
function generateFromAlphabet(length, alphabet) {
  var result = "";
  for (var i = 0; i < length; i++) {
    var letter = alphabet[Math.floor(Math.random() * alphabet.length)];
    result += letter;
  }
  return result;
}

main();
