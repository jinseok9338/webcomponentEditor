import { APP_CONTEXT, testHTML } from "../../../utils/consts";
import { getElement, getElementInfo } from "../../../utils/global";
import { UndoManager } from "../../Canvas/context/undoManager";
import { LocalStorage } from "../../Storage/LocalStorage";
import { HTMLStorage } from "../../Storage/storage";
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
    new LocalStorage("canvas-html"),
    testHTML
  );
  isTextAndImageNotSelectable = true;
  query = {
    noln: false,
    nobg: false,
  };
  canvasHtml: string = this.storage.getItem() ?? "";
  undoManager: UndoManager = new UndoManager();

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
