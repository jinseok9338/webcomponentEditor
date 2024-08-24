import {
  isElementParentIsMenu,
  isElementMenu,
  isElementMenuContainer,
  isElementParentIsMenuGrabButton,
  isElementMenuGrabButton,
  isElementImageWrapper,
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
import { ImageWrapperHandler } from "../context/menuWrapperHandler";
import { MoveUpSelectedElementUtils } from "../context/moveElement";
import { SelectElementUtils } from "../context/selectElement";

export class CanvasComponent extends HTMLElement {
  private selectElementUtils: SelectElementUtils;
  private locateClosestElementUtils: LocateClosestElementUtils;
  private moveUpSelectedElementUtils: MoveUpSelectedElementUtils;
  private appContext: AppContext;
  private imageWrapperHandler: ImageWrapperHandler;

  constructor() {
    super();
    this.selectElementUtils = new SelectElementUtils();
    this.locateClosestElementUtils = new LocateClosestElementUtils();
    this.moveUpSelectedElementUtils = new MoveUpSelectedElementUtils();
    this.appContext = getAppContext();
    this.locateClosestElementUtils.AddOutliners();
    this.imageWrapperHandler = new ImageWrapperHandler();

    this.addEventListener("mousedown", this.onMouseDown.bind(this));
    this.addEventListener("mouseup", this.onMouseUp.bind(this));
    window.addEventListener("scroll", this.scrollHandler.bind(this));
    this.addEventListener("mouseout", this.mouseOutHandler.bind(this));
    this.addEventListener("mousemove", this.mouseMove.bind(this));
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
      this.appContext.storage.updateItem(this.innerHTML);
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

  mouseMove(event: MouseEvent) {
    const { clientX, clientY } = event;
    if (this.appContext.menuWrapperState.isInvoked) {
      this.imageWrapperHandler.handleMouseMove(event);
      return;
    }

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
    if (this.isElementNotDebuggable(event.target, this.appContext.latestInfo)) {
      return;
    }
    this.locateClosestElementUtils.showInfo(info);
  }

  isElementNotDebuggable(
    target: EventTarget | null,
    info: ReturnType<typeof getElementInfo>
  ) {
    return (
      target === this.appContext.selectedElement ||
      isElementParentIsMenu(info.element) ||
      isElementMenu(info.element) ||
      isElementMenuContainer(info.element) ||
      isElementImageWrapper(info.element)
    );
  }

  onMouseDown(event: MouseEvent) {
    if (!this.appContext.selectedElement) {
      this.selectElementUtils.selectElementWithClick(event);
      this.locateClosestElementUtils.hideBoxVis();
      return;
    }

    // mouse event 에 타겟이 없는 경우
    if (!event.target || !isElement(event.target)) {
      console.error("target is not element");
      return;
    }

    // 메뉴를 선택한 경우
    if (
      event.target.id === MENU_GO_UP ||
      event.target.id === MENU_DUPLICATE ||
      event.target.id === MENU_DELETE ||
      event.target.id === MENU_MORE
    ) {
      return;
    }

    if (this.appContext.menuWrapperState.isInvoked) {
      return;
    }

    // 메뉴 중 옮기는 메뉴를 선택한 경우
    if (
      isElementParentIsMenuGrabButton(event.target) ||
      isElementMenuGrabButton(event.target)
    ) {
      this.appContext.isDragging = true;
      // Disable text and image dragging
      event.preventDefault();
      return;
    }

    // wrapping element 의 handler 를 선택한 경우
    if (this.isElementMenuHandler(event.target)) {
      this.imageWrapperHandler.handleMouseDown(event);
      return;
    }

    // 선택된 element 가 있는데 다른 element 을 선택한 경우
    if (this.appContext.selectedElement !== event.target) {
      this.appContext.isDragging = false;
      this.selectElementUtils.selectElementWithClick(event);
      return;
    }
  }

  isElementMenuHandler(target: Element) {
    return isElementImageWrapper(target);
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

    if (this.appContext.menuWrapperState.isInvoked) {
      this.imageWrapperHandler.handleMouseUp();
    }
    event.preventDefault();
  }
}

export const registerCanvasComponent = () => {
  customElements.define(CANVAS_ELEMENT, CanvasComponent);
};
