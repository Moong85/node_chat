const io = require("socket.io")(3000, {
    cors: {
        origin: "http://localhost:8080",
        methods: ["GET", "POST"],
        allowedHeaders: ["my-custom-header"],
        credentials: true
    }
});

const connectionUserInfo = {};

io.on("connection", socket => {
    // either with send()
    socket.send("Welcome to the ChatTest!");

    // handle the event sent with socket.send()
    socket.on("message", (data) => {
        console.log("message -> " + data);
    });

    socket.on("userInfo", ( userData ) => {
        connectionUserInfo[ userData.name ] = userData;
        socket.emit("message","Hello! " + connectionUserInfo[userData.name].name);
        console.log( connectionUserInfo );
    });
});

// app.get("/", ( request, response ) => {
//    response.sendFile( __dirname + "/index.html" );
// });
//
// io.on("connection", ( socket ) => {
//     console.log("user Connection -> ", socket);
//     socket.on("chat message", (massage) => {
//         io.emit("chat message", massage);
//     });
//     socket.on("disconnect", () => {
//        console.log("user disconnected");
//     });
// });
//
// http.listen( 3000, () => {
//     console.log("Connected at 3000");
// });