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
