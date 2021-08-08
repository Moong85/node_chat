const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: ["http://localhost:8080","http://182.229.104.64:8080"],
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});
const session = require("express-session")({
    secret: "my-secret",
    resave: true,
    saveUninitialized: true
});
const sharedSession = require("express-socket.io-session");

io.use(sharedSession(session));

const connectionUserInfo = {};
const disconnect = {};
const rooms = [];
rooms.push("master");

io.on("connection", socket => {
    // either with send()
    socket.send("Welcome to the ChatTest!");

    // handle the event sent with socket.send()
    socket.on("chat", ( data ) => {
        console.log(data.user_name + ": " + data.message);
        io.sockets.in(rooms[0]).emit("chat", data);
    });

    socket.on("checkSession", ( id ) => {
        if ( connectionUserInfo[ id ] !== undefined ) {
            socket.emit("checkSession", {
                msg: "success",
                userInfo: connectionUserInfo[ id ]
            });
        } else {
            socket.emit("checkSession", {
                msg: "no session Login Try again",
                userInfo: false
            });
        }
    });
    socket.on("login", userData => {
        socket.join(rooms[0]);
        if ( connectionUserInfo[userData.id] !== undefined ) {
            io.sockets.in(rooms[0]).emit("joinUs", {
                message: userData.user_name + "님이 다시 접속 하셨습니다."
            });
            clearTimeout( disconnect[userData.id] );
            delete connectionUserInfo[userData.id];
        } else {
            io.sockets.in(rooms[0]).emit("joinUs", {
                message: userData.user_name + "님이 접속하셨습니다."
            });
        }
        connectionUserInfo[ socket.id ] = {
            id: socket.id,
            user_name: userData.user_name,
            login_datetime: new Date()
        };
        socket.emit("server", {
            msg: "room join ok. user Information",
            loginData: connectionUserInfo[ socket.id ]
        });
    });
    socket.on('logout', id => {
        io.sockets.in(rooms[0]).emit("joinUs",{
            message: connectionUserInfo[id].user_name + "님이 나가셨습니다."
        });
        delete connectionUserInfo[id];
    });
    socket.on('disconnect', user => {
        if ( connectionUserInfo[ socket.id ] === undefined ) return;
        disconnect[ socket.id ] = setTimeout(function () {
            io.sockets.in(rooms[0]).emit("joinUs",{
                message: connectionUserInfo[ socket.id ].user_name + "님이 연결시간이 초과되어 로그아웃 되었습니다."
            });
            delete  connectionUserInfo[ socket.id ];
        },1000*60*3);

        io.sockets.in(rooms[0]).emit("joinUs",{
            message: connectionUserInfo[ socket.id ].user_name + "님이 연결이 끊어졌습니다."
        });
    });
});

httpServer.listen(3000);