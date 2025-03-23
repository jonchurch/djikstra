import { describe, it, expect } from 'vitest';
import { MinHeap } from '../src/minHeap.js';

describe('MinHeap', () => {
  it('creates an empty heap', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    expect(heap.isEmpty()).toBe(true);
    expect(heap.size()).toBe(0);
    expect(heap.peek()).toBeUndefined();
  });

  it('adds items and maintains min-heap property', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    
    heap.push(5);
    heap.push(3);
    heap.push(8);
    heap.push(1);
    heap.push(2);
    
    expect(heap.isEmpty()).toBe(false);
    expect(heap.size()).toBe(5);
    expect(heap.peek()).toBe(1);
  });

  it('pops items in priority order', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    
    const values = [5, 3, 8, 1, 2];
    values.forEach(v => heap.push(v));
    
    const result = [];
    while (!heap.isEmpty()) {
      result.push(heap.pop());
    }
    
    expect(result).toEqual([1, 2, 3, 5, 8]);
    expect(heap.isEmpty()).toBe(true);
    expect(heap.peek()).toBeUndefined();
  });

  it('handles custom objects with a comparison function', () => {
    type Task = { id: string; priority: number };
    
    const heap = new MinHeap<Task>((a, b) => a.priority - b.priority);
    
    heap.push({ id: 'task1', priority: 3 });
    heap.push({ id: 'task2', priority: 1 });
    heap.push({ id: 'task3', priority: 5 });
    heap.push({ id: 'task4', priority: 2 });
    
    expect(heap.peek()?.id).toBe('task2');
    
    const result = [];
    while (!heap.isEmpty()) {
      result.push(heap.pop()?.id);
    }
    
    expect(result).toEqual(['task2', 'task4', 'task1', 'task3']);
  });

  it('returns undefined when popping from an empty heap', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    expect(heap.pop()).toBeUndefined();
  });

  it('handles duplicate values correctly', () => {
    const heap = new MinHeap<number>((a, b) => a - b);
    
    heap.push(5);
    heap.push(3);
    heap.push(3);
    heap.push(5);
    
    expect(heap.size()).toBe(4);
    expect(heap.pop()).toBe(3);
    expect(heap.pop()).toBe(3);
    expect(heap.pop()).toBe(5);
    expect(heap.pop()).toBe(5);
    expect(heap.isEmpty()).toBe(true);
  });
});