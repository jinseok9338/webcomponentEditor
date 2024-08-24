import {
  CANVAS,
  CANVAS_ELEMENT,
  MENU_ELEMENT,
  MENU_IMAGE_WRAPPER_ELEMENT,
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
    if (!menuContainer) return;
    const menus = getElement(MENU_ELEMENT);
    const menuImageWrapper = getElement(MENU_IMAGE_WRAPPER_ELEMENT);
    if (!menus) return;
    menuContainer.removeChild(menus);
    if (menuImageWrapper) {
      menuContainer.removeChild(menuImageWrapper);
    }
    const originalElement = menuContainer?.firstChild;
    if (!originalElement) return;
    menuContainer.parentNode?.insertBefore(originalElement, menuContainer);
    menuContainer.parentNode?.removeChild(menuContainer);
  }

  duplicateElement() {
    const element = this.appContext.selectedElement;
    if (!element) return;
    this.clearSelectedElement();
    const parentElement = element.parentElement;
    const duplicatedElement = element.cloneNode(true) as HTMLElement;
    parentElement?.insertBefore(duplicatedElement, element);
    const CanvasElement = getElement(CANVAS_ELEMENT);
    if (!CanvasElement) return;
    this.appContext.storage.updateItem(CanvasElement.innerHTML);
    this.selectElement(element);
  }

  removeElement() {
    const element = this.appContext.selectedElement;
    if (!element) return;
    this.clearSelectedElement();
    const parentElement = element.parentElement;
    if (!parentElement || !element) return;
    parentElement?.removeChild(element);
    const CanvasElement = getElement(CANVAS_ELEMENT);
    if (!CanvasElement) return;
    this.appContext.storage.updateItem(CanvasElement.innerHTML);
  }

  clearSelectedElement() {
    this.removeMenuContainer();
    this.appContext.selectedElement = null;
  }

  showMoreOptions() {
    // TODO: Show more options
  }
}
