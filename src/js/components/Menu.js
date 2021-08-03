export class Menu {
    constructor( root ) {
        this.root = root;
        this.buttonToggle = this.root.querySelector(".toggle");
        this.listRoot = this.root.querySelector("ul");

        this.buttonToggle.addEventListener("click", this.toggle);
    }
    create( template ) {
        this.listRoot.innerHTML = "";
        for ( let menuName in template ) {
            const menu = document.createElement("li");
            menu.dataset.target = menuName;
            menu.textContent = template[menuName].text;
            for ( let actionName in template[menuName].on ) {
                menu.addEventListener( actionName, template[menuName].on[actionName] );
            }
            this.listRoot.append( menu );
        }
    }
    toggle = () => {
        this.root.classList.toggle("open");
    }
}