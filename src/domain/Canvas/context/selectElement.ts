import {
  CANVAS,
  MENU_ELEMENT,
  MENU_WRAPPER_ELEMENT,
} from "../../../utils/consts";
import { convertNodeToHTMLElement, isElement } from "../../../utils/dom";
import { getElement } from "../../../utils/global";
import { AppContext, getAppContext } from "../../App/context/AppContext";

export class SelectElementUtils {
  appContext: AppContext;

  constructor() {
    this.appContext = getAppContext();
  }

  selectElementWithClick(event: MouseEvent) {
    let clickedElement = event.target;
    if (!isElement(clickedElement)) {
      return;
    }
    this.selectElement(clickedElement);
  }

  selectElement(element: Element) {
    // canvas 는 선택 할 수가 없다.
    if (this.isTheElementCanvas(element)) {
      return;
    }

    if (this.appContext.selectedElement) {
      this.removeMenuContainer();
    }

    const convertedClickedElement = convertNodeToHTMLElement(element);
    this.appContext.selectedElement = convertedClickedElement;
    const menuWrapper = document.createElement(MENU_WRAPPER_ELEMENT);
    const originalElementComputedStyle = getComputedStyle(
      convertedClickedElement
    );
    menuWrapper.style.width = originalElementComputedStyle.width;
    menuWrapper.style.height = originalElementComputedStyle.height;
    const menuElement = document.createElement(MENU_ELEMENT);
    menuWrapper.appendChild(menuElement);

    convertedClickedElement?.parentNode?.insertBefore(
      menuWrapper,
      convertedClickedElement
    );
    menuWrapper.appendChild(convertedClickedElement);
  }

  isTheElementCanvas(element: Element) {
    return element.id === CANVAS;
  }

  removeMenuContainer() {
    const menuContainer = getElement(MENU_WRAPPER_ELEMENT);
    const menus = getElement(MENU_ELEMENT);
    if (!menus) return;
    menuContainer?.removeChild(menus);
    const originalElement = menuContainer?.firstChild;
    if (!originalElement) return;
    menuContainer?.parentNode?.insertBefore(originalElement, menuContainer);
    menuContainer?.parentNode?.removeChild(menuContainer);
  }

  duplicateElement() {
    const element = this.appContext.selectedElement;
    if (!element) return;
    // menu wrapper 때문에 실제 parent 는 parent.parent 이다.
    const parentElement = element.parentElement?.parentElement;
    const duplicatedElement = element.cloneNode(true) as HTMLElement;
    parentElement?.appendChild(duplicatedElement);
  }

  removeElement() {
    // menu wrapper 때문에 실제 parent 는 parent.parent 이다.
    const element = this.appContext.selectedElement;
    if (!element) return;
    const parentElement = element.parentElement?.parentElement;
    const realElement = element.parentElement;
    if (!parentElement || !realElement) return;
    parentElement?.removeChild(realElement);
  }

  clearSelectedElement() {
    this.removeMenuContainer();
    this.appContext.selectedElement = null;
  }

  showMoreOptions() {
    // TODO: Show more options
  }
}
