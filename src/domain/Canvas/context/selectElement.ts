import { CANVAS, MENU, MENU_CONTAINER } from "../../../utils/consts";
import { AppContext, getAppContext } from "../../App/context/AppContext";

function createMenuElement() {
  // Create the outermost div
  const menuDiv = document.createElement("div");
  menuDiv.id = MENU;
  menuDiv.style.position = "absolute";
  menuDiv.style.top = "0";
  menuDiv.style.right = "0";
  menuDiv.style.transformOrigin = "right bottom";
  menuDiv.style.transform = "translate(0px, -100%)";
  menuDiv.style.padding = "9px 0px";

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

  // Create the buttons inside the flex container
  const buttonIcons = [
    "M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z",
    "M13,6V11H18V7.75L22.25,12L18,16.25V13H13V18H16.25L12,22.25L7.75,18H11V13H6V16.25L1.75,12L6,7.75V11H11V6H7.75L12,1.75L16.25,6H13Z",
    "M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z",
    "M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z",
    "M12,16A2,2 0 0,1 14,18A2,2 0 0,1 12,20A2,2 0 0,1 10,18A2,2 0 0,1 12,16M12,10A2,2 0 0,1 14,12A2,2 0 0,1 12,14A2,2 0 0,1 10,12A2,2 0 0,1 12,10M12,4A2,2 0 0,1 14,6A2,2 0 0,1 12,8A2,2 0 0,1 10,6A2,2 0 0,1 12,4Z",
  ];

  buttonIcons.forEach((iconPath) => {
    const buttonDiv = document.createElement("div");
    buttonDiv.style.display = "flex";
    buttonDiv.style.gap = "3px";

    const button = document.createElement("button");
    button.style.padding = "3px";
    button.style.display = "flex";
    button.style.justifyContent = "center";
    button.style.alignItems = "center";
    button.style.backgroundColor = "#fff";
    button.style.border = "none";

    button.style.width = "fit-content";
    button.style.height = "fit-content";
    button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    button.style.cursor = "pointer";
    button.style.color = "#fff";
    button.style.backgroundColor = "lightblue";

    const svgDiv = document.createElement("div");
    svgDiv.style.width = "12px";
    svgDiv.style.height = "12px";

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
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
  menuDiv.appendChild(containerDiv);

  return menuDiv as HTMLElement;
}

// Call the function to create and append the element to the DOM
createMenuElement();

export class SelectElementUtils {
  appContext: AppContext;
  menuElement: HTMLElement;
  constructor() {
    this.appContext = getAppContext();
    this.menuElement = createMenuElement();
  }

  /**
   * Event handler for click event.
   * @param {MouseEvent} event - The mouse event object.
   */
  selectElement(event: MouseEvent) {
    let clickedElement = event.target as HTMLElement;
    // canvas 는 선택 할 수가 없다.
    if (this.isTheElementCanvas(clickedElement)) {
      return;
    }

    if (this.appContext.selectedElement) {
      this.removeMenuContainer();
    }

    this.appContext.selectedElement = clickedElement;
    const menuWrapper = document.createElement("div");
    menuWrapper.id = MENU_CONTAINER;
    menuWrapper.style.position = "relative";
    const originalElementComputedStyle = getComputedStyle(clickedElement);
    menuWrapper.style.width = originalElementComputedStyle.width;
    menuWrapper.style.height = originalElementComputedStyle.height;
    menuWrapper.appendChild(this.menuElement);

    clickedElement?.parentNode?.insertBefore(menuWrapper, clickedElement);
    menuWrapper.appendChild(clickedElement);
  }

  isTheElementCanvas(element: HTMLElement) {
    return element.id === CANVAS;
  }

  removeMenuContainer() {
    const menuContainer = document.getElementById(MENU_CONTAINER);
    const menus = menuContainer?.firstChild;
    menuContainer?.removeChild(menus as HTMLElement);
    const originalElement = menuContainer?.firstChild;
    menuContainer?.parentNode?.insertBefore(
      originalElement as HTMLElement,
      menuContainer
    );
    menuContainer?.parentNode?.removeChild(menuContainer);
  }

  clearSelectedElement() {
    this.removeMenuContainer();
    this.appContext.selectedElement = null;
  }
}
