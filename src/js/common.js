const socket = io("ws://127.0.0.1:3000");

socket.on("connect", () => {
    // either with send()
    socket.send("Hello!");

    socket.emit("userInfo", { name: "test01", age: "33", gender: "man" } );
});

// handle the event sent with socket.send()
socket.on("message", data => {
    console.log(data);
});