import {
  MENU,
  MENU_DELETE,
  MENU_DRAG,
  MENU_DUPLICATE,
  MENU_ELEMENT,
  MENU_GO_UP,
  MENU_MORE,
} from "../../../utils/consts";
import { getElement } from "../../../utils/global";
import { AppContext, getAppContext } from "../../App/context/AppContext";
import { SelectElementUtils } from "../context/selectElement";

const buttonIds = [
  MENU_GO_UP,
  MENU_DRAG,
  MENU_DUPLICATE,
  MENU_DELETE,
  MENU_MORE,
] as const;

export class MenuComponent extends HTMLElement {
  appContext: AppContext = getAppContext();
  selectElementUtils: SelectElementUtils = new SelectElementUtils();

  connectedCallback() {
    const existingMenu = getElement(MENU_ELEMENT);
    if (existingMenu) {
      existingMenu.replaceChildren();
    }

    this.id = MENU;
    this.style.position = "absolute";
    this.style.top = "0";
    this.style.right = "0";
    this.style.transformOrigin = "right bottom";
    this.style.transform = "translate(0px, -100%)";
    this.style.padding = "9px 0px";

    // Create the container div inside the outermost div
    const containerDiv = document.createElement("div");
    containerDiv.style.backgroundColor = "#1e3a8a";
    containerDiv.style.color = "#fff";
    containerDiv.style.overflow = "hidden";
    containerDiv.style.boxShadow = "0 4px 30px rgba(0,0,0,0.1)";
    containerDiv.style.borderRadius = "4px";

    // Create the flex container inside the container div
    const flexContainer = document.createElement("div");
    flexContainer.style.display = "flex";
    flexContainer.style.flexWrap = "nowrap";
    flexContainer.style.justifyContent = "space-between";
    flexContainer.style.alignItems = "center";

    // Button icons and IDs
    const buttonIcons = [
      "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",
      "M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z",
      "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",
      "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",
      "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
    ];

    // Create and append buttons
    buttonIcons.forEach((iconPath, index) => {
      const buttonDiv = document.createElement("div");
      buttonDiv.style.display = "flex";
      const button = document.createElement("div");
      const buttonId = buttonIds[index];
      button.id = buttonId;
      this.attachEvent(buttonId, button);
      button.style.padding = "3px";
      button.style.display = "flex";
      button.style.justifyContent = "center";
      button.style.alignItems = "center";
      button.style.backgroundColor = "#fff";
      button.style.border = "none";
      button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
      button.style.cursor = "pointer";
      button.style.color = "#fff";
      button.style.backgroundColor = "lightblue";

      const svgDiv = document.createElement("div");
      svgDiv.style.width = "12px";
      svgDiv.style.height = "12px";
      svgDiv.style.display = "flex";
      svgDiv.style.justifyContent = "center";
      svgDiv.style.alignItems = "center";
      svgDiv.style.pointerEvents = "none";

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 24 24");

      const path = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      path.setAttribute("fill", "currentColor");
      path.setAttribute("d", iconPath);

      svg.appendChild(path);
      svgDiv.appendChild(svg);
      button.appendChild(svgDiv);
      buttonDiv.appendChild(button);
      flexContainer.appendChild(buttonDiv);
    });

    // Append flex container to container div
    containerDiv.appendChild(flexContainer);

    // Append container div to the outermost div
    this.appendChild(containerDiv);
  }

  moveUpTheTree() {
    const selectedElement = this.appContext.selectedElement;

    if (!selectedElement) return;
    const parentElement = selectedElement.parentElement?.parentElement;
    if (!parentElement) return;
    this.selectElementUtils.selectElement(parentElement);
  }

  duplicateTheElement() {
    this.selectElementUtils.duplicateElement();
  }

  removeTheElement() {
    this.selectElementUtils.removeElement();
  }

  showMoreOptions() {
    this.selectElementUtils.showMoreOptions();
  }

  attachEvent(buttonId: (typeof buttonIds)[number], button: HTMLElement) {
    switch (buttonId) {
      case MENU_GO_UP:
        button.addEventListener("click", this.moveUpTheTree.bind(this));
        break;
      case MENU_DRAG:
        // drag 는 canvas move event 에서 처리한다.
        break;
      case MENU_DUPLICATE:
        button.addEventListener("click", this.duplicateTheElement.bind(this));
        break;
      case MENU_DELETE:
        button.addEventListener("click", this.removeTheElement.bind(this));
        break;
      case MENU_MORE:
        button.addEventListener("click", this.showMoreOptions.bind(this));
        break;
    }
  }
}

export const registerMenuComponent = () => {
  customElements.define(MENU_ELEMENT, MenuComponent);
};
