import {
  MENU_CONTAINER,
  MENU_IMAGE_WRAPPER_ELEMENT,
  MENU_WRAPPER_ELEMENT,
} from "../../../utils/consts";
import { AppContext, getAppContext } from "../../App/context/AppContext";
import { ElementTagType } from "../context/type";

export class MenuWrapperComponent extends HTMLElement {
  appContext: AppContext;
  tagType: ElementTagType;

  constructor() {
    super();
    this.appContext = getAppContext();
    this.tagType = this.determineElementType();
  }

  connectedCallback() {
    this.id = MENU_CONTAINER;
    this.style.position = "relative";
    const selectedElement = this.appContext.selectedElement;
    if (!selectedElement) return;
    const originalElementComputedStyle = getComputedStyle(selectedElement);
    this.style.width = originalElementComputedStyle.width;
    this.style.height = originalElementComputedStyle.height;
    this.tagType = this.determineElementType();

    if (this.tagType === ElementTagType.IMG) {
      const imageWrapper = document.createElement(MENU_IMAGE_WRAPPER_ELEMENT);
      this.appendChild(imageWrapper);
    }
  }

  determineElementType(): ElementTagType {
    const element = this.appContext.selectedElement;
    if (!element) {
      throw new Error("element is not selected");
    }
    const elementTagName = element.tagName.toLowerCase();
    if (this.elementIsTagType(elementTagName)) {
      return elementTagName as ElementTagType;
    }
    throw new Error(
      "element is not tag type, curret elemet tag name is " + elementTagName
    );
  }

  private elementIsTagType(elementType: string): elementType is ElementTagType {
    if (elementType === "div" || elementType === "img" || elementType === "p") {
      return true;
    }
    return false;
  }
}

export const registerMenuWrapperComponent = () => {
  customElements.define(MENU_WRAPPER_ELEMENT, MenuWrapperComponent);
};
