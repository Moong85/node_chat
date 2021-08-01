const PAGES = {};
const WEB_STATE = {};
document.addEventListener("DOMContentLoaded", function () {
    const sections = document.getElementsByTagName("section");
    PAGES.INTRO = sections[0];
    PAGES.MAIN = sections[1];
    WEB_STATE.CURRENT_PAGE = PAGES.INTRO;

    //

    PAGES.INTRO.classList.add("close");
    // intro - Login Actions
    const btn_login = document.getElementsByClassName("submit")[0];
    btn_login.addEventListener("click", function () {
        const userName = document.querySelector(".question.who-are-you input");
        const error = document.querySelector(".question.who-are-you .error");
        if ( userName.value === "" ) {
            userName.focus();
            error.innerHTML = "이름을 입력해주세요."
            error.style.display = "block";
            return;
        } else {
            PAGES.INTRO.classList.add("close");
            this.disabled = true;
            userName.disabled = true;
        }
    });
});