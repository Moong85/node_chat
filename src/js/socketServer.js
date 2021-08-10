const ENUM = {
    EV: {
        CONNECTION: "connection",
        CHAT: "chat",
        SESSTION: "checkSession",
        LOGIN: {
            CODE: "login",
            JOIN: {
                CODE: "join",
                REJOIN: "reJoin",
            },
            TIMEOUT: "timeout"
        },
        LOGOUT: "logout",
        DISCONNECTION: "disconnection",
        SERVER_MASSAGE: "server",

    }
}

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

io.on( ENUM.EV.CONNECTION, socket => {
    // either with send()
    socket.send("Welcome to the ChatTest!");

    // handle the event sent with socket.send()
    socket.on(ENUM.EV.CHAT, ( data ) => {
        console.log(data.user_name + ": " + data.message);
        io.sockets.in(rooms[0]).emit(ENUM.EV.CHAT, data);
    });

    socket.on(ENUM.EV.SESSTION, ( id ) => {
        console.log( connectionUserInfo, id );
        if ( connectionUserInfo[ id ] !== undefined ) {
            socket.emit(ENUM.EV.SESSTION, {
                msg: "success",
                userInfo: connectionUserInfo[ id ]
            });
        } else {
            socket.emit(ENUM.EV.SESSTION, {
                msg: "no session Login Try again",
                userInfo: false
            });
        }
    });
    socket.on(ENUM.EV.LOGIN.CODE, userData => {
        socket.join(rooms[0]);
        if ( connectionUserInfo[userData.id] !== undefined ) {
            io.sockets.in(rooms[0]).emit(ENUM.EV.LOGIN.JOIN.REJOIN, {
                user: userData.user_name,
                message: userData.user_name + "님이 다시 접속 하셨습니다."
            });
            clearTimeout( disconnect[userData.id] );
            delete connectionUserInfo[userData.id];
        } else {
            io.sockets.in(rooms[0]).emit(ENUM.EV.LOGIN.JOIN.CODE, {
                message: userData.user_name + "님이 접속하셨습니다."
            });
        }
        connectionUserInfo[ socket.id ] = {
            id: socket.id,
            user_name: userData.user_name,
            login_datetime: new Date()
        };
        socket.emit(ENUM.EV.SERVER_MASSAGE, {
            msg: "room join ok. user Information",
            loginData: connectionUserInfo[ socket.id ]
        });
    });
    socket.on(ENUM.EV.LOGOUT, id => {
        io.sockets.in(rooms[0]).emit(ENUM.EV.LOGOUT,{
            message: connectionUserInfo[id].user_name + "님이 나가셨습니다."
        });
        delete connectionUserInfo[id];
    });
    socket.on(ENUM.EV.DISCONNECTION, user => {
        if ( connectionUserInfo[ socket.id ] === undefined ) return;
        disconnect[ socket.id ] = setTimeout(function () {
            io.sockets.in(rooms[0]).emit(ENUM.EV.TIMEOUT,{
                message: connectionUserInfo[ socket.id ].user_name + "님이 연결시간이 초과되어 로그아웃 되었습니다."
            });
            delete  connectionUserInfo[ socket.id ];
        },1000*60*3);

        io.sockets.in(rooms[0]).emit(ENUM.EV.LOGOUT,{
            message: connectionUserInfo[ socket.id ].user_name + "님이 연결이 끊어졌습니다."
        });
    });
});

httpServer.listen(3000);