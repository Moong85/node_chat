import {ChatList} from "../ChatList/ChatList";

export class ChatWriter {
    constructor( root, fn_chatAction) {
        this.root = root;
        this.message = this.root.querySelector("input.message");
        this.send = this.root.querySelector("button.send");

        const _this = this;
        this.message.addEventListener("keypress", function (event) {
           if ( event.keyCode === 13 ) {
               _this.send.click();
           }
        });

        this.send.addEventListener("click", function () {
            if ( _this.message.value === "" ) return;
            fn_chatAction( _this.message.value );
            _this.message.value = "";
        });
    }

}