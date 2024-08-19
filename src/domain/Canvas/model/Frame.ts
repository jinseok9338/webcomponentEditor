export class Frame {
  id: number;
  content_id: number;
  position: number;
  parentId: number | null;

  // if the inner frame is not null, it means that the frame is a nested frame and has no children

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

// Define a new type that includes children
export interface FrameWithChildren extends Frame {
  children?: FrameWithChildren[];
}
