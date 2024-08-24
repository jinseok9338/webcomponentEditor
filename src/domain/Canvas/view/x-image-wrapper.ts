import {
  IMAGE_WRAPPER,
  MENU_IMAGE_WRAPPER_ELEMENT,
  imageWrapperPointSize,
  imageWrapperSideColor,
} from "../../../utils/consts";
import { AppContext, getAppContext } from "../../App/context/AppContext";

export const Sides = {
  TOP: "top-side",
  BOTTOM: "bottom-side",
  LEFT: "left-side",
  RIGHT: "right-side",
};

export const Points = {
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
};

export const Cursors = {
  TOP_LEFT: "nwse-resize",
  TOP_RIGHT: "nesw-resize",
  BOTTOM_LEFT: "nesw-resize",
  BOTTOM_RIGHT: "nwse-resize",
  TOP: "ns-resize",
  BOTTOM: "ns-resize",
  LEFT: "ew-resize",
  RIGHT: "ew-resize",
};

export class MenuImageWrapperComponent extends HTMLElement {
  appContext: AppContext;

  constructor() {
    super();
    this.appContext = getAppContext();
  }

  appendTopRight() {
    const topRight = document.createElement("div");
    topRight.id = Points.TOP_RIGHT;
    topRight.style.height = imageWrapperPointSize;
    topRight.style.width = imageWrapperPointSize;
    topRight.style.borderRadius = "100%";
    topRight.style.backgroundColor = "white";
    topRight.style.border = `2px solid ${imageWrapperSideColor}`;
    topRight.style.position = "absolute";
    topRight.style.top = "-4px";
    topRight.style.right = "-4px";
    topRight.style.zIndex = "2";
    topRight.style.cursor = Cursors.TOP_RIGHT;
    this.appendChild(topRight);
  }

  appendTopLeft() {
    const topLeft = document.createElement("div");
    topLeft.id = Points.TOP_LEFT;
    topLeft.style.height = imageWrapperPointSize;
    topLeft.style.width = imageWrapperPointSize;
    topLeft.style.borderRadius = "100%";
    topLeft.style.backgroundColor = "white";
    topLeft.style.border = `2px solid ${imageWrapperSideColor}`;
    topLeft.style.position = "absolute";
    topLeft.style.top = "-4px";
    topLeft.style.left = "-4px";
    topLeft.style.zIndex = "2";
    topLeft.style.cursor = Cursors.TOP_LEFT;
    this.appendChild(topLeft);
  }

  appendBottomLeft() {
    const bottomLeft = document.createElement("div");
    bottomLeft.id = Points.BOTTOM_LEFT;
    bottomLeft.style.height = imageWrapperPointSize;
    bottomLeft.style.width = imageWrapperPointSize;
    bottomLeft.style.borderRadius = "100%";
    bottomLeft.style.backgroundColor = "white";
    bottomLeft.style.border = `2px solid ${imageWrapperSideColor}`;
    bottomLeft.style.position = "absolute";
    bottomLeft.style.bottom = "-4px";
    bottomLeft.style.left = "-4px";
    bottomLeft.style.zIndex = "2";
    bottomLeft.style.cursor = Cursors.BOTTOM_LEFT;
    this.appendChild(bottomLeft);
  }

  appendBottomRight() {
    const bottomRight = document.createElement("div");
    bottomRight.id = Points.BOTTOM_RIGHT;
    bottomRight.style.height = imageWrapperPointSize;
    bottomRight.style.width = imageWrapperPointSize;
    bottomRight.style.borderRadius = "100%";
    bottomRight.style.backgroundColor = "white";
    bottomRight.style.border = `2px solid ${imageWrapperSideColor}`;
    bottomRight.style.position = "absolute";
    bottomRight.style.bottom = "-4px";
    bottomRight.style.right = "-4px";
    bottomRight.style.zIndex = "2";
    bottomRight.style.cursor = Cursors.BOTTOM_RIGHT;
    this.appendChild(bottomRight);
  }

  appendFourPointer() {
    this.appendTopLeft();
    this.appendTopRight();
    this.appendBottomLeft();
    this.appendBottomRight();
  }

  connectedCallback() {
    this.id = IMAGE_WRAPPER;
    this.style.position = "absoulte";
    this.style.top = "0";
    this.style.left = "0";
    const selectedElement = this.appContext.selectedElement;
    if (!selectedElement) return;
    const originalElementComputedStyle = getComputedStyle(selectedElement);
    this.style.width = originalElementComputedStyle.width;
    this.style.height = originalElementComputedStyle.height;
    this.appendFourPointer();
  }
}

export const registerMenuImageWrapperComponent = () => {
  customElements.define(MENU_IMAGE_WRAPPER_ELEMENT, MenuImageWrapperComponent);
};
