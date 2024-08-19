import { calculateDistance } from "../../../utils/canvas";
import {
  addEvent,
  addStyleElement,
  getElementInfo,
} from "../../../utils/global";
import { AppContext, getAppContext } from "../../context/AppContext";

export class SelectElementUtils {
  appContext: AppContext;
  constructor() {
    this.appContext = getAppContext();
  }

  /**
   * Event handler for click event.
   * @param {MouseEvent} event - The mouse event object.
   */
  selectElement(event: MouseEvent) {
    let clickedElement = event.target as HTMLElement;
    if (clickedElement.tagName === "IMG") {
      clickedElement = clickedElement.parentElement as HTMLElement;
    }

    // Reset the previous selected element's box shadow if exists
    if (this.appContext.selectedElement) {
      this.appContext.selectedElement.style.boxShadow = "";
      this.appContext.selectedElement.style.cursor = "";
    }

    // Set the new selected element and apply blue box shadow
    this.appContext.selectedElement = clickedElement;
    clickedElement.style.boxShadow = "0 0 0 2px #00f";
    clickedElement.style.cursor = "grab";
  }
}

/**
 * This class contains methods to locate the closest element while the cursor is not dragging.
 * which means the methods are not used when the cursor is in dragging mode.
 */
export class LocateClosestElementUtils {
  appContext: AppContext;

  constructor() {
    this.appContext = getAppContext();
    this.AddOutliners();
    addEvent(document.body, "mouseover", this.mouseHandler);
    addEvent(window, "scroll", this.scrollHandler);
    addEvent(document.body, "mouseout", this.mouseOutHandler);
  }

  public clearScrollTimer() {
    clearTimeout(this.appContext.scrollTimeout);
    this.appContext.scrollTimeout = null;
  }

  public mouseHandler(e: MouseEvent) {
    const target = e.target as HTMLElement;
    this.clearScrollTimer();

    const info = getElementInfo(target);
    this.appContext.latestInfo = info;
    this.showInfo(info);
  }

  public hideBoxVis() {
    if (!this.appContext.boxvis) {
      return;
    }

    this.appContext.boxvis.tooltip.style.display = "none";

    this.appContext.boxvis.margin.horizontal.removeAttribute("style");
    this.appContext.boxvis.margin.vertical.removeAttribute("style");
    this.appContext.boxvis.margin.inner.style.display = "none";

    this.appContext.boxvis.border.horizontal.removeAttribute("style");
    this.appContext.boxvis.border.vertical.removeAttribute("style");
    this.appContext.boxvis.border.inner.style.display = "none";

    this.appContext.boxvis.padding.horizontal.removeAttribute("style");
    this.appContext.boxvis.padding.vertical.removeAttribute("style");
    this.appContext.boxvis.padding.inner.style.display = "none";

    this.appContext.boxvis.box.horizontal.removeAttribute("style");
    this.appContext.boxvis.box.vertical.removeAttribute("style");
    this.appContext.boxvis.box.inner.style.display = "none";
  }

  public mouseOutHandler(e: MouseEvent) {
    this.hideBoxVis();
  }

  public scrollHandler(e: Event) {
    if (!this.appContext.scrollTimeout) {
      this.onScrollStart();
    }

    this.appContext.scrollTimeout = setTimeout(
      this.onScrollEnd,
      this.appContext.scrollendDelay
    );
  }

  private onScrollStart() {
    this.hideBoxVis();
  }

  private onScrollEnd() {
    this.clearScrollTimer();
    if (this.appContext.latestInfo) {
      this.appContext.latestInfo.box =
        this.appContext.latestInfo.element.getBoundingClientRect();
      this.showInfo(this.appContext.latestInfo);
    }
  }

  private showInfo(info: ReturnType<typeof getElementInfo>) {
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    const windowWidth =
      window.innerWidth ||
      document.documentElement.clientWidth ||
      document.body.clientWidth;

    // tooltip
    const tagName = '<span class="t">' + info.tagName.toLowerCase() + "</span>";
    const idSelector =
      '<span class="i">' + info.selectors.id.toLowerCase() + "</span>";
    const classSelector =
      '<span class="c">' + info.selectors.className.toLowerCase() + "</span>";
    const dimensions =
      '<span class="d"> | ' +
      Math.round(info.box.width * 100) / 100 +
      " x " +
      Math.round(info.box.height * 100) / 100 +
      "</span>";
    const information = tagName + idSelector + classSelector + dimensions;
    if (!this.appContext.boxvis) {
      return;
    }

    this.appContext.boxvis.tooltip.style.display = "block";
    this.appContext.boxvis.tooltip.innerHTML = information;
    const tooltipBox = this.appContext.boxvis.tooltip.getBoundingClientRect();

    let tooltipTop = info.box.top - 30;
    this.appContext.boxvis.tooltip.classList.remove("top");
    if (tooltipTop < 0) {
      this.appContext.boxvis.tooltip.classList.add("top");

      tooltipTop = info.box.bottom + 6;

      if (tooltipTop + 30 > windowHeight) {
        tooltipTop = 6;
      }
    }

    let tooltipLeft = info.box.left + 2;
    this.appContext.boxvis.tooltip.classList.remove("right");
    if (tooltipLeft < 0) {
      tooltipLeft = 2;
    } else {
      if (tooltipLeft + tooltipBox.width > windowWidth) {
        this.appContext.boxvis.tooltip.classList.add("right");
        tooltipLeft = windowWidth - tooltipBox.width - 2;
      }
    }

    this.appContext.boxvis.tooltip.style.top = tooltipTop + "px";
    this.appContext.boxvis.tooltip.style.left = tooltipLeft + "px";

    // margin
    this.appContext.boxvis.margin.horizontal.style.top =
      info.box.top - info.margin.top + "px";
    this.appContext.boxvis.margin.horizontal.style.height =
      info.box.height + info.margin.top + info.margin.bottom + "px";

    this.appContext.boxvis.margin.vertical.style.left =
      info.box.left - info.margin.left + "px";
    this.appContext.boxvis.margin.vertical.style.width =
      info.box.width + info.margin.left + info.margin.right + "px";

    this.appContext.boxvis.margin.inner.style.display = "block";
    this.appContext.boxvis.margin.inner.style.top =
      info.box.top - info.margin.top + "px";
    this.appContext.boxvis.margin.inner.style.left =
      info.box.left - info.margin.left + "px";
    this.appContext.boxvis.margin.inner.style.height =
      info.box.height + info.margin.top + info.margin.bottom + "px";
    this.appContext.boxvis.margin.inner.style.width =
      info.box.width + info.margin.left + info.margin.right + "px";

    // border
    this.appContext.boxvis.border.horizontal.style.top = info.box.top + "px";
    this.appContext.boxvis.border.horizontal.style.height =
      info.box.height + "px";

    this.appContext.boxvis.border.vertical.style.left = info.box.left + "px";
    this.appContext.boxvis.border.vertical.style.width = info.box.width + "px";

    this.appContext.boxvis.border.inner.style.display = "block";
    this.appContext.boxvis.border.inner.style.top = info.box.top + "px";
    this.appContext.boxvis.border.inner.style.left = info.box.left + "px";
    this.appContext.boxvis.border.inner.style.height = info.box.height + "px";
    this.appContext.boxvis.border.inner.style.width = info.box.width + "px";

    // padding
    this.appContext.boxvis.padding.horizontal.style.top =
      info.box.top + info.border.top + "px";
    this.appContext.boxvis.padding.horizontal.style.height =
      info.box.height - info.border.top - info.border.bottom + "px";

    this.appContext.boxvis.padding.vertical.style.left =
      info.box.left + info.border.left + "px";
    this.appContext.boxvis.padding.vertical.style.width =
      info.box.width - info.border.left - info.border.right + "px";

    this.appContext.boxvis.padding.inner.style.display = "block";
    this.appContext.boxvis.padding.inner.style.top =
      info.box.top + info.border.top + "px";
    this.appContext.boxvis.padding.inner.style.left =
      info.box.left + info.border.left + "px";
    this.appContext.boxvis.padding.inner.style.height =
      info.box.height - info.border.top - info.border.bottom + "px";
    this.appContext.boxvis.padding.inner.style.width =
      info.box.width - info.border.left - info.border.right + "px";

    // box
    this.appContext.boxvis.box.horizontal.style.top =
      info.box.top + info.border.top + info.padding.top + "px";
    this.appContext.boxvis.box.horizontal.style.height =
      info.box.height -
      info.border.top -
      info.border.bottom -
      info.padding.top -
      info.padding.bottom +
      "px";

    this.appContext.boxvis.box.vertical.style.left =
      info.box.left + info.border.left + info.padding.left + "px";
    this.appContext.boxvis.box.vertical.style.width =
      info.box.width -
      info.border.left -
      info.border.right -
      info.padding.left -
      info.padding.right +
      "px";

    this.appContext.boxvis.box.inner.style.display = "block";
    this.appContext.boxvis.box.inner.style.top =
      info.box.top + info.border.top + info.padding.top + "px";
    this.appContext.boxvis.box.inner.style.left =
      info.box.left + info.border.left + info.padding.left + "px";
    this.appContext.boxvis.box.inner.style.height =
      info.box.height -
      info.border.top -
      info.border.bottom -
      info.padding.top -
      info.padding.bottom +
      "px";
    this.appContext.boxvis.box.inner.style.width =
      info.box.width -
      info.border.left -
      info.border.right -
      info.padding.left -
      info.padding.right +
      "px";
  }
  public AddOutliners() {
    var styles =
      '.boxvis > div > div{pointer-events:none;position:fixed;z-index:2147483637;top:-10px;bottom:-10px;left:-10px;right:-10px}.boxvis:not(.noln) > div > div{border-width:1px;border-style:dashed}.boxvis > .mg > div{border-color:#e67700}.boxvis > .bd > div{border-color:#dcdc40}.boxvis > .pd > div{border-color:#00bb20}.boxvis > .bx > div{border-color:#0000e6}.boxvis > div > .o{z-index:2147483638;border:none;display:none}.boxvis:not(.nobg) > .mg > .o{background-color:rgba(255,153,0,0.125)}.boxvis:not(.nobg) > .pd > .o{background-color:rgba(0,140,64,0.125)}.boxvis:not(.nobg) > .bd > .o{background-color:rgba(255,255,0,0.125)}.boxvis:not(.nobg) > .bx > .o{background-color:rgba(0,100,255,0.35)}.boxvis > .i{box-shadow:0 0 4px -1px rgba(255,255,255,1);pointer-events:none;position:fixed;z-index:2147483638;background-color:#000;font-size:12px;padding:3px 8px 5px 10px;border-radius:4px;white-space:nowrap;display:none}.boxvis > .i:before{content:"";position:absolute;top:100%;left:10px;border:solid 6px transparent;border-top-color:#000}.boxvis > .i.top:before{top:-12px;border:solid 6px transparent;border-top-color:transparent;border-bottom-color:#000}.boxvis > .i.right:before{left:auto;right:10px}.boxvis > .i > .t{color:#FF74FF;font-weight:700}.boxvis > .i > .i{color:#FFB952}.boxvis > .i > .c{color:#75CFFF}.boxvis > .i > .d{font-size:10px;margin-left:3px;color:#CCC}';
    addStyleElement(styles);

    var html =
      '<div class="mg"><div class="h"></div><div class="v"></div><div class="o"></div></div><div class="bd"><div class="h"></div><div class="v"></div><div class="o"></div></div><div class="pd"><div class="h"></div><div class="v"></div><div class="o"></div></div><div class="bx"><div class="h"></div><div class="v"></div><div class="o"></div></div><div class="i"></div>';

    var outlinerContainer = document.createElement("div");
    //outlinerContainer.className = 'boxvis' + (query.noln ? ' noln' : '') + (query.nobg ? ' nobg' : '');
    document.body.appendChild(outlinerContainer);

    outlinerContainer.innerHTML = html;
    var addedElements = outlinerContainer.childNodes;
    this.appContext.boxvis = {
      margin: {
        horizontal: addedElements[0].childNodes[0] as HTMLElement,
        vertical: addedElements[0].childNodes[1] as HTMLElement,
        inner: addedElements[0].childNodes[2] as HTMLElement,
      },
      border: {
        horizontal: addedElements[1].childNodes[0] as HTMLElement,
        vertical: addedElements[1].childNodes[1] as HTMLElement,
        inner: addedElements[1].childNodes[2] as HTMLElement,
      },
      padding: {
        horizontal: addedElements[2].childNodes[0] as HTMLElement,
        vertical: addedElements[2].childNodes[1] as HTMLElement,
        inner: addedElements[2].childNodes[2] as HTMLElement,
      },
      box: {
        horizontal: addedElements[3].childNodes[0] as HTMLElement,
        vertical: addedElements[3].childNodes[1] as HTMLElement,
        inner: addedElements[3].childNodes[2] as HTMLElement,
      },
      tooltip: addedElements[4] as HTMLElement,
    };
  }
}

// This class contains methods to find the closest border to which the selected element should move
// and contains methods to move the selected element
export class MoveUpSelectedElementUtils {
  appContext: AppContext;
  constructor() {
    this.appContext = getAppContext();
  }

  moveElement() {
    if (
      this.appContext.closestBorder === "top" ||
      this.appContext.closestBorder === "left"
    ) {
      this.moveToTheFront();
    }
    if (
      this.appContext.closestBorder === "right" ||
      this.appContext.closestBorder === "bottom"
    ) {
      this.moveToTheBack();
    }
  }

  /**
   * Log the closest border of an element based on cursor position.
   * @param {number} clientX - The x-coordinate of the cursor.
   * @param {number} clientY - The y-coordinate of the cursor.

   */
  findTheClosestBorderAndMarkIt(clientX: number, clientY: number) {
    // Get all elements inside the component
    const elements = this.appContext.querySelectorAll("*");

    let minDistance = Infinity;

    if (this.appContext.closestElementWhileDragging) {
      this.appContext.closestElementWhileDragging.style.boxShadow = "";
      this.appContext.closestBorder = null;
    }

    elements.forEach((element) => {
      const rect = element.getBoundingClientRect();

      // Check if the cursor is within the element's bounds
      // if the element is the child element of the selected element then it is not the closest element
      if (
        clientX >= rect.left &&
        clientX <= rect.right &&
        clientY >= rect.top &&
        clientY <= rect.bottom &&
        !this.isTheElemnetTheChildOfTheSelectedElement(element as HTMLElement)
      ) {
        this.appContext.closestElementWhileDragging = element as HTMLElement;
        minDistance = 0; // No need to calculate distance if cursor is inside the element
        return;
      }

      // If the cursor is outside, calculate the distance to the nearest edge

      const distance = calculateDistance(clientX, clientY, rect);
      if (distance < minDistance) {
        minDistance = distance;
        this.appContext.closestElementWhileDragging = element as HTMLElement;
      }
    });

    // Reset all borders for elements except the selected one
    elements.forEach((el) => {
      if (el !== this.appContext.selectedElement) {
        (el as HTMLElement).style.border = "";
      }
    });
    if (
      this.appContext.closestElementWhileDragging &&
      this.appContext.closestElementWhileDragging !==
        this.appContext.selectedElement &&
      minDistance <= 30
    ) {
      // now find the closest border of the selected element to the cursor
      const rect =
        this.appContext.closestElementWhileDragging.getBoundingClientRect();
      const distances = {
        left: Math.abs(rect.left - clientX),
        right: Math.abs(rect.right - clientX),
        top: Math.abs(rect.top - clientY),
        bottom: Math.abs(rect.bottom - clientY),
      } as const;
      const closestBorder = (
        Object.keys(distances) as Array<keyof typeof distances>
      ).reduce((a, b) => (distances[a] < distances[b] ? a : b), "left");

      this.markTheClosestBorder(closestBorder);
    }
  }

  markTheClosestBorder(closestBorder: "left" | "right" | "top" | "bottom") {
    switch (closestBorder) {
      case "left":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderLeft =
          "5px solid #7FFFD4";
        this.appContext.closestBorder = "left";
        break;
      case "right":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderRight =
          "5px solid #7FFFD4";

        this.appContext.closestBorder = "right";
        break;
      case "top":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderTop =
          "5px solid #7FFFD4";
        this.appContext.closestBorder = "top";
        break;
      case "bottom":
        if (!this.appContext.closestElementWhileDragging) {
          return;
        }
        this.appContext.closestElementWhileDragging.style.borderBottom =
          "5px solid #7FFFD4";
        this.appContext.closestBorder = "bottom";
    }
  }

  moveToTheFront() {
    if (
      !this.appContext.closestElementWhileDragging ||
      !this.appContext.selectedElement
    ) {
      return;
    }
    const clonedSelectedElement =
      this.appContext.selectedElement.cloneNode(true);
    if (this.appContext.closestElementWhileDragging.parentNode) {
      this.appContext.closestElementWhileDragging.parentNode.insertBefore(
        clonedSelectedElement,
        this.appContext.closestElementWhileDragging
      );
    }

    // this selectedElemt's parentNode
    const parentNode = this.appContext.selectedElement.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.appContext.selectedElement);
    }

    this.appContext.selectedElement = null;
    this.appContext.closestElementWhileDragging = null;
  }

  moveToTheBack() {
    if (
      !this.appContext.closestElementWhileDragging ||
      !this.appContext.selectedElement
    ) {
      return;
    }

    const clonedSelectedElement =
      this.appContext.selectedElement.cloneNode(true);
    if (this.appContext.closestElementWhileDragging.parentNode) {
      this.appContext.closestElementWhileDragging.parentNode.insertBefore(
        clonedSelectedElement,
        this.appContext.closestElementWhileDragging.nextSibling
      );
    }
    // this selectedElemt's parentNode
    const parentNode = this.appContext.selectedElement.parentNode;
    if (parentNode) {
      parentNode.removeChild(this.appContext.selectedElement);
    }

    this.appContext.selectedElement = null;
    this.appContext.closestElementWhileDragging = null;
  }

  isTheElemnetTheChildOfTheSelectedElement(element: HTMLElement): boolean {
    if (this.appContext.selectedElement === element) {
      return true;
    }
    const parentNode = element.parentNode as HTMLElement;
    if (parentNode) {
      return this.isTheElemnetTheChildOfTheSelectedElement(parentNode);
    }
    return false;
  }
}
