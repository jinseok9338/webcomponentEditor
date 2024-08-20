import { addStyleElement, getElementInfo } from "../../../utils/global";
import { AppContext, getAppContext } from "../../App/context/AppContext";

export class LocateClosestElementUtils {
  appContext: AppContext;

  constructor() {
    this.appContext = getAppContext();
  }

  public clearScrollTimer() {
    clearTimeout(this.appContext.scrollTimeout);
    this.appContext.scrollTimeout = null;
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

  onScrollStart() {
    this.hideBoxVis();
  }

  onScrollEnd() {
    this.clearScrollTimer();
    if (this.appContext.latestInfo) {
      this.appContext.latestInfo.box =
        this.appContext.latestInfo.element.getBoundingClientRect();
      this.showInfo(this.appContext.latestInfo);
    }
  }

  showInfo(info: ReturnType<typeof getElementInfo>) {
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
    let styles =
      '.boxvis > div > div{pointer-events:none;position:fixed;z-index:2147483637;top:-10px;bottom:-10px;left:-10px;right:-10px}.boxvis:not(.noln) > div > div{border-width:1px;border-style:dashed}.boxvis > .mg > div{border-color:#e67700}.boxvis > .bd > div{border-color:#dcdc40}.boxvis > .pd > div{border-color:#00bb20}.boxvis > .bx > div{border-color:#0000e6}.boxvis > div > .o{z-index:2147483638;border:none;display:none}.boxvis:not(.nobg) > .mg > .o{background-color:rgba(255,153,0,0.125)}.boxvis:not(.nobg) > .pd > .o{background-color:rgba(0,140,64,0.125)}.boxvis:not(.nobg) > .bd > .o{background-color:rgba(255,255,0,0.125)}.boxvis:not(.nobg) > .bx > .o{background-color:rgba(0,100,255,0.35)}.boxvis > .i{box-shadow:0 0 4px -1px rgba(255,255,255,1);pointer-events:none;position:fixed;z-index:2147483638;background-color:#000;font-size:12px;padding:3px 8px 5px 10px;border-radius:4px;white-space:nowrap;display:none}.boxvis > .i:before{content:"";position:absolute;top:100%;left:10px;border:solid 6px transparent;border-top-color:#000}.boxvis > .i.top:before{top:-12px;border:solid 6px transparent;border-top-color:transparent;border-bottom-color:#000}.boxvis > .i.right:before{left:auto;right:10px}.boxvis > .i > .t{color:#FF74FF;font-weight:700}.boxvis > .i > .i{color:#FFB952}.boxvis > .i > .c{color:#75CFFF}.boxvis > .i > .d{font-size:10px;margin-left:3px;color:#CCC}';
    addStyleElement(styles);

    let html =
      '<div class="mg"><div class="h"></div><div class="v"></div><div class="o"></div></div><div class="bd"><div class="h"></div><div class="v"></div><div class="o"></div></div><div class="pd"><div class="h"></div><div class="v"></div><div class="o"></div></div><div class="bx"><div class="h"></div><div class="v"></div><div class="o"></div></div><div class="i"></div>';

    let outlinerContainer = document.createElement("div");
    outlinerContainer.className =
      "boxvis" +
      (this.appContext.query.noln ? " noln" : "") +
      (this.appContext.query.nobg ? " nobg" : "");
    document.body.appendChild(outlinerContainer);

    outlinerContainer.innerHTML = html;
    let addedElements = outlinerContainer.childNodes;
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
