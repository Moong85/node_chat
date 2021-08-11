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
                this.socket.emit(AppInfos.SOCKET.EV.CHAT, {
                    user_name: AppInfos.MY_DATA.user_name,
                    message: message
                });
            }
        );
        this.socket.on(AppInfos.SOCKET.EV.SERVER_MASSAGE, data => {
            if ( data.loginData !== undefined ) {
                console.log("SERVER_MASSAGE > ", data);
                AppInfos.MY_DATA.user_name = data.loginData.user_name;
                AppInfos.MY_DATA.id = data.loginData.id;
                const date = new Date();
                date.setTime(date.getTime() + 60 * 60 * 24 * 1000);
                document.cookie = "id=" + AppInfos.MY_DATA.id + ";expires=" + date.toUTCString() + ';path=/';
            }
        });
        this.socket.on(AppInfos.SOCKET.EV.CHAT, data => {
            if ( data.user_name !== AppInfos.MY_DATA.user_name ) {
                this.mainContaier.chatList.addMessage(ChatList.ITEM_TEMPLATE.ENEMY, data);
                document.title =  data.user_name + "님의 메시지 : " + data.message;
            }
            this.mainContaier.root.scrollTop = this.mainContaier.root.scrollHeight;
        });
        this.socket.on(AppInfos.SOCKET.EV.LOGIN.JOIN.CODE, data => {
            this.mainContaier.chatList.addMessage(ChatList.ITEM_TEMPLATE.SYSTEM, data);
            new Notification("새로운 유저가 입장했습니다.", {body: data.message});
        });
        this.socket.on(AppInfos.SOCKET.EV.LOGIN.JOIN.REJOIN, data => {
            this.mainContaier.chatList.addMessage(ChatList.ITEM_TEMPLATE.SYSTEM, data);
            new Notification( data.user + "님이 재입장했습니다.", {body: data.message});
        });
    }
    login ( userData ) {
        this.socket.on(AppInfos.SOCKET.EV.CONNECT, () => {
        });
        this.socket.emit(AppInfos.SOCKET.EV.LOGIN.CODE, userData );
        if (("Notification" in window)) {
            Notification.requestPermission().then( result => {
                if ( result === "denied" ) {
                    alert('알림을 차단하셨습니다.\n브라우저의 사이트 설정에서 변경하실 수 있습니다.');
                }
            });
        }
    }
}