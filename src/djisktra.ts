import { MinHeap } from './minHeap.js';

interface GraphNode {
  [neighbor: string]: number;
}

interface Graph {
  [node: string]: GraphNode;
}

interface ReachableResult {
  status: 'reachable';
  path: string[];
  distance: number;
}

interface UnreachableResult {
  status: 'unreachable';
}

type PathResult = ReachableResult | UnreachableResult;

function validateGraph(graph: Graph, source: string, destination?: string): void {
  if (!graph[source]) {
    throw new Error(`Source node "${source}" does not exist in the graph.`);
  }

  for (const node in graph) {
    for (const neighbor in graph[node]) {
      const weight = graph[node][neighbor];
      if (!Number.isFinite(weight) || weight < 0) {
        throw new Error(`Invalid edge weight ${weight} on edge ${node} -> ${neighbor}. Weights must be finite and non-negative.`);
      }
    }
  }

  if (destination !== undefined) {
    const allNodes = new Set(Object.keys(graph));
    for (const node in graph) {
      for (const neighbor in graph[node]) {
        allNodes.add(neighbor);
      }
    }
    if (!allNodes.has(destination)) {
      throw new Error(`Destination node "${destination}" does not exist in the graph.`);
    }
  }
}

function runDijkstra(
  graph: Graph,
  source: string,
  earlyStop?: string
): { distances: Record<string, number>; predecessors: Record<string, string> } {
  const distances: Record<string, number> = {};
  const predecessors: Record<string, string> = {};
  const visited = new Set<string>();

  for (const node in graph) {
    distances[node] = node === source ? 0 : Infinity;
  }

  const queue = new MinHeap<{ node: string; distance: number }>(
    (a: { node: string; distance: number }, b: { node: string; distance: number }) => a.distance - b.distance
  );

  queue.push({ node: source, distance: 0 });

  while (!queue.isEmpty()) {
    const current = queue.pop();
    if (!current) break;

    const { node: currentNode, distance: currentDistance } = current;

    if (visited.has(currentNode) || currentDistance > distances[currentNode]) {
      continue;
    }

    visited.add(currentNode);

    if (earlyStop !== undefined && currentNode === earlyStop) {
      break;
    }

    const neighbors = graph[currentNode] || {};
    for (const neighbor in neighbors) {
      if (visited.has(neighbor)) continue;

      const edgeWeight = neighbors[neighbor];
      const totalDistance = currentDistance + edgeWeight;

      if (totalDistance < (distances[neighbor] ?? Infinity)) {
        distances[neighbor] = totalDistance;
        predecessors[neighbor] = currentNode;
        queue.push({ node: neighbor, distance: totalDistance });
      }
    }
  }

  return { distances, predecessors };
}

function reconstructPath(predecessors: Record<string, string>, destination: string): string[] {
  const path: string[] = [destination];
  let current = destination;

  while (predecessors[current]) {
    current = predecessors[current];
    path.push(current);
  }

  return path.reverse();
}

export function findShortestPath(graph: Graph, source: string, destination: string): PathResult {
  validateGraph(graph, source, destination);

  const { distances, predecessors } = runDijkstra(graph, source, destination);

  if (distances[destination] === undefined || distances[destination] === Infinity) {
    return { status: 'unreachable' };
  }

  return {
    status: 'reachable',
    path: reconstructPath(predecessors, destination),
    distance: distances[destination],
  };
}

export function computeAllPaths(graph: Graph, source: string): Record<string, number> {
  return computeDistancesAndPaths(graph, source).distances;
}

export function computeDistancesAndPaths(
  graph: Graph,
  source: string
): { distances: Record<string, number>; predecessors: Record<string, string> } {
  validateGraph(graph, source);
  return runDijkstra(graph, source);
}

export type { Graph, GraphNode, PathResult, ReachableResult, UnreachableResult };
