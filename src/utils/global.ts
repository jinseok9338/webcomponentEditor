export function addStyleElement(css: string) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

export function getStyleValue(style: CSSStyleDeclaration, value: string) {
  return parseFloat(style.getPropertyValue(value));
}

export function getElementInfo(element: HTMLElement) {
  var styles = window.getComputedStyle(element);

  return {
    element: element,
    tagName: element.tagName,
    selectors: {
      id: element.id ? "#" + element.id : "",
      className: element.className
        ? "." + element.className.replace(/\s/g, ".")
        : "",
    },
    box: element.getBoundingClientRect(),
    margin: {
      top: getStyleValue(styles, "margin-top"),
      right: getStyleValue(styles, "margin-right"),
      bottom: getStyleValue(styles, "margin-bottom"),
      left: getStyleValue(styles, "margin-left"),
    },
    border: {
      top: getStyleValue(styles, "border-top-width"),
      right: getStyleValue(styles, "border-right-width"),
      bottom: getStyleValue(styles, "border-bottom-width"),
      left: getStyleValue(styles, "border-left-width"),
    },
    padding: {
      top: getStyleValue(styles, "padding-top"),
      right: getStyleValue(styles, "padding-right"),
      bottom: getStyleValue(styles, "padding-bottom"),
      left: getStyleValue(styles, "padding-left"),
    },
  };
}

export const isHTMLElement = (element: any): element is HTMLElement => {
  return element instanceof HTMLElement;
};
