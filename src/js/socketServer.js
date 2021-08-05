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

    socket.on("login", ( userData ) => {
        console.log( "new User Join > " + userData.name + " - " + socket.id );
        userData.id = socket.id;
        connectionUserInfo[ socket.id ] = userData;
        const user = connectionUserInfo[ socket.id ];
        socket.join(rooms[0]);
        io.sockets.in(rooms[0]).emit("joinUs",{
            message: user.name + "님이 접속하셨습니다."
        });
        socket.emit("server", {
            msg: "room join ok. user Information",
            loginData: user
        });
    });
    socket.on('disconnect', () => {
        io.sockets.in(rooms[0]).emit("joinUs",{
            message: connectionUserInfo[ socket.id ].name + "님이 나가셨습니다."
        });
    });
});

httpServer.listen(3000);