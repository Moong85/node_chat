import {ChatList} from "../../components/ChatList/ChatList";
import {ChatWriter} from "../../components/ChatWriter/ChatWriter";
import {AppInfos} from "../common";

const io = require("socket.io-client");

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
                    user_name: AppInfos.MY_DATA.user_name,
                    message: message
                });
            }
        );
        this.socket.on("server", data => {
            if ( data.loginData !== undefined ) {
                console.log("server > ", data)
                AppInfos.MY_DATA.user_name = data.loginData.user_name;
                AppInfos.MY_DATA.id = data.loginData.id;
                const date = new Date();
                date.setTime(date.getTime() + 60 * 60 * 24 * 1000);
                document.cookie = "id=" + AppInfos.MY_DATA.id + ";expires=" + date.toUTCString() + ';path=/';
            }
        });
        this.socket.on("chat", data => {
            if ( data.user_name !== AppInfos.MY_DATA.user_name ) {
                this.mainContaier.chatList.addMessage(ChatList.ITEM_TEMPLATE.ENEMY, data);
                document.title =  data.user_name + "님의 메시지 : " + data.message;
            }
            this.mainContaier.root.scrollTop = this.mainContaier.root.scrollHeight;
        });
        this.socket.on("joinUs", data => {
            this.mainContaier.chatList.addMessage(ChatList.ITEM_TEMPLATE.SYSTEM, data);
            console.log( data );
            new Notification("새로운 유저가 입장했습니다.", {body: data.message});
        });
    }
    login ( userData ) {
        this.socket.on("connect", () => {
            this.socket.send("Hello!");
        });
        this.socket.emit("login", userData );
        if (("Notification" in window)) {
            Notification.requestPermission().then(result => {
                if ( result === "denied" ) {
                    alert('알림을 차단하셨습니다.\n브라우저의 사이트 설정에서 변경하실 수 있습니다.');
                }
            });
        }
    }
}