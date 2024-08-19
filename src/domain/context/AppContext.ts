import { getElementInfo } from "../../utils/global";

export interface Boxvis {
  margin: {
    horizontal: HTMLElement;
    vertical: HTMLElement;
    inner: HTMLElement;
  };
  border: {
    horizontal: HTMLElement;
    vertical: HTMLElement;
    inner: HTMLElement;
  };
  padding: {
    horizontal: HTMLElement;
    vertical: HTMLElement;
    inner: HTMLElement;
  };
  box: {
    horizontal: HTMLElement;
    vertical: HTMLElement;
    inner: HTMLElement;
  };
  tooltip: HTMLElement;
}

export class AppContext extends HTMLElement {
  #selectedElement: HTMLElement | null = null; // Track the currently selected element
  #isDragging = false; // Track if the user is dragging an element
  #closestElementWhileDragging: HTMLElement | null = null;
  #closestElmentWitoutDragging: HTMLElement | null = null;
  #closestBorder: string | null = null;
  #isGuideLineVisible: boolean = false;
  #boxvis: Boxvis | null = null;
  #latestInfo: ReturnType<typeof getElementInfo> | null = null;
  #scrollTimeout: any = null;
  #scrollendDelay = 250;
  #query = {};

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
  get boxvis() {
    return this.#boxvis;
  }
  set boxvis(value: Boxvis | null) {
    this.#boxvis = value;
  }
  get latestInfo() {
    return this.#latestInfo;
  }
  set latestInfo(value: ReturnType<typeof getElementInfo> | null) {
    this.#latestInfo = value;
  }
  get scrollTimeout() {
    return this.#scrollTimeout;
  }
  set scrollTimeout(value: any) {
    this.#scrollTimeout = value;
  }
  get scrollendDelay() {
    return this.#scrollendDelay;
  }
  set scrollendDelay(value: number) {
    this.#scrollendDelay = value;
  }
  get query() {
    return this.#query;
  }
  set query(value: any) {
    this.#query = value;
  }
}

export const registerAppContext = () =>
  customElements.define("x-app-context", AppContext);

export const getAppContext = () =>
  document.querySelector("x-app-context") as AppContext;
