export const MENU = "menu";
export const MENU_CONTAINER = "menu_container";
export const CANVAS = "canvas";
export const MENU_GO_UP = "menu-go-up";
export const MENU_DRAG = "menu-drag";
export const MENU_DUPLICATE = "menu-duplicate";
export const MENU_DELETE = "menu-delete";
export const MENU_MORE = "menu-more";
export const IMAGE_WRAPPER = "image-wrapper";

export enum Direction {
  LEFT = "left",
  RIGHT = "right",
  TOP = "top",
  BOTTOM = "bottom",
}

export const minimalDistanceToshow = 30;
export const targetBorderStyle = "3px solid #7FFFD4";
export const imageWrapperSideColor = "#ebae34";
export const imageWrapperSideSize = "3px";
export const imageWrapperPointSize = "7px";
export const mimimalResizingSize = 50;

export const APP_CONTEXT = "x-app-context";
export const CANVAS_ELEMENT = "x-canvas";
export const MENU_ELEMENT = "x-menu";
export const MENU_WRAPPER_ELEMENT = "x-menu-wrapper";
export const MENU_IMAGE_WRAPPER_ELEMENT = "x-menu-image-wrapper";

export const testHTML = `
<div id="canvas">
<div id="body" style="padding: 20px 10px 20px 10px; display: flex; flex-direction: column; gap: 10px;">
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
<div style="display: flex; justify-content: center; align-items: center; gap: 10px;">
<span>A basic avatar component in two sizes:</span>
   <img
      src="https://i.pravatar.cc/150?u=a042581f4e29026024d"
      style="width: 150px; height: 150px;"
      />
</div>
</div>
</div>`;

// img should have both width and height
