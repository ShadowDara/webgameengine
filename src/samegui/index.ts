// HTML Overlay

import { hash } from "../utils/index.js";

type UIElement = {
  el: HTMLElement;
  type: "button" | "text";
};

export class HtmlUI {
  private root: HTMLDivElement;
  private panel: HTMLDivElement;

  private elements = new Map<number, UIElement>();
  private clicked = new Map<number, boolean>();
  private frameIds: number[] = [];

  constructor() {
    this.root = document.createElement("div");
    this.root.style.position = "absolute";
    this.root.style.inset = "0";
    this.root.style.pointerEvents = "none";
    document.body.appendChild(this.root);

    this.panel = document.createElement("div");
    this.panel.style.position = "absolute";
    this.panel.style.left = "20px";
    this.panel.style.top = "20px";
    this.panel.style.padding = "10px";
    this.panel.style.background = "rgba(30,30,30,0.9)";
    this.panel.style.color = "white";
    this.panel.style.pointerEvents = "auto";
    this.panel.style.borderRadius = "6px";

    this.root.appendChild(this.panel);
  }

  begin() {
    this.frameIds = [];
  }

  end() {
    // reset clicks AFTER frame
    for (const id of this.frameIds) {
      this.clicked.set(id, false);
    }
  }

  private getButton(id: number): HTMLButtonElement {
    let e = this.elements.get(id);

    if (!e) {
      const btn = document.createElement("button");
      btn.style.display = "block";
      btn.style.marginBottom = "6px";
      btn.style.width = "100%";
      btn.style.padding = "6px";
      btn.style.background = "#444";
      btn.style.color = "white";
      btn.style.border = "none";
      btn.style.cursor = "pointer";

      this.panel.appendChild(btn);

      e = { el: btn, type: "button" };
      this.elements.set(id, e);
    }

    return e.el as HTMLButtonElement;
  }

  button(label: string, idOverride?: string): boolean {
    const id = hash(idOverride ?? label);
    this.frameIds.push(id);

    const btn = this.getButton(id);

    btn.textContent = label;

    // wichtig: nur EIN handler (kein stacking!)
    btn.onclick = () => {
      this.clicked.set(id, true);
    };

    return this.clicked.get(id) === true;
  }

  text(label: string, idOverride?: string) {
    const id = hash(idOverride ?? label);
    this.frameIds.push(id);

    let e = this.elements.get(id);

    if (!e) {
      const div = document.createElement("div");
      div.style.marginBottom = "6px";
      this.panel.appendChild(div);

      e = { el: div, type: "text" };
      this.elements.set(id, e);
    }

    e.el.textContent = label;
  }
}
