# Djikstra

A TypeScript implementation of Dijkstra's algorithm for finding shortest paths in graphs.

![npm](https://img.shields.io/npm/v/djikstra)
![Tests](https://github.com/jonchurch/djikstra/workflows/Tests/badge.svg)
![Coverage](https://img.shields.io/codecov/c/github/jonchurch/djikstra)

## Installation

```bash
npm install djikstra
```

## Usage

```typescript
import Djikstra from 'djikstra';

// Create a graph as an adjacency list
const graph = {
  A: { B: 5, C: 2 },
  B: { A: 5, D: 1 },
  C: { A: 2, D: 6 },
  D: { B: 1, C: 6, E: 2 },
  E: { D: 2 },
};

const pathfinder = new Djikstra();

// Find shortest path between two nodes
const result = pathfinder.findShortestPath(graph, 'A', 'E');

if (result.status === 'reachable') {
  console.log(`Path found: ${result.path.join(' → ')}`);
  console.log(`Total distance: ${result.distance}`);
} else {
  console.log('No path exists to the destination');
}

// Compute distances to all nodes
const allDistances = pathfinder.computeAllPaths(graph, 'A');
console.log(allDistances);
// Output: { A: 0, B: 5, C: 2, D: 6, E: 8 }

// Compute both distances and paths
const fullResult = pathfinder.computeDistancesAndPaths(graph, 'A');
console.log(fullResult);
// Output: {
//   distances: { A: 0, B: 5, C: 2, D: 6, E: 8 },
//   predecessors: { B: 'A', C: 'A', D: 'B', E: 'D' }
// }
```

## Algorithm Implementation

This library implements Dijkstra's algorithm using a binary min-heap priority queue for performance optimization. Here's what you should know about our implementation:

### Approach

- **Standard Algorithm**: The implementation follows the classic Dijkstra's algorithm but uses modern data structures
- **Priority Queue**: Uses a binary min-heap for efficient extraction of the node with the smallest distance
- **Lazy Updates**: Implements "lazy deletion" approach that allows duplicate nodes in the queue but skips already processed ones
- **Early Termination**: Stops when the destination is reached (for single-path finding)

### Performance Characteristics

- **Time Complexity**: O(E log V) where V is the number of vertices and E is the number of edges
- **Space Complexity**: O(V) for storing distances, predecessors, and the priority queue

### Tradeoffs

- **Heap vs. Fibonacci Heap**: Uses a binary heap (O(log V) operations) instead of a Fibonacci heap (theoretically faster at O(1) decrease-key) for better real-world performance and implementation simplicity
- **Specialized vs. General**: Focuses on path finding rather than implementing a general-purpose graph library
- **Memory vs. Speed**: Prioritizes speed with the priority queue approach over memory efficiency

## Creating your own graph

Graphs are represented as adjacency lists using plain JavaScript objects:

```typescript
// Graph structure
interface Graph {
  [node: string]: {
    [neighbor: string]: number
  }
}
```

Each key in the outer object represents a node in the graph. The value is another object where:
- Keys are the IDs of neighboring nodes
- Values are the edge weights (distances) to those neighbors

Example for a road network:

```typescript
const roadNetwork = {
  // Each city with its connections
  "NewYork": {
    "Boston": 215,      // Distance in miles
    "Philadelphia": 95
  },
  "Boston": {
    "NewYork": 215,
    "Portland": 112
  },
  "Philadelphia": {
    "NewYork": 95,
    "Washington": 140
  },
  "Portland": {
    "Boston": 112
  },
  "Washington": {
    "Philadelphia": 140
  }
};
```

For a weighted graph:
- Include an edge in both directions if travel is allowed both ways
- Use different weights for each direction if costs differ (like uphill vs. downhill)
- Omit connections that aren't possible

## API Reference

The Dijkstra class provides three main methods for pathfinding:

### findShortestPath

```typescript
findShortestPath(graph: Graph, source: string, destination: string): PathResult
```

Calculates the shortest path between two nodes in a graph.

| Parameter    | Type   | Description |
|--------------|--------|-------------|
| graph        | Graph  | The graph represented as an adjacency list |
| source       | string | The starting node ID |
| destination  | string | The target node ID |

**Returns:** A discriminated union with either reachable or unreachable status
```typescript
type PathResult = 
  | { status: 'reachable'; path: string[]; distance: number }
  | { status: 'unreachable' }
```

**Throws:** Error only if the source node doesn't exist in the graph

---

### computeAllPaths

```typescript
computeAllPaths(graph: Graph, source: string): Record<string, number>
```

Computes the shortest distance from a source to all reachable nodes.

| Parameter | Type   | Description |
|-----------|--------|-------------|
| graph     | Graph  | The graph represented as an adjacency list |
| source    | string | The starting node ID |

**Returns:** An object mapping each node ID to its distance from the source

---

### computeDistancesAndPaths

```typescript
computeDistancesAndPaths(
  graph: Graph, 
  source: string
): { 
  distances: Record<string, number>; 
  predecessors: Record<string, string> 
}
```

Provides complete pathfinding information from a source to all nodes.

| Parameter | Type   | Description |
|-----------|--------|-------------|
| graph     | Graph  | The graph represented as an adjacency list |
| source    | string | The starting node ID |

**Returns:** 
- `distances`: Maps each node ID to its shortest distance from source
- `predecessors`: Maps each node ID to its predecessor in the shortest path

**Note:** Use the `predecessors` map to reconstruct the full path to any node

## License

ISC
