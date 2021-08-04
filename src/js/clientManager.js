import {AppInfos} from "./common";
import {Menu} from "../components/Menu/Menu";
import {MainController} from "./controllers/MainController";
import {LoginController} from "./controllers/LoginController";

document.addEventListener("DOMContentLoaded", function () {
    // login Settings
    const loginController = new LoginController(
        document.getElementsByClassName("submit")[0],
        null,
        document.querySelector(".question.who-are-you input"),
        document.querySelector(".question.who-are-you .error")
    );
    // Pages Settings
    const sections = document.getElementsByTagName("section");
    AppInfos.PAGES.INTRO = sections[0];
    AppInfos.PAGES.MAIN = sections[1];
    AppInfos.WEB_STATE.CURRENT_PAGE = AppInfos.PAGES.INTRO;
    // Menu Settings
    const menu = new Menu( document.querySelector("body > div.menu") );
    menu.create({
        makeChat: {
          text: "Make.Chat",
          on: {
              click: () => {

              }
          }
        },
        logout: {
            text: "Logout",
            on: {
                click: () => {
                    loginController.logout();
                }
            }
        }
    });

    // test
    //AppInfos.PAGES.INTRO.classList.add("close");
});