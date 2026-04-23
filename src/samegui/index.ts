// HTML Overlay
import { hash } from "../utils/index.js";

type UIState = {
    container: HTMLDivElement;
    cursorY: number;
};

export class HtmlUI {
    private root: HTMLDivElement;
    private state: UIState;

    private idCounter = 0;
    private clickedMap = new Map<number, boolean>();

    constructor() {
        this.root = document.createElement("div");
        this.root.style.position = "absolute";
        this.root.style.top = "0";
        this.root.style.left = "0";
        this.root.style.width = "100%";
        this.root.style.height = "100%";
        this.root.style.pointerEvents = "none";

        document.body.appendChild(this.root);

        this.state = {
            container: this.createPanel(20, 20),
            cursorY: 10
        };
    }

    private createPanel(x: number, y: number) {
        const panel = document.createElement("div");
        panel.style.position = "absolute";
        panel.style.left = x + "px";
        panel.style.top = y + "px";
        panel.style.background = "rgba(30,30,30,0.9)";
        panel.style.border = "1px solid #555";
        panel.style.padding = "10px";
        panel.style.borderRadius = "6px";
        panel.style.pointerEvents = "auto";
        panel.style.color = "white";
        panel.style.fontFamily = "sans-serif";
        panel.style.minWidth = "150px";

        this.root.appendChild(panel);
        return panel;
    }

    begin() {
        this.state.container.innerHTML = "";
        this.state.cursorY = 10;
        this.idCounter = 0;
    }

    text(label: string) {
        const el = document.createElement("div");
        el.textContent = label;
        el.style.marginBottom = "6px";

        this.state.container.appendChild(el);
    }

    button(label: string, idOverride?: string): boolean {
        const key = idOverride ?? label;
        const id = hash(key);

        const wasClicked = this.clickedMap.get(id) || false;
        this.clickedMap.set(id, false);

        const btn = document.createElement("button");
        btn.textContent = label;

        btn.style.display = "block";
        btn.style.marginBottom = "6px";
        btn.style.width = "100%";
        btn.style.padding = "6px";
        btn.style.background = "#444";
        btn.style.border = "none";
        btn.style.color = "white";
        btn.style.cursor = "pointer";

        btn.onclick = () => {
            this.clickedMap.set(id, true);
        };

        this.state.container.appendChild(btn);

        return wasClicked;
    }

    checkbox(label: string, value: boolean): boolean {
        const wrapper = document.createElement("label");
        wrapper.style.display = "block";
        wrapper.style.marginBottom = "6px";

        const input = document.createElement("input");
        input.type = "checkbox";
        input.checked = value;

        wrapper.appendChild(input);
        wrapper.append(" " + label);

        this.state.container.appendChild(wrapper);

        return input.checked;
    }
}
