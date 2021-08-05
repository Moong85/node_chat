export class ChatList {
    static ITEM_TEMPLATE = {
        ENEMY: "enemy",
        MY: "my",
        SYSTEM: "system"
    }
    constructor( root ) {
        this.root = root;
    }
    addMessage( type, data ) {
        const chatItem = this.createTemplate( type );
        if ( data.user_name !== undefined ) {
            chatItem.querySelector("span.user-name").innerHTML = data.user_name;
        }
        if ( data.message !== undefined ) {
            chatItem.querySelector("span.message").innerHTML = data.message;
        }
        if ( chatItem.querySelector("span.time") !== null ) {
            chatItem.querySelector("span.time").innerHTML = String(new Date("HH:mm"));
        }
        this.root.append(chatItem);
    }
    createTemplate( type ) {
        if ( type === ChatList.ITEM_TEMPLATE.ENEMY || type === ChatList.ITEM_TEMPLATE.MY ) {
            const template = document.createElement("div");
            template.classList.add(type);
            if ( type === ChatList.ITEM_TEMPLATE.ENEMY ) {
                const profile = document.createElement("i");
                profile.classList.add("icon profile");
                template.append( profile );
            }
            const item = document.createElement("div");
            item.classList.add("item");
            const itemChild = {};
            if ( type === ChatList.ITEM_TEMPLATE.ENEMY ) {
                itemChild.userName = document.createElement("span");
                itemChild.userName.classList.add("user-name");
            }
            itemChild.message = document.createElement("span");
            itemChild.message.classList.add("message");
            itemChild.time = document.createElement("span");
            itemChild.time.classList.add("time");

            if ( type === ChatList.ITEM_TEMPLATE.ENEMY ) {
                item.append( itemChild.userName );
                item.append( itemChild.message );
                item.append( itemChild.time );
            } else {
                item.append( itemChild.time );
                item.append( itemChild.message );
            }
            template.append( item );
            return template;
        } else if ( type === ChatList.ITEM_TEMPLATE.SYSTEM ) {
            const template = document.createElement("div");
            template.classList.add(type);
            const message = document.createElement("span");
            message.classList.add("message");
            template.append( message );
            return template;
        }
    }
}