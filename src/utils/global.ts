export function addEvent(obj: any, type: string, fn: any) {
  if (obj.attachEvent) {
    obj["e" + type + fn] = fn;
    obj[type + fn] = function () {
      obj["e" + type + fn](window.event);
    };
    obj.attachEvent("on" + type, obj[type + fn]);
  } else {
    obj.addEventListener(type, fn, false);
  }
}

export function removeEvent(obj: any, type: string, fn: any) {
  if (obj.detachEvent) {
    obj.detachEvent("on" + type, obj[type + fn]);
    obj[type + fn] = null;
  } else {
    obj.removeEventListener(type, fn, false);
  }
}

export function addStyleElement(css: string) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);
}

export function getStyleValue(style: CSSStyleDeclaration, value: string) {
  return parseFloat(style.getPropertyValue(value));
}
