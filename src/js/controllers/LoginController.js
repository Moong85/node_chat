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
    }

    login () {
        if ( this.inputUserName.value === "" ) {
            this.inputUserName.focus();
            this.textErrorScreen.innerHTML = "이름을 입력해주세요.";
            this.textErrorScreen.style.display = "block";
            return false;
        } else {
            AppInfos.WEB_DATAS.socketServer = new MainController("ws://127.0.0.1:3000");
            AppInfos.PAGES.INTRO.classList.add("close");
            this.disabled = true;
            this.inputUserName.disabled = true;
            AppInfos.WEB_DATAS.socketServer.login( this.inputUserName.value );
        }
    }

    logout () {
        //TODO: Logout Actions
        console.log("logout!!");
    }
}