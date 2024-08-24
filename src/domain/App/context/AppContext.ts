import { APP_CONTEXT, testHTML } from "../../../utils/consts";
import { getElement, getElementInfo } from "../../../utils/global";
import { SessionStorage } from "../../Storage/SessionStorage";
import { HTMLStorage } from "../../Storage/storage";
import { UndoManager } from "../../UndoManager/undoManager";
import { Boxvis } from "./type";

export class AppContext extends HTMLElement {
  isContextReady = false;
  selectedElement: HTMLElement | null = null;
  isDragging = false;
  closestElementWhileDragging: HTMLElement | null = null;
  closestElmentWitoutDragging: HTMLElement | null = null;
  closestBorder: string | null = null;
  isGuideLineVisible: boolean = false;
  boxvis: Boxvis | null = null;
  latestInfo: ReturnType<typeof getElementInfo> | null = null;
  scrollTimeout: any = null;
  scrollendDelay = 250;
  storage: HTMLStorage = new HTMLStorage(
    new SessionStorage("canvas-html"),
    testHTML
  );
  isTextAndImageNotSelectable = true;
  query = {
    noln: false,
    nobg: false,
  };

  canvasHtml: string = this.storage.getItem() ?? "";
  undoManager: UndoManager = new UndoManager();
  menuWrapperState = {
    isInvoked: false,
    currentMenuWrapperHandlerId: "",
    original_mouseX: 0,
    original_mouseY: 0,
    original_width: 0,
    original_height: 0,
    original_x: 0,
    original_y: 0,
  };

  constructor() {
    super();
    this.style.display = "contents";
    this.isContextReady = true;
  }
}

export const registerAppContext = () =>
  customElements.define(APP_CONTEXT, AppContext);

export const getAppContext = () => {
  const appContext = getElement(APP_CONTEXT) as AppContext;
  if (!appContext) {
    throw new Error("AppContext not found");
  }
  if (!appContext.isContextReady) {
    throw new Error("AppContext is not ready");
  }
  return appContext;
};
