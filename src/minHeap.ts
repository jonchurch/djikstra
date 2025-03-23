/**
 * A binary min-heap-based priority queue.
 */
export class MinHeap<T> {
  private data: T[];
  private compare: (a: T, b: T) => number;

  /**
   * Creates a new MinHeap.
   * @param compareFn A comparison function to determine priority.
   */
  constructor(compareFn: (a: T, b: T) => number) {
    this.data = [];
    this.compare = compareFn;
  }

  /**
   * Inserts an item into the heap.
   * @param item The item to insert.
   */
  push(item: T): void {
    this.data.push(item);
    this.bubbleUp(this.data.length - 1);
  }

  /**
   * Removes and returns the item with the highest priority (lowest cost).
   * @returns The item with the highest priority, or undefined if the heap is empty.
   */
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

  /**
   * Returns the highest priority item without removing it.
   * @returns The highest priority item, or undefined if the heap is empty.
   */
  peek(): T | undefined {
    return this.data[0];
  }

  /**
   * Returns the current size of the heap.
   * @returns Number of elements in the heap.
   */
  size(): number {
    return this.data.length;
  }

  /**
   * Checks if the heap is empty.
   * @returns True if the heap is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.data.length === 0;
  }

  /**
   * Restores heap order by bubbling up the item at the given index.
   * @param index The index of the item to bubble up.
   */
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

  /**
   * Restores heap order by bubbling down the item at the given index.
   * @param index The index of the item to bubble down.
   */
  private bubbleDown(index: number): void {
    const length = this.data.length;
    const item = this.data[index];

    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallestIndex = index;

      if (
        leftChildIndex < length &&
        this.compare(this.data[leftChildIndex], this.data[smallestIndex]) < 0
      ) {
        smallestIndex = leftChildIndex;
      }

      if (
        rightChildIndex < length &&
        this.compare(this.data[rightChildIndex], this.data[smallestIndex]) < 0
      ) {
        smallestIndex = rightChildIndex;
      }

      if (smallestIndex === index) break;

      this.data[index] = this.data[smallestIndex];
      index = smallestIndex;
    }

    this.data[index] = item;
  }
}
