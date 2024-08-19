export class Component {
  // this is used to map to the content of the frame
  id: number;
  name: string;
  content: {
    tag: string;
    attrs?: Record<string, string>;
    text?: string | null;
  };

  constructor(
    id: number,
    name: string,
    content: {
      tag: string;
      attrs?: Record<string, string>;
      text?: string | null;
    }
  ) {
    this.id = id;
    this.content = content;
    this.name = name;
  }

  changeName(name: string) {
    this.name = name;
  }
}
