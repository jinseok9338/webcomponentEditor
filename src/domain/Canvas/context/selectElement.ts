import { AppContext, getAppContext } from "../../App/context/AppContext";

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
    // canvas 는 선택 할 수가 없다.
    if (this.isTheElementCanvas(clickedElement)) {
      return;
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

  isTheElementCanvas(element: HTMLElement) {
    return element.id === "canvas";
  }

  clearSelectedElement() {
    if (this.appContext.selectedElement) {
      this.appContext.selectedElement.style.boxShadow = "";
      this.appContext.selectedElement.style.cursor = "";
    }
    this.appContext.selectedElement = null;
  }
}
