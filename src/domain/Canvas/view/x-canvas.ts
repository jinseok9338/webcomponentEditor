import {
  isElementParentIsMenu,
  isElementMenu,
  isElementMenuContainer,
} from "../../../utils/canvas";
import { CANVAS_ELEMENT } from "../../../utils/consts";
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

    const target = event.target as HTMLElement;
    this.locateClosestElementUtils.clearScrollTimer();

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
      this.selectElementUtils.selectElement(event);
      this.locateClosestElementUtils.hideBoxVis();
      return;
    }

    if (this.appContext.selectedElement === event.target) {
      this.appContext.isDragging = true;
      // Disable text and image dragging
      event.preventDefault();
      return;
    }
    if (this.appContext.selectedElement !== event.target) {
      this.appContext.isDragging = false;
      this.selectElementUtils.selectElement(event);
    }
  }

  onMouseUp(event: MouseEvent) {
    this.appContext.isDragging = false;
    if (this.appContext.closestElementWhileDragging) {
      this.appContext.closestElementWhileDragging.style.border = "";
    }

    if (this.appContext.closestBorder) {
      this.moveUpSelectedElementUtils.moveElement();
      this.selectElementUtils.clearSelectedElement();
    }

    this.appContext.closestBorder = null;

    event.preventDefault();
  }
}

export const registerCanvasComponent = () => {
  customElements.define(CANVAS_ELEMENT, CanvasComponent);
};
