import {
  calculateDistance,
  isElementMenuContainer,
  isElementParentMenuContainer,
} from "../../../utils/canvas";
import {
  CANVAS,
  CANVAS_ELEMENT,
  Direction,
  MENU_WRAPPER_ELEMENT,
  minimalDistanceToshow,
  targetBorderStyle,
} from "../../../utils/consts";
import { convertNodeToHTMLElement, isHTMLElement } from "../../../utils/dom";
import { getElement } from "../../../utils/global";
import { AppContext, getAppContext } from "../../App/context/AppContext";

export class MoveUpSelectedElementUtils {
  appContext: AppContext;
  constructor() {
    this.appContext = getAppContext();
  }

  moveElement() {
    // canvas 는 이동할 수 없다.
    // 옮기려는 타깃 엘리먼트가 canvas 밖에 있는경우 이동하지 않는다.
    if (
      !this.appContext.closestElementWhileDragging ||
      !this.appContext.selectedElement ||
      this.isElementCanvas(this.appContext.selectedElement) ||
      this.isOutsideTheCanvas(this.appContext.closestElementWhileDragging)
    ) {
      return;
    }
    if (
      this.appContext.closestBorder === Direction.TOP ||
      this.appContext.closestBorder === Direction.LEFT
    ) {
      const menuContainer = getElement(MENU_WRAPPER_ELEMENT);
      if (menuContainer) {
        menuContainer.remove();
      }
      this.moveToTheFront();
    }
    if (
      this.appContext.closestBorder === Direction.RIGHT ||
      this.appContext.closestBorder === Direction.BOTTOM
    ) {
      const menuContainer = getElement(MENU_WRAPPER_ELEMENT);
      if (menuContainer) {
        menuContainer.remove();
      }
      this.moveToTheBack();
    }
  }

  isElementCanvas(element: HTMLElement) {
    return element.id === CANVAS;
  }

  isOutsideTheCanvas(element: Element): boolean {
    const canvas = getElement(CANVAS_ELEMENT);
    if (!canvas) {
      console.warn("Canvas element not found");
      return false;
    }
    return element.contains(canvas);
  }

  findTheClosestBorderAndMarkIt(clientX: number, clientY: number) {
    // Get all elements inside the component
    const elements = this.appContext.querySelectorAll("*");

    let minDistance = Infinity;

    if (this.appContext.closestElementWhileDragging) {
      this.appContext.closestElementWhileDragging.style.boxShadow = "";
      this.appContext.closestBorder = null;
    }

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        !this.isTheElemnetTheChildOfTheSelectedElement(element) &&
        !this.isOutsideTheCanvas(element) &&
        // element should not be the menu
        !isElementMenuContainer(element) &&
        !isElementParentMenuContainer(element)
      ) {
        this.appContext.closestElementWhileDragging =
          convertNodeToHTMLElement(element);
        minDistance = 0;
        return;
      }

      const distance = calculateDistance(clientX, clientY, rect);
      if (distance < minDistance) {
        minDistance = distance;
        this.appContext.closestElementWhileDragging =
          convertNodeToHTMLElement(element);
      }
    });

    // Reset all borders for elements except the selected one
    elements.forEach((el) => {
      if (el !== this.appContext.selectedElement && isHTMLElement(el)) {
        el.style.border = "";
      }
    });
    if (
      this.appContext.closestElementWhileDragging &&
      this.appContext.closestElementWhileDragging !==
        this.appContext.selectedElement &&
      minDistance <= minimalDistanceToshow
    ) {
      const rect =
        this.appContext.closestElementWhileDragging.getBoundingClientRect();
      const distances: Record<Direction, number> = {
        left: Math.abs(rect.left - clientX),
        right: Math.abs(rect.right - clientX),
        top: Math.abs(rect.top - clientY),
        bottom: Math.abs(rect.bottom - clientY),
      } as const;
      const closestBorder = (
        Object.keys(distances) as Array<keyof typeof distances>
      ).reduce((a, b) => (distances[a] < distances[b] ? a : b), Direction.LEFT);

      this.markTheClosestBorder(closestBorder);
    }
  }

  markTheClosestBorder(closestBorder: Direction) {
    switch (closestBorder) {
      case Direction.LEFT:
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderLeft =
          targetBorderStyle;
        this.appContext.closestBorder = Direction.LEFT;
        break;
      case Direction.RIGHT:
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderRight =
          targetBorderStyle;

        this.appContext.closestBorder = Direction.RIGHT;
        break;
      case Direction.TOP:
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderTop =
          targetBorderStyle;
        this.appContext.closestBorder = Direction.TOP;
        break;
      case Direction.BOTTOM:
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderBottom =
          targetBorderStyle;
        this.appContext.closestBorder = Direction.BOTTOM;
    }
  }

  moveToTheFront() {
    if (
      !this.appContext.closestElementWhileDragging ||
      !this.appContext.selectedElement
    ) {
      return;
    }
    // 클론 한 엘리먼트의 boxShadow 제거
    const clonedSelectedElement =
      this.appContext.selectedElement.cloneNode(true);
    const clonedSelectedElementAsHTMLElement = convertNodeToHTMLElement(
      clonedSelectedElement
    );

    if (this.appContext.closestElementWhileDragging.parentNode) {
      this.appContext.closestElementWhileDragging.parentNode.insertBefore(
        clonedSelectedElementAsHTMLElement,
        this.appContext.closestElementWhileDragging
      );
    }

    // this selectedElemt's parentNode
    const parentNode = this.appContext.selectedElement.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.appContext.selectedElement);
    }

    this.appContext.selectedElement = null;
    this.appContext.closestElementWhileDragging = null;
  }

  moveToTheBack() {
    if (
      !this.appContext.closestElementWhileDragging ||
      !this.appContext.selectedElement
    ) {
      return;
    }

    const clonedSelectedElement =
      this.appContext.selectedElement.cloneNode(true);
    const clonedSelectedElementAsHTMLElement = convertNodeToHTMLElement(
      clonedSelectedElement
    );
    clonedSelectedElementAsHTMLElement.style.boxShadow = "";
    if (this.appContext.closestElementWhileDragging.parentNode) {
      this.appContext.closestElementWhileDragging.parentNode.insertBefore(
        clonedSelectedElementAsHTMLElement,
        this.appContext.closestElementWhileDragging.nextSibling
      );
    }
    // this selectedElemt's parentNode
    const parentNode = this.appContext.selectedElement.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.appContext.selectedElement);
    }

    this.appContext.selectedElement = null;
    this.appContext.closestElementWhileDragging = null;
  }

  isTheElemnetTheChildOfTheSelectedElement(
    element: Element | ParentNode
  ): boolean {
    if (this.appContext.selectedElement === element) {
      return true;
    }
    const parentNode = element.parentNode;
    if (parentNode) {
      return this.isTheElemnetTheChildOfTheSelectedElement(parentNode);
    }
    return false;
  }
}
