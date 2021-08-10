import {AppInfos} from "../common";
import {MainController} from "./MainController";

export class LoginController {
    constructor( button_login, button_logout, input_user_name, text_error_screen ) {
        // else Elements
        this.inputUserName = input_user_name;
        this.textErrorScreen = text_error_screen;
        // login
        this.buttonLogin = button_login;
        this.buttonLogin.addEventListener("click", () => {
            this.login();
        });
        this.inputUserName.addEventListener("keyup", event => {
            if ( event.keyCode === 13 ) {
                this.login();
            }
        });

        // logout
        if (button_logout !== undefined && button_logout !== null) {
            this.buttonLogout = button_logout;
            this.buttonLogout.addEventListener("click", () => {
                this.logout();
            });
        }
        const cookie = document.cookie.split("=")[1];
        if ( cookie ) {
            this.initSocket( cookie );
        }
    }

    login () {
        if ( this.inputUserName.value === "" ) {
            this.inputUserName.focus();
            this.textErrorScreen.innerHTML = "이름을 입력해주세요.";
            this.textErrorScreen.style.display = "block";
            return false;
        } else {
            this.initSocket();
            this.inputUserName.disabled = true;
        }
    }

    initSocket ( cookie ) {
        AppInfos.WEB_DATAS.socketServer = new MainController("ws://" + SERVER_IP + ":" + SOCKET_PORT);
        if ( cookie ) {
            console.log( cookie );
            AppInfos.WEB_DATAS.socketServer.socket.emit(AppInfos.SOCKET.EV.SESSTION, cookie);
            AppInfos.WEB_DATAS.socketServer.socket.on(AppInfos.SOCKET.EV.SESSTION, result => {
                if ( result.userInfo ) {
                    AppInfos.MY_DATA.id = result.userInfo.id;
                    AppInfos.MY_DATA.user_name = result.userInfo.user_name;
                    AppInfos.WEB_DATAS.socketServer.login( AppInfos.MY_DATA );
                    AppInfos.PAGES.INTRO.classList.add("close");
                } else {
                    console.warn(result.msg);
                }
            });
        } else {
            AppInfos.WEB_DATAS.socketServer.login( {
                user_name: this.inputUserName.value
            });
            AppInfos.PAGES.INTRO.classList.add("close");
        }
    }

    logout () {
        AppInfos.WEB_DATAS.socketServer.socket.emit(AppInfos.SOCKET.EV.LOGOUT, AppInfos.MY_DATA.id);
        document.cookie = "id=" + AppInfos.MY_DATA.id + ";expires=" + new Date().toUTCString() + ';path=/';
        AppInfos.PAGES.INTRO.classList.remove("close");
        this.inputUserName.disabled = false;
    }
}