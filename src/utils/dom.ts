export const isHTMLElement = (element: any): element is HTMLElement => {
  return element instanceof HTMLElement;
};

export const isElement = (element: any): element is Element => {
  return element instanceof Element;
};

export const convertNodeToHTMLElement = (element: Node): HTMLElement => {
  if (isHTMLElement(element)) {
    return element;
  } else {
    throw new Error(
      "The provided Node is not an HTMLElement. It might lead to unexpected behavior."
    );
  }
};

export const convertElementToHTMLElement = (element: Element): HTMLElement => {
  if (isHTMLElement(element)) {
    return element;
  } else {
    throw new Error(
      "The provided Element is not an HTMLElement. It might lead to unexpected behavior."
    );
  }
};

export const isElementText = (element: Element): element is HTMLElement => {
  // TEXTAREA, INPUT, TEXT, P, SPAN, H1, H2, H3, H4, H5, H6, LI, UL, OL, DL, BLOCKQUOTE, PRE, CODE
  return (
    element.tagName === "TEXTAREA" ||
    element.tagName === "INPUT" ||
    element.tagName === "TEXT" ||
    element.tagName === "P" ||
    element.tagName === "SPAN" ||
    element.tagName === "H1" ||
    element.tagName === "H2" ||
    element.tagName === "H3" ||
    element.tagName === "H4" ||
    element.tagName === "H5" ||
    element.tagName === "H6" ||
    element.tagName === "LI" ||
    element.tagName === "UL" ||
    element.tagName === "OL" ||
    element.tagName === "DL" ||
    element.tagName === "BLOCKQUOTE" ||
    element.tagName === "PRE" ||
    element.tagName === "CODE"
  );
};

// export const validateHTMLtext = (text: string): boolean => {
//   // if the img tag has margin or padding return false
//   // if the img tag dosesn't have width or height in the style attribute return false
// };
