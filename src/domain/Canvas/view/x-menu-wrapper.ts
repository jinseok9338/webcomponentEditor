import { MENU_CONTAINER, MENU_WRAPPER_ELEMENT } from "../../../utils/consts";

export class MenuWrapperComponent extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.id = MENU_CONTAINER;
    this.style.position = "relative";
  }
}

export const registerMenuWrapperComponent = () => {
  customElements.define(MENU_WRAPPER_ELEMENT, MenuWrapperComponent);
};
