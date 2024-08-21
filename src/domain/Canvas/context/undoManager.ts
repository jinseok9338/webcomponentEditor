export class UndoManager<T = any> {
  private undoStack: T[] = [];
  private redoStack: T[] = [];

  addAction(action: T): void {
    this.undoStack.push(action);
    this.redoStack = [];
  }

  // Undo the last action
  undo(): T | undefined {
    if (this.undoStack.length === 0) {
      return undefined;
    }
    const action = this.undoStack.pop();
    if (action !== undefined) {
      this.redoStack.push(action);
    }
    return action;
  }

  // Redo the last undone action
  redo(): T | undefined {
    if (this.redoStack.length === 0) {
      return undefined;
    }
    const action = this.redoStack.pop();
    if (action !== undefined) {
      this.undoStack.push(action);
    }
    return action;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  clear(): void {
    this.undoStack = [];
    this.redoStack = [];
  }
}
