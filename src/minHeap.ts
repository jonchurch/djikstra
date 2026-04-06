export class MinHeap<T> {
  private data: T[];
  private compare: (a: T, b: T) => number;

  constructor(compareFn: (a: T, b: T) => number) {
    this.data = [];
    this.compare = compareFn;
  }

  push(item: T): void {
    this.data.push(item);
    this.bubbleUp(this.data.length - 1);
  }

  pop(): T | undefined {
    if (this.data.length === 0) return undefined;

    const top = this.data[0];
    const bottom = this.data.pop();

    if (this.data.length > 0 && bottom !== undefined) {
      this.data[0] = bottom;
      this.bubbleDown(0);
    }

    return top;
  }

  peek(): T | undefined {
    return this.data[0];
  }

  size(): number {
    return this.data.length;
  }

  isEmpty(): boolean {
    return this.data.length === 0;
  }

  private bubbleUp(index: number): void {
    const item = this.data[index];
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.compare(item, this.data[parentIndex]) >= 0) break;
      this.data[index] = this.data[parentIndex];
      index = parentIndex;
    }
    this.data[index] = item;
  }

  private bubbleDown(index: number): void {
    const length = this.data.length;
    const item = this.data[index];

    while (true) {
      const leftChild = 2 * index + 1;
      if (leftChild >= length) break;

      const rightChild = 2 * index + 2;
      const smallest = rightChild < length && this.compare(this.data[rightChild], this.data[leftChild]) < 0
        ? rightChild
        : leftChild;

      if (this.compare(item, this.data[smallest]) <= 0) break;

      this.data[index] = this.data[smallest];
      index = smallest;
    }

    this.data[index] = item;
  }
}
