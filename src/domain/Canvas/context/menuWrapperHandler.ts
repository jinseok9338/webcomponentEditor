import {
  MENU_IMAGE_WRAPPER_ELEMENT,
  MENU_WRAPPER_ELEMENT,
  mimimalResizingSize,
} from "../../../utils/consts";
import { convertElementToHTMLElement, isElement } from "../../../utils/dom";
import { getElement } from "../../../utils/global";
import { AppContext, getAppContext } from "../../App/context/AppContext";
import { Points } from "../view/x-image-wrapper";

class MenuWrapperHandler {
  appContext: AppContext;

  constructor() {
    this.appContext = getAppContext();
  }
}

export class ImageWrapperHandler extends MenuWrapperHandler {
  constructor() {
    super();
  }

  handleMouseDown(event: MouseEvent) {
    const target = event.target;
    if (
      !this.isElementImageWrapperHandler(target) ||
      !this.appContext.selectedElement
    ) {
      throw new Error("The target is not an image wrapper or selected element");
    }
    this.appContext.menuWrapperState = {
      isInvoked: true,
      currentMenuWrapperHandlerId: target.id,
      original_mouseX: event.pageX,
      original_mouseY: event.pageY,
      original_x: this.appContext.selectedElement.getBoundingClientRect().left,
      original_y: this.appContext.selectedElement.getBoundingClientRect().top,
      original_width: parseFloat(
        getComputedStyle(this.appContext.selectedElement, null)
          .getPropertyValue("width")
          .replace("px", "")
      ),
      original_height: parseFloat(
        getComputedStyle(this.appContext.selectedElement, null)
          .getPropertyValue("height")
          .replace("px", "")
      ),
    };
  }

  handleMouseUp() {
    const currentState = this.appContext.storage.getItem();
    this.appContext.undoManager.addAction(currentState);
    const originalMenuWrapperState = this.appContext.menuWrapperState;
    this.appContext.menuWrapperState = {
      ...originalMenuWrapperState,
      isInvoked: false,
      currentMenuWrapperHandlerId: "",
    };
  }

  handleMouseMove(event: MouseEvent) {
    switch (this.appContext.menuWrapperState.currentMenuWrapperHandlerId) {
      case Points.TOP_LEFT:
        this.resizeTopLeft(event);
        break;
      case Points.TOP_RIGHT:
        this.resizeTopRight(event);
        break;
      case Points.BOTTOM_LEFT:
        this.resizeBottomLeft(event);
        break;
      case Points.BOTTOM_RIGHT:
        this.resizeBottomRight(event);
        break;
    }
  }

  resizeTopLeft(event: MouseEvent) {
    const selectedElementWrapper = getElement(MENU_WRAPPER_ELEMENT);
    const selectedElement = this.appContext.selectedElement;
    const selectedImageWrapper = getElement(MENU_IMAGE_WRAPPER_ELEMENT);
    if (!selectedElement || !selectedElementWrapper || !selectedImageWrapper)
      return;
    const selectedElementWrapperHTMLElement = convertElementToHTMLElement(
      selectedElementWrapper
    );
    const selectedImageWrapperHTMLElement =
      convertElementToHTMLElement(selectedImageWrapper);
    const {
      original_width,
      original_height,
      original_mouseX,
      original_mouseY,
    } = this.appContext.menuWrapperState;
    const width = original_width - (event.pageX - original_mouseX);
    const height = original_height - (event.pageY - original_mouseY);
    if (height > mimimalResizingSize) {
      selectedElement.style.height = height + "px";
      selectedImageWrapperHTMLElement.style.height = height + "px";
      selectedElementWrapperHTMLElement.style.height = height + "px";
    }
    if (width > mimimalResizingSize) {
      selectedImageWrapperHTMLElement.style.width = width + "px";
      selectedElementWrapperHTMLElement.style.width = width + "px";
      selectedElement.style.width = width + "px";
    }
  }

  resizeTopRight(event: MouseEvent) {
    const selectedElementWrapper = getElement(MENU_WRAPPER_ELEMENT);
    const selectedElement = this.appContext.selectedElement;
    const selectedImageWrapper = getElement(MENU_IMAGE_WRAPPER_ELEMENT);
    if (!selectedElement || !selectedElementWrapper || !selectedImageWrapper)
      return;
    const selectedElementWrapperHTMLElement = convertElementToHTMLElement(
      selectedElementWrapper
    );
    const selectedImageWrapperHTMLElement =
      convertElementToHTMLElement(selectedImageWrapper);
    const {
      original_width,
      original_height,
      original_mouseX,
      original_mouseY,
    } = this.appContext.menuWrapperState;
    const width = original_width + (event.pageX - original_mouseX);
    const height = original_height - (event.pageY - original_mouseY);
    if (height > mimimalResizingSize) {
      selectedElement.style.height = height + "px";
      selectedImageWrapperHTMLElement.style.height = height + "px";
      selectedElementWrapperHTMLElement.style.height = height + "px";
    }
    if (width > mimimalResizingSize) {
      selectedImageWrapperHTMLElement.style.width = width + "px";
      selectedElementWrapperHTMLElement.style.width = width + "px";
      selectedElement.style.width = width + "px";
    }
  }

  resizeBottomLeft(event: MouseEvent) {
    const selectedElementWrapper = getElement(MENU_WRAPPER_ELEMENT);
    const selectedElement = this.appContext.selectedElement;
    const selectedImageWrapper = getElement(MENU_IMAGE_WRAPPER_ELEMENT);
    if (!selectedElement || !selectedElementWrapper || !selectedImageWrapper)
      return;
    const selectedElementWrapperHTMLElement = convertElementToHTMLElement(
      selectedElementWrapper
    );
    const selectedImageWrapperHTMLElement =
      convertElementToHTMLElement(selectedImageWrapper);
    const {
      original_width,
      original_height,
      original_mouseX,
      original_mouseY,
    } = this.appContext.menuWrapperState;

    const height = original_height + (event.pageY - original_mouseY);
    const width = original_width - (event.pageX - original_mouseX);
    if (height > mimimalResizingSize) {
      selectedElement.style.height = height + "px";
      selectedImageWrapperHTMLElement.style.height = height + "px";
      selectedElementWrapperHTMLElement.style.height = height + "px";
    }
    if (width > mimimalResizingSize) {
      selectedImageWrapperHTMLElement.style.width = width + "px";
      selectedElementWrapperHTMLElement.style.width = width + "px";
      selectedElement.style.width = width + "px";
    }
  }

  resizeBottomRight(event: MouseEvent) {
    const selectedElementWrapper = getElement(MENU_WRAPPER_ELEMENT);
    const selectedElement = this.appContext.selectedElement;
    const selectedImageWrapper = getElement(MENU_IMAGE_WRAPPER_ELEMENT);
    if (!selectedElement || !selectedElementWrapper || !selectedImageWrapper)
      return;
    const selectedElementWrapperHTMLElement = convertElementToHTMLElement(
      selectedElementWrapper
    );
    const selectedImageWrapperHTMLElement =
      convertElementToHTMLElement(selectedImageWrapper);
    const {
      original_width,
      original_height,
      original_mouseX,
      original_mouseY,
    } = this.appContext.menuWrapperState;
    const width = original_width + (event.pageX - original_mouseX);
    const height = original_height + (event.pageY - original_mouseY);
    if (width > mimimalResizingSize) {
      selectedElementWrapperHTMLElement.style.width = width + "px";
      selectedElement.style.width = width + "px";
      selectedImageWrapperHTMLElement.style.width = width + "px";
    }
    if (height > mimimalResizingSize) {
      selectedElementWrapperHTMLElement.style.height = height + "px";
      selectedElement.style.height = height + "px";
      selectedImageWrapperHTMLElement.style.height = height + "px";
    }
  }

  isElementImageWrapperHandler(target: EventTarget | null): target is Element {
    return (
      isElement(target) &&
      (target.id === Points.BOTTOM_LEFT ||
        target.id === Points.BOTTOM_RIGHT ||
        target.id === Points.TOP_LEFT ||
        target.id === Points.TOP_RIGHT)
    );
  }
}
