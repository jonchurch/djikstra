import { MinHeap } from './minHeap.js';

interface GraphNode {
  [neighbor: string]: number;
}

interface Graph {
  [node: string]: GraphNode;
}

/**
 * Represents the result of a successful path finding operation
 */
interface ReachableResult {
  status: 'reachable';
  path: string[];
  distance: number;
}

/**
 * Represents the result when no path exists to the destination
 */
interface UnreachableResult {
  status: 'unreachable';
}

/**
 * Discriminated union type for path finding results
 */
type PathResult = ReachableResult | UnreachableResult;

class Djikstra {
  /**
   * Finds the shortest path between source and destination nodes.
   * @param graph The graph represented as an adjacency list.
   * @param source The source node ID.
   * @param destination The destination node ID.
   * @returns A PathResult object that indicates whether the destination is reachable.
   *          If reachable, includes the path and total distance.
   * @throws Only if the source node doesn't exist in the graph.
   */
  findShortestPath(graph: Graph, source: string, destination: string): PathResult {
    // Validate inputs
    if (!graph[source]) {
      throw new Error(`Source node "${source}" does not exist in the graph.`);
    }

    const distances: Record<string, number> = {};
    const predecessors: Record<string, string> = {};
    const visited = new Set<string>();

    // Initialize distances
    for (const node in graph) {
      distances[node] = node === source ? 0 : Infinity;
    }

    // Priority queue for nodes to visit
    const queue = new MinHeap<{ node: string; distance: number }>(
      (a: { node: string; distance: number }, b: { node: string; distance: number }) => a.distance - b.distance
    );

    queue.push({ node: source, distance: 0 });

    while (!queue.isEmpty()) {
      const current = queue.pop();
      if (!current) break;

      const { node: currentNode, distance: currentDistance } = current;

      // Skip if we've processed this node already or found a shorter path
      if (visited.has(currentNode) || currentDistance > distances[currentNode]) {
        continue;
      }

      // Mark as visited
      visited.add(currentNode);

      // If we reached the destination, we can stop
      if (currentNode === destination) {
        break;
      }

      // Check all neighbors
      const neighbors = graph[currentNode] || {};
      for (const neighbor in neighbors) {
        if (visited.has(neighbor)) continue;

        const edgeWeight = neighbors[neighbor];
        const totalDistance = currentDistance + edgeWeight;

        // If we found a shorter path to this neighbor
        if (totalDistance < distances[neighbor]) {
          distances[neighbor] = totalDistance;
          predecessors[neighbor] = currentNode;
          queue.push({ node: neighbor, distance: totalDistance });
        }
      }
    }

    // Check if destination is reachable
    if (distances[destination] === Infinity) {
      return { status: 'unreachable' };
    }

    // Reconstruct the path
    const path = this.reconstructPath(predecessors, destination);

    return {
      status: 'reachable',
      path,
      distance: distances[destination],
    };
  }

  /**
   * Reconstructs the path from source to destination using the predecessor map.
   * @param predecessors Map of nodes to their predecessors.
   * @param destination The destination node.
   * @returns Array of nodes from source to destination.
   */
  private reconstructPath(predecessors: Record<string, string>, destination: string): string[] {
    const path: string[] = [destination];
    let current = destination;

    while (predecessors[current]) {
      current = predecessors[current];
      path.unshift(current);
    }

    return path;
  }

  /**
   * Computes shortest paths from a source to all reachable nodes.
   * @param graph The graph represented as an adjacency list.
   * @param source The source node ID.
   * @returns Map of nodes to their distances from the source.
   */
  computeAllPaths(graph: Graph, source: string): Record<string, number> {
    const result = this.computeDistancesAndPaths(graph, source);
    return result.distances;
  }

  /**
   * Computes both distances and paths from a source to all reachable nodes.
   * @param graph The graph represented as an adjacency list.
   * @param source The source node ID.
   * @returns Object containing distances and predecessors.
   */
  computeDistancesAndPaths(
    graph: Graph,
    source: string
  ): { distances: Record<string, number>; predecessors: Record<string, string> } {
    if (!graph[source]) {
      throw new Error(`Source node "${source}" does not exist in the graph.`);
    }

    const distances: Record<string, number> = {};
    const predecessors: Record<string, string> = {};
    const visited = new Set<string>();

    // Initialize distances
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

      const neighbors = graph[currentNode] || {};
      for (const neighbor in neighbors) {
        if (visited.has(neighbor)) continue;

        const edgeWeight = neighbors[neighbor];
        const totalDistance = currentDistance + edgeWeight;

        if (totalDistance < distances[neighbor]) {
          distances[neighbor] = totalDistance;
          predecessors[neighbor] = currentNode;
          queue.push({ node: neighbor, distance: totalDistance });
        }
      }
    }

    return { distances, predecessors };
  }
}

export default Djikstra;
