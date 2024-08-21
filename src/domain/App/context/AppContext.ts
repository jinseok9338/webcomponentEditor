import { APP_CONTEXT } from "../../../utils/consts";
import { getElement, getElementInfo } from "../../../utils/global";
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
  isTextAndImageNotSelectable = true;
  query = {
    noln: false,
    nobg: false,
  };
  canvasHtml: string = `
<div id="canvas">
<div id="body" style="padding: 20px 10px 20px 10px; display: flex; flex-direction: column; gap: 10px;">
<div style="display: flex; gap: 10px;">
   <p>A basic avatar component in two sizes:</p>

   <img
     style="width: 150px;"
      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      />

   <img
      src="https://i.pravatar.cc/150?u=a04258114e29026302d"
      style="width: 150px;"
      />

</div>
<div style="display: flex; gap: 10px;">
   <p>A basic avatar component in two sizes:</p>

   <img
      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      style="width: 150px; "
      />


   <img
      src="https://i.pravatar.cc/150?u=a04258114e29026302d"
      style="width: 150px; "
      />
</div>
</div>
</div>`;

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
