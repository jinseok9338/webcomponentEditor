import { calculateDistance } from "../../../utils/canvas";
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
      this.appContext.selectedElement &&
      this.isElementCanvas(this.appContext.selectedElement) &&
      this.isOutsideTheCanvas(
        this.appContext.closestElementWhileDragging as HTMLElement
      )
    ) {
      return;
    }
    if (
      this.appContext.closestBorder === "top" ||
      this.appContext.closestBorder === "left"
    ) {
      this.moveToTheFront();
    }
    if (
      this.appContext.closestBorder === "right" ||
      this.appContext.closestBorder === "bottom"
    ) {
      this.moveToTheBack();
    }
  }

  isElementCanvas(element: HTMLElement) {
    return element.id === "canvas";
  }

  isOutsideTheCanvas(element: HTMLElement): boolean {
    const canvas = document.getElementById("canvas");
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
        !this.isTheElemnetTheChildOfTheSelectedElement(
          element as HTMLElement
        ) &&
        !this.isOutsideTheCanvas(element as HTMLElement)
      ) {
        this.appContext.closestElementWhileDragging = element as HTMLElement;
        minDistance = 0;
        return;
      }

      const distance = calculateDistance(clientX, clientY, rect);
      if (distance < minDistance) {
        minDistance = distance;
        this.appContext.closestElementWhileDragging = element as HTMLElement;
      }
    });

    // Reset all borders for elements except the selected one
    elements.forEach((el) => {
      if (el !== this.appContext.selectedElement) {
        (el as HTMLElement).style.border = "";
      }
    });
    if (
      this.appContext.closestElementWhileDragging &&
      this.appContext.closestElementWhileDragging !==
        this.appContext.selectedElement &&
      minDistance <= 30
    ) {
      // now find the closest border of the selected element to the cursor
      const rect =
        this.appContext.closestElementWhileDragging.getBoundingClientRect();
      const distances = {
        left: Math.abs(rect.left - clientX),
        right: Math.abs(rect.right - clientX),
        top: Math.abs(rect.top - clientY),
        bottom: Math.abs(rect.bottom - clientY),
      } as const;
      const closestBorder = (
        Object.keys(distances) as Array<keyof typeof distances>
      ).reduce((a, b) => (distances[a] < distances[b] ? a : b), "left");

      this.markTheClosestBorder(closestBorder);
    }
  }

  markTheClosestBorder(closestBorder: "left" | "right" | "top" | "bottom") {
    switch (closestBorder) {
      case "left":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderLeft =
          "3px solid #7FFFD4";
        this.appContext.closestBorder = "left";
        break;
      case "right":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderRight =
          "3px solid #7FFFD4";

        this.appContext.closestBorder = "right";
        break;
      case "top":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderTop =
          "3px solid #7FFFD4";
        this.appContext.closestBorder = "top";
        break;
      case "bottom":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderBottom =
          "3px solid #7FFFD4";
        this.appContext.closestBorder = "bottom";
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
    const clonedSelectedElement = this.appContext.selectedElement.cloneNode(
      true
    ) as HTMLElement;
    clonedSelectedElement.style.boxShadow = "";
    if (this.appContext.closestElementWhileDragging.parentNode) {
      this.appContext.closestElementWhileDragging.parentNode.insertBefore(
        clonedSelectedElement,
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

    const clonedSelectedElement = this.appContext.selectedElement.cloneNode(
      true
    ) as HTMLElement;
    clonedSelectedElement.style.boxShadow = "";
    if (this.appContext.closestElementWhileDragging.parentNode) {
      this.appContext.closestElementWhileDragging.parentNode.insertBefore(
        clonedSelectedElement,
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

  isTheElemnetTheChildOfTheSelectedElement(element: HTMLElement): boolean {
    if (this.appContext.selectedElement === element) {
      return true;
    }
    const parentNode = element.parentNode as HTMLElement;
    if (parentNode) {
      return this.isTheElemnetTheChildOfTheSelectedElement(parentNode);
    }
    return false;
  }
}
