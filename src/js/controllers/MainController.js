import {ChatList} from "../../components/ChatList/ChatList";
import {ChatWriter} from "../../components/ChatWriter/ChatWriter";

const io = require("socket.io-client");

const my = {
    user_name: ""
}

export class MainController {
    constructor( connectIP ) {
        this.socket = io(connectIP);
        this.mainContaier = {
            root: document.querySelector("section.main-container"),
        };
        this.mainContaier.chatList = new ChatList( this.mainContaier.root.querySelector("div.chat-list") );
        this.mainContaier.chatWriter = new ChatWriter(
            this.mainContaier.root.querySelector("div.chat-writer"),
            ( message ) => {
                this.mainContaier.chatList.addMessage( ChatList.ITEM_TEMPLATE.MY, {
                    message: message
                });
                this.socket.emit("chat", {
                    user_name: my.user_name,
                    message: message
                });
            }
        );
        this.socket.on("server", data => {
            console.log( data );
        });
        this.socket.on("chat", data => {
            if ( data.user_name !== my.user_name ) {
                this.mainContaier.chatList.addMessage(ChatList.ITEM_TEMPLATE.ENEMY, data);
            }
        });
        this.socket.on("joinUs", data => {
            this.mainContaier.chatList.addMessage(ChatList.ITEM_TEMPLATE.SYSTEM, data);
        });
    }
    login ( name ) {
        my.user_name = name;
        this.socket.on("connect", () => {
            this.socket.send("Hello!");
            this.socket.emit("login", { name: name } );
        });
    }
}