
// const socket = io("ws://127.0.0.1:3000");
//
// socket.on("connect", () => {
//     // either with send()
//     socket.send("Hello!");
//
//     socket.emit("userInfo", { name: "test01", age: "33", gender: "man" } );
// });
//
// // handle the event sent with socket.send()
// socket.on("message", data => {
//     console.log(data);
// });
const io = require("socket.io-client");

class ChatList {
    constructor( root ) {
        this.root = root;
    }
    add( type ) {

    }
    createTemplate() {

    }
}

export class MainController {
    constructor( connectIP ) {
        this.socket = io(connectIP);
        this.mainContaier = {
            root: document.querySelector("section.main-container"),
        };
        this.mainContaier.list = new ChatList( this.mainContaier.root.querySelector("div.list") );
        this.socket.on("message", data => {
            console.log(data);
        });
        this.socket.on("joinUs", data => {

        });
    }
    login ( name ) {
        this.socket.on("connect", () => {
            this.socket.send("Hello!");
            this.socket.emit("login", { name: name } );
        });
    }
}