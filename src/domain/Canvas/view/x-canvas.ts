import {
  isElementParentIsMenu,
  isElementMenu,
  isElementMenuContainer,
  isElementParentIsMenuGrabButton,
  isElementMenuGrabButton,
} from "../../../utils/canvas";
import {
  CANVAS_ELEMENT,
  MENU_DELETE,
  MENU_DUPLICATE,
  MENU_GO_UP,
  MENU_MORE,
} from "../../../utils/consts";
import { isElement, isHTMLElement } from "../../../utils/dom";
import { getElementInfo } from "../../../utils/global";
import { AppContext, getAppContext } from "../../App/context/AppContext";
import { LocateClosestElementUtils } from "../context/elementDebugger";
import { MoveUpSelectedElementUtils } from "../context/moveElement";

import { SelectElementUtils } from "../context/selectElement";

export class CanvasComponent extends HTMLElement {
  private selectElementUtils: SelectElementUtils;
  private locateClosestElementUtils: LocateClosestElementUtils;
  private moveUpSelectedElementUtils: MoveUpSelectedElementUtils;
  private appContext: AppContext;

  constructor() {
    super();
    this.selectElementUtils = new SelectElementUtils();
    this.locateClosestElementUtils = new LocateClosestElementUtils();
    this.moveUpSelectedElementUtils = new MoveUpSelectedElementUtils();
    this.appContext = getAppContext();
    this.locateClosestElementUtils.AddOutliners();

    this.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("scroll", this.scrollHandler.bind(this));
    this.addEventListener("mouseout", this.mouseOutHandler.bind(this));
    this.addEventListener("mousemove", this.mouseHandler.bind(this));
    window.addEventListener("keydown", this.onKeyDown.bind(this));
  }

  private onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === "z") {
      event.preventDefault(); // Prevent the default browser undo behavior
      this.undo();
      this.locateClosestElementUtils.hideBoxVis();
    }
  }

  undo() {
    const html = this.appContext.undoManager.undo();

    if (html !== undefined) {
      this.innerHTML = html;
    }
  }

  connectedCallback() {
    this.innerHTML = this.appContext.canvasHtml;
  }
  mouseOutHandler() {
    this.locateClosestElementUtils.hideBoxVis();
  }

  public scrollHandler() {
    if (!this.appContext.scrollTimeout) {
      this.locateClosestElementUtils.onScrollStart();
    }

    this.appContext.scrollTimeout = setTimeout(
      this.locateClosestElementUtils.onScrollEnd,
      this.appContext.scrollendDelay
    );
  }

  mouseHandler(event: MouseEvent) {
    const { clientX, clientY } = event;
    if (this.appContext.isDragging && this.appContext.selectedElement) {
      this.moveUpSelectedElementUtils.findTheClosestBorderAndMarkIt(
        clientX,
        clientY
      );
      return;
    }

    const target = event.target;
    this.locateClosestElementUtils.clearScrollTimer();

    if (!isHTMLElement(target)) {
      return;
    }
    const info = getElementInfo(target);
    this.appContext.latestInfo = info;
    if (
      target === this.appContext.selectedElement ||
      isElementParentIsMenu(this.appContext.latestInfo.element) ||
      isElementMenu(this.appContext.latestInfo.element) ||
      isElementMenuContainer(this.appContext.latestInfo.element)
    ) {
      return;
    }
    this.locateClosestElementUtils.showInfo(info);
  }

  onMouseDown(event: MouseEvent) {
    if (!this.appContext.selectedElement) {
      this.selectElementUtils.selectElementWithClick(event);
      this.locateClosestElementUtils.hideBoxVis();
      return;
    }

    if (!event.target) {
      return;
    }

    if (
      (event.target as HTMLElement).id === MENU_GO_UP ||
      (event.target as HTMLElement).id === MENU_DUPLICATE ||
      (event.target as HTMLElement).id === MENU_DELETE ||
      (event.target as HTMLElement).id === MENU_MORE
    ) {
      return;
    }

    if (!isElement(event.target)) {
      return;
    }
    if (
      isElementParentIsMenuGrabButton(event.target) ||
      isElementMenuGrabButton(event.target)
    ) {
      this.appContext.isDragging = true;
      // Disable text and image dragging
      event.preventDefault();
      return;
    }
    if (this.appContext.selectedElement !== event.target) {
      this.appContext.isDragging = false;
      this.selectElementUtils.selectElementWithClick(event);
    }
  }

  onMouseUp(event: MouseEvent) {
    this.appContext.isDragging = false;
    if (this.appContext.closestElementWhileDragging) {
      this.appContext.closestElementWhileDragging.style.border = "";
    }

    if (this.appContext.closestBorder) {
      this.moveUpSelectedElementUtils.moveElement();
      this.appContext.storage.updateItem(this.innerHTML);
      this.selectElementUtils.clearSelectedElement();
    }
    this.appContext.closestBorder = null;
    event.preventDefault();
  }
}

export const registerCanvasComponent = () => {
  customElements.define(CANVAS_ELEMENT, CanvasComponent);
};
