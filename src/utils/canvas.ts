import { MENU, MENU_CONTAINER, MENU_DRAG } from "./consts";

export const convertToFramesAndComponents = (html: string) => {
  const parsedHtml = html.trim();
  const parser = new DOMParser();
  const doc = parser.parseFromString(parsedHtml, "text/html");

  let idCounter = 0; // To generate unique IDs for each frame
  const frames: Frame[] = []; // To store the Frame instances
  const components: Component[] = []; // To store the Component instances

  // Function to create a Component instance from an HTML element
  const createComponent = (element: HTMLElement) => {
    const tag = element.tagName.toLowerCase();
    const attrs = Array.from(element.attributes).reduce(
      (acc: { [key: string]: string }, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      },
      {}
    );
    // if the element has no children, and has text, then it is a text component
    const text =
      element.childNodes.length === 1 &&
      element.textContent?.trim() &&
      element.childNodes[0].nodeType === Node.TEXT_NODE
        ? element.textContent.trim()
        : null;

    return new Component(idCounter, {
      tag,
      attrs,
      text,
    });
  };

  // Recursive function to traverse the DOM and generate Frames and Components
  const traverseNode = (
    node: HTMLElement,
    parentId: number | null,
    position: number
  ) => {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node;
      const currentId = idCounter++;

      // Create a Component instance for the current element
      const component = createComponent(element);
      components.push(component);

      // Create a Frame instance
      const frame = new Frame(currentId, component.id, position, parentId);
      frames.push(frame);

      // Process child nodes
      Array.from(element.childNodes).forEach((child, index) => {
        const childElement = child as HTMLElement;
        traverseNode(childElement, currentId, index);
      });
    }
  };

  // Start traversal from the root
  traverseNode(doc.documentElement, null, 0);

  return { frames, components };
};

export class Frame {
  // if the inner frame is not null, it means that the frame is a nested frame and has no children

  id: number;
  content_id: number;
  position: number;
  parentId: number | null;
  constructor(
    id: number,
    content_id: number,
    position: number,
    parentId: number | null
  ) {
    // this is id of the frame in that is unique
    this.id = id;
    // this is used to map to the content of the frame
    this.content_id = content_id;
    // this is the position
    this.position = position;
    this.parentId = parentId;
  }
}

export class Component {
  // this is used to map to the content of the frame
  id: number;
  content: {
    tag: string;
    attrs: Record<string, string>;
    text: string | null;
  };

  constructor(
    id: number,
    content: {
      tag: string;
      attrs: Record<string, string>;
      text: string | null;
    }
  ) {
    this.id = id;
    this.content = content;
  }
}

// Method to render HTML from frames and components
export function renderHtml(frames: Frame[], components: Component[]) {
  // Create a map for quick lookup of components by id
  const componentMap = new Map();
  components.forEach((component) => componentMap.set(component.id, component));

  // Build a tree structure from frames
  const nodeMap = new Map();
  frames.forEach((frame) => {
    nodeMap.set(frame.id, { frame, children: {} });
  });

  // Populate the children in the tree
  frames.forEach((frame) => {
    if (frame.parentId !== null) {
      const parentNode = nodeMap.get(frame.parentId);
      if (parentNode) {
        parentNode.children[frame.position] = nodeMap.get(frame.id);
      }
    }
  });

  // Function to generate HTML from a node
  const generateHtml = (node: any) => {
    if (!node) return "";

    const component = componentMap.get(node.frame.content_id);
    if (!component) return "";

    const tag = component.content.tag;
    const attrs = component.content.attrs
      ? Object.entries(component.content.attrs)
          .map(([key, value]) => `${key}="${value}"`)
          .join(" ")
      : "";

    const textContent = component.content.text ? component.content.text : "";

    let attributes = [attrs].filter((attr) => attr).join(" ");

    // Open tag
    let html = `<${tag}${attributes ? " " + attributes : ""}>`;

    // Add text content
    html += textContent;

    // Add children
    const children = Object.values(node.children);
    if (children.length > 0) {
      html += children.map(generateHtml).join("");
    }

    // Close tag
    html += `</${tag}>`;

    return html;
  };

  // Find the root nodes (nodes with null parentId)
  const rootNodes = frames
    .filter((frame) => frame.parentId === null)
    .map((frame) => nodeMap.get(frame.id));

  // Generate HTML from the root nodes
  return rootNodes.map(generateHtml).join("");
}

export function calculateDistance(x: number, y: number, rect: DOMRect) {
  const dx = Math.max(rect.left - x, 0, x - rect.right);
  const dy = Math.max(rect.top - y, 0, y - rect.bottom);
  return Math.sqrt(dx * dx + dy * dy);
}

export const isElementParentIsMenu = (element: HTMLElement): boolean => {
  const parent = element.parentElement;
  if (parent) {
    if (parent.id === MENU) {
      return true;
    }
    return isElementParentIsMenu(parent);
  }
  return false;
};

export const isElementMenu = (element: HTMLElement) => {
  return element.id === MENU;
};

export const isElementMenuContainer = (element: HTMLElement) => {
  return element.id === MENU_CONTAINER;
};

export const isElementParentMenuContainer = (element: HTMLElement): boolean => {
  const parent = element.parentElement;
  if (parent) {
    if (parent.id === MENU_CONTAINER) {
      return true;
    }
    return isElementParentMenuContainer(parent);
  }
  return false;
};

export const isElementMenuGrabButton = (element: HTMLElement) => {
  return element.id === MENU_DRAG;
};

export const isElementParentIsMenuGrabButton = (
  element: HTMLElement
): boolean => {
  const parent = element.parentElement;
  if (parent) {
    if (parent.id === MENU_DRAG) {
      return true;
    }
    return isElementParentIsMenuGrabButton(parent);
  }
  return false;
};

export const removeElement = (element: HTMLElement) => {
  if (element.parentNode) {
    element.parentNode.removeChild(element);
  }
};
