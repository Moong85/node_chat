import {ChatList} from "../../components/ChatList/ChatList";

const io = require("socket.io-client");

export class MainController {
    constructor( connectIP ) {
        this.socket = io(connectIP);
        this.mainContaier = {
            root: document.querySelector("section.main-container"),
        };
        this.mainContaier.chatList = new ChatList( this.mainContaier.root.querySelector("div.chat-list") );
        this.socket.on("message", data => {
            console.log(data);
        });
        this.socket.on("joinUs", data => {
            this.mainContaier.chatList.addMessage(ChatList.ITEM_TEMPLATE.SYSTEM, data);
        });
    }
    login ( name ) {
        this.socket.on("connect", () => {
            this.socket.send("Hello!");
            this.socket.emit("login", { name: name } );
        });
    }
}