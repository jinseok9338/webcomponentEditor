import { calculateDistance } from "../../../utils/canvas";
import { AppContext, getAppContext } from "../../context/AppContext";

export class SelectElementUtils {
  appContext: AppContext;
  constructor() {
    this.appContext = getAppContext();
  }

  /**
   * Event handler for click event.
   * @param {MouseEvent} event - The mouse event object.
   */
  selectElement(event: MouseEvent) {
    let clickedElement = event.target as HTMLElement;
    if (clickedElement.tagName === "IMG") {
      clickedElement = clickedElement.parentElement as HTMLElement;
    }

    // Reset the previous selected element's box shadow if exists
    if (this.appContext.selectedElement) {
      this.appContext.selectedElement.style.boxShadow = "";
      this.appContext.selectedElement.style.cursor = "";
    }

    // Set the new selected element and apply blue box shadow
    this.appContext.selectedElement = clickedElement;
    clickedElement.style.boxShadow = "0 0 0 2px #00f";
    clickedElement.style.cursor = "grab";
  }
}

/**
 * This class contains methods to locate the closest element while the cursor is not dragging.
 * which means the methods are not used when the cursor is in dragging mode.
 */
export class LocateClosestElementUtils {
  appContext: AppContext;
  constructor() {
    this.appContext = getAppContext();
  }

  findTheClosestElement(clientX: number, clientY: number) {
    // Get all elements inside the component
    const elements = this.appContext.querySelectorAll("*");

    let minDistance = Infinity;

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      // Check if the cursor is within the element's bounds
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        element.tagName !== "IMG"
      ) {
        this.appContext.closestElmentWitoutDragging = element as HTMLElement;
        minDistance = 0; // No need to calculate distance if cursor is inside the element
        return;
      }

      // If the cursor is outside, calculate the distance to the nearest edge
      const distance = calculateDistance(clientX, clientY, rect);
      if (distance < minDistance) {
        minDistance = distance;
        this.appContext.closestElmentWitoutDragging = element as HTMLElement;
      }
    });

    // Reset all borders for elements except the selected one
    elements.forEach((el) => {
      if (el !== this.appContext.selectedElement) {
        this.removeHighlightFromElement(el as HTMLElement);
      }
    });

    // Highlight the closest element with red box shadow, if it isn't the selected one
    if (
      this.appContext.closestElmentWitoutDragging &&
      this.appContext.closestElmentWitoutDragging !==
        this.appContext.selectedElement &&
      minDistance <= 30
    ) {
      this.applyMarginPaddingStyles(
        this.appContext.closestElmentWitoutDragging
      );
      this.highlightElementWithPseudo(
        this.appContext.closestElmentWitoutDragging
      );
    }
  }

  highlightElementWithPseudo(element: HTMLElement) {
    // Add the class that triggers the pseudo-element border
    element.classList.add("highlighted-element");
  }

  removeHighlightFromElement(element: HTMLElement) {
    // Remove the class that triggers the pseudo-element border
    element.classList.remove("highlighted-element");
  }

  applyMarginPaddingStyles(element: HTMLElement) {
    // Get computed styles for the element
    const style = window.getComputedStyle(element);

    // Set custom properties (CSS variables) for padding
    element.style.setProperty("--padding-top", style.paddingTop);
    element.style.setProperty("--padding-left", style.paddingLeft);
    element.style.setProperty("--padding-right", style.paddingRight);
    element.style.setProperty("--padding-bottom", style.paddingBottom);

    // Set custom properties (CSS variables) for margin
    element.style.setProperty("--margin-top", style.marginTop);
    element.style.setProperty("--margin-left", style.marginLeft);
    element.style.setProperty("--margin-right", style.marginRight);
    element.style.setProperty("--margin-bottom", style.marginBottom);
  }
}

// This class contains methods to find the closest border to which the selected element should move
// and contains methods to move the selected element
export class MoveUpSelectedElementUtils {
  appContext: AppContext;
  constructor() {
    this.appContext = getAppContext();
  }

  moveElement() {
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

  /**
   * Log the closest border of an element based on cursor position.
   * @param {number} clientX - The x-coordinate of the cursor.
   * @param {number} clientY - The y-coordinate of the cursor.

   */
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

      // Check if the cursor is within the element's bounds
      // if the element is the child element of the selected element then it is not the closest element
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        !this.isTheElemnetTheChildOfTheSelectedElement(element as HTMLElement)
      ) {
        this.appContext.closestElementWhileDragging = element as HTMLElement;
        minDistance = 0; // No need to calculate distance if cursor is inside the element
        return;
      }

      // If the cursor is outside, calculate the distance to the nearest edge

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
          "5px solid #7FFFD4";
        this.appContext.closestBorder = "left";
        break;
      case "right":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderRight =
          "5px solid #7FFFD4";

        this.appContext.closestBorder = "right";
        break;
      case "top":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderTop =
          "5px solid #7FFFD4";
        this.appContext.closestBorder = "top";
        break;
      case "bottom":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderBottom =
          "5px solid #7FFFD4";
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
    const clonedSelectedElement =
      this.appContext.selectedElement.cloneNode(true);
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

    const clonedSelectedElement =
      this.appContext.selectedElement.cloneNode(true);
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
