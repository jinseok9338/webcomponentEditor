export class AppContext extends HTMLElement {
  #selectedElement: HTMLElement | null = null; // Track the currently selected element
  #isDragging = false; // Track if the user is dragging an element
  #closestElementWhileDragging: HTMLElement | null = null;
  #closestElmentWitoutDragging: HTMLElement | null = null;
  #closestBorder: string | null = null;
  #isGuideLineVisible: boolean = false;

  get selectedElement() {
    return this.#selectedElement;
  }
  set selectedElement(value: HTMLElement | null) {
    this.#selectedElement = value;
  }

  get isDragging() {
    return this.#isDragging;
  }
  set isDragging(value: boolean) {
    this.#isDragging = value;
  }

  get closestElementWhileDragging() {
    return this.#closestElementWhileDragging;
  }
  set closestElementWhileDragging(value: HTMLElement | null) {
    this.#closestElementWhileDragging = value;
  }

  get closestElmentWitoutDragging() {
    return this.#closestElmentWitoutDragging;
  }
  set closestElmentWitoutDragging(value: HTMLElement | null) {
    this.#closestElmentWitoutDragging = value;
  }

  get closestBorder() {
    return this.#closestBorder;
  }
  set closestBorder(value: string | null) {
    this.#closestBorder = value;
  }

  get isGuideLineVisible() {
    return this.#isGuideLineVisible;
  }
  set isGuideLineVisible(value: boolean) {
    this.#isGuideLineVisible = value;
  }
}

export const registerAppContext = () =>
  customElements.define("x-app-context", AppContext);

export const getAppContext = () =>
  document.querySelector("x-app-context") as AppContext;
