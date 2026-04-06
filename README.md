# Djikstra

A TypeScript implementation of Dijkstra's algorithm for finding shortest paths in graphs.

![npm](https://img.shields.io/npm/v/djikstra)
![Tests](https://github.com/jonchurch/djikstra/workflows/Tests/badge.svg)

## Installation

```bash
npm install djikstra
```

## Usage

```typescript
import { findShortestPath } from 'djikstra';

const graph = {
  A: { B: 5, C: 2 },
  B: { A: 5, D: 1 },
  C: { A: 2, D: 6 },
  D: { B: 1, C: 6, E: 2 },
  E: { D: 2 },
};

const result = findShortestPath(graph, 'A', 'E');

if (result.status === 'reachable') {
  console.log(result.path);     // ['A', 'B', 'D', 'E']
  console.log(result.distance); // 8
}
```

## Implementation

Uses a binary min-heap priority queue for O(E log V) performance. Single-target queries terminate early when the destination is reached.

## Graph Format

Graphs are adjacency lists as plain objects. **Edges are directional** — if you want to travel both ways, add both directions:

```typescript
const roadNetwork = {
  "NewYork":      { "Boston": 215, "Philadelphia": 95 },
  "Boston":       { "NewYork": 215, "Portland": 112 },
  "Philadelphia": { "NewYork": 95, "Washington": 140 },
  "Portland":     { "Boston": 112 },
  "Washington":   { "Philadelphia": 140 }
};
```

Each key is a node, each value maps neighbors to edge weights. Weights can differ by direction (e.g. uphill vs downhill).

## Errors

The library throws on invalid input rather than returning silently wrong results:

| Condition | Error |
|-----------|-------|
| Source node not in graph | `Source node "X" does not exist in the graph.` |
| Destination node not in graph (not even as a neighbor) | `Destination node "X" does not exist in the graph.` |
| Negative, NaN, or Infinity edge weight | `Invalid edge weight ... Weights must be finite and non-negative.` |

If source and destination are valid but no path exists, `findShortestPath` returns `{ status: 'unreachable' }` instead of throwing.

## API Reference

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

**Throws:** See [Errors](#errors)

---

### computeAllPaths

```typescript
computeAllPaths(graph: Graph, source: string): Record<string, number>
```

Computes the shortest distance from a source to all nodes in the graph, including `Infinity` for unreachable ones.

| Parameter | Type   | Description |
|-----------|--------|-------------|
| graph     | Graph  | The graph represented as an adjacency list |
| source    | string | The starting node ID |

**Returns:** An object mapping each node ID to its shortest distance from the source (`Infinity` for unreachable nodes)

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
