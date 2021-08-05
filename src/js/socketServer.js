const httpServer = require("http").createServer();
const io = require("socket.io")(httpServer, {
    cors: {
        origin: "http://localhost:8080",
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
const sharedsession = require("express-socket.io-session");

io.use(sharedsession(session));

const connectionUserInfo = {};

io.on("connection", socket => {
    // either with send()
    socket.send("Welcome to the ChatTest!");

    // handle the event sent with socket.send()
    socket.on("message", (data) => {
        console.log("message -> " + data);
    });

    socket.on("login", ( userData ) => {
        connectionUserInfo[ userData.name ] = userData;
        const user = connectionUserInfo[ userData.name ];
        socket.emit("message","Hello! " + user.name);
        socket.emit("joinUs", {
            message: user.name + "님이 접속하셨습니다."
        });
        console.log( connectionUserInfo );
    });
});

httpServer.listen(3000);