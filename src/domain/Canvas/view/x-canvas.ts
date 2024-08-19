import { AppContext, getAppContext } from "../../context/AppContext";
import { SelectElementUtils, LocateClosestElementUtils, MoveUpSelectedElementUtils } from "../model/Canvas";



const testhtml = `
<div style="padding: 20px; display: flex; flex-direction: column; gap: 10px;">
<div style="display: flex; gap: 10px;">
   <p>A basic avatar component in two sizes:</p>
   <img
     style="width: 150px; height: 150px;"
      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      />
   <img
      src="https://i.pravatar.cc/150?u=a04258114e29026302d"
      style="width: 150px; height: 150px;"
      />
</div>
<div style="display: flex; gap: 10px;">
   <p>A basic avatar component in two sizes:</p>
   <img
      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      style="width: 150px; height: 150px;"
      />
   <img
      src="https://i.pravatar.cc/150?u=a04258114e29026302d"
      style="width: 150px; height: 150px;"
      />
</div>
</div> `;

export class CanvasComponent extends HTMLElement {
  private selectElementUtils: SelectElementUtils;
  private locateClosestElementUtils: LocateClosestElementUtils;
  private moveUpSelectedElementUtils: MoveUpSelectedElementUtils;
  private appContext: AppContext;


  constructor() {
    super();
    this.innerHTML = testhtml;
    this.selectElementUtils = new SelectElementUtils();
    this.locateClosestElementUtils = new LocateClosestElementUtils();
    this.moveUpSelectedElementUtils = new MoveUpSelectedElementUtils();
    this.appContext = getAppContext();

    document.addEventListener("mousemove", this.onMouseMove.bind(this));
    document.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
  }
  /**
   * Event handler for mousemove event.
   * @param {MouseEvent} event - The mouse event object.
   */
  onMouseMove(event: MouseEvent) {


    if (!this.appContext.isDragging && !this.appContext.selectedElement) {
      return;
    }
    const { clientX, clientY } = event;
    if (this.appContext.isDragging && this.appContext.selectedElement) {
      // Find and log the closest border
      this.moveUpSelectedElementUtils.findTheClosestBorderAndMarkIt(
        clientX,
        clientY
      );
      return;
    }
    this.locateClosestElementUtils.findTheClosestElement(clientX, clientY);
  }

  onMouseDown(event: MouseEvent) {
    if (!this.appContext.selectedElement) {
      this.selectElementUtils.selectElement(event);
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

  /**
   * Event handler for mouseup event.
   * @param {MouseEvent} event - The mouse event object.
   */
  onMouseUp(event: MouseEvent) {
    this.appContext.isDragging = false;
    if (this.appContext.closestElementWhileDragging) {
      this.appContext.closestElementWhileDragging.style.border = "";
    }

    if (this.appContext.closestBorder) {
      this.moveUpSelectedElementUtils.moveElement();
    }

    this.appContext.closestBorder = null;
    event.preventDefault();
  }
}

export const registerCanvasComponent = () => {
  customElements.define("x-canvas", CanvasComponent);
};
