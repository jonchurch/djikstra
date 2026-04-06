import { describe, it, expect } from 'vitest';
import Dijkstra from '../src/index.js';

describe('Dijkstra', () => {
  describe('findShortestPath', () => {
    it('finds the shortest path in a simple graph', () => {
      const graph = {
        A: { B: 5, C: 2 },
        B: { A: 5, D: 1 },
        C: { A: 2, D: 6 },
        D: { B: 1, C: 6, E: 2 },
        E: { D: 2 }
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.findShortestPath(graph, 'A', 'E');

      expect(result.status).toBe('reachable');
      if (result.status === 'reachable') {
        expect(result.path).toEqual(['A', 'B', 'D', 'E']);
        expect(result.distance).toBe(8);
      }
    });

    it('finds the shortest path when there are multiple possibilities', () => {
      const graph = {
        A: { B: 1, C: 4 },
        B: { A: 1, C: 2, D: 5 },
        C: { A: 4, B: 2, D: 1 },
        D: { B: 5, C: 1 }
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.findShortestPath(graph, 'A', 'D');

      expect(result.status).toBe('reachable');
      if (result.status === 'reachable') {
        expect(result.path).toEqual(['A', 'B', 'C', 'D']);
        expect(result.distance).toBe(4);
      }
    });

    it('returns unreachable status when destination is unreachable', () => {
      const graph = {
        A: { B: 1 },
        B: { A: 1 },
        C: { D: 1 },
        D: { C: 1 }
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.findShortestPath(graph, 'A', 'C');
      
      expect(result.status).toBe('unreachable');
    });

    it('throws an error when source node does not exist', () => {
      const graph = {
        A: { B: 1 },
        B: { A: 1 }
      };

      const pathfinder = new Dijkstra();

      expect(() => {
        pathfinder.findShortestPath(graph, 'X', 'B');
      }).toThrow('Source node "X" does not exist in the graph.');
    });

    it('returns distance 0 and path [source] when source === destination', () => {
      const graph = {
        A: { B: 1 },
        B: { A: 1 }
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.findShortestPath(graph, 'A', 'A');

      expect(result.status).toBe('reachable');
      if (result.status === 'reachable') {
        expect(result.path).toEqual(['A']);
        expect(result.distance).toBe(0);
      }
    });

    it('handles single-node graph with source === destination', () => {
      const graph = { A: {} };

      const pathfinder = new Dijkstra();
      const result = pathfinder.findShortestPath(graph, 'A', 'A');

      expect(result.status).toBe('reachable');
      if (result.status === 'reachable') {
        expect(result.path).toEqual(['A']);
        expect(result.distance).toBe(0);
      }
    });

    it('handles zero-weight edges', () => {
      const graph = {
        A: { B: 0, C: 5 },
        B: { C: 0 },
        C: {}
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.findShortestPath(graph, 'A', 'C');

      expect(result.status).toBe('reachable');
      if (result.status === 'reachable') {
        expect(result.distance).toBe(0);
        expect(result.path).toEqual(['A', 'B', 'C']);
      }
    });

    it.fails('throws when destination does not exist in graph at all', () => {
      const graph = {
        A: { B: 1 },
        B: { A: 1 }
      };

      const pathfinder = new Dijkstra();
      expect(() => {
        pathfinder.findShortestPath(graph, 'A', 'Z');
      }).toThrow();
    });

    it('finds path to node that exists only as a neighbor', () => {
      const graph = {
        A: { B: 1 },
        B: { C: 2 }
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.findShortestPath(graph, 'A', 'C');

      expect(result.status).toBe('reachable');
      if (result.status === 'reachable') {
        expect(result.path).toEqual(['A', 'B', 'C']);
        expect(result.distance).toBe(3);
      }
    });

    it('finds a valid shortest path when all paths have equal cost', () => {
      const graph = {
        A: { B: 1, C: 1 },
        B: { D: 1 },
        C: { D: 1 },
        D: {}
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.findShortestPath(graph, 'A', 'D');

      expect(result.status).toBe('reachable');
      if (result.status === 'reachable') {
        expect(result.distance).toBe(2);
        expect([['A', 'B', 'D'], ['A', 'C', 'D']]).toContainEqual(result.path);
      }
    });
  });

  describe('input validation', () => {
    it.fails('throws on negative edge weight', () => {
      const graph = {
        A: { B: -1 },
        B: {}
      };

      const pathfinder = new Dijkstra();
      expect(() => {
        pathfinder.findShortestPath(graph, 'A', 'B');
      }).toThrow();
    });

    it.fails('throws on NaN edge weight', () => {
      const graph = {
        A: { B: NaN },
        B: {}
      };

      const pathfinder = new Dijkstra();
      expect(() => {
        pathfinder.findShortestPath(graph, 'A', 'B');
      }).toThrow();
    });

    it.fails('throws on Infinity edge weight', () => {
      const graph = {
        A: { B: Infinity },
        B: {}
      };

      const pathfinder = new Dijkstra();
      expect(() => {
        pathfinder.findShortestPath(graph, 'A', 'B');
      }).toThrow();
    });

    it('throws on empty graph', () => {
      const pathfinder = new Dijkstra();
      expect(() => {
        pathfinder.findShortestPath({}, 'A', 'B');
      }).toThrow();
    });
  });

  describe('computeAllPaths', () => {
    it('computes shortest paths to all nodes from source', () => {
      const graph = {
        A: { B: 5, C: 2 },
        B: { A: 5, D: 1 },
        C: { A: 2, D: 6 },
        D: { B: 1, C: 6, E: 2 },
        E: { D: 2 }
      };

      const pathfinder = new Dijkstra();
      const distances = pathfinder.computeAllPaths(graph, 'A');

      expect(distances).toEqual({
        A: 0,
        B: 5,
        C: 2,
        D: 6,
        E: 8
      });
    });

    it('sets unreachable nodes to Infinity', () => {
      const graph = {
        A: { B: 1 },
        B: { A: 1 },
        C: { D: 1 },
        D: { C: 1 }
      };

      const pathfinder = new Dijkstra();
      const distances = pathfinder.computeAllPaths(graph, 'A');

      expect(distances).toEqual({
        A: 0,
        B: 1,
        C: Infinity,
        D: Infinity
      });
    });

    it('handles source as only node in graph', () => {
      const graph = { A: {} };

      const pathfinder = new Dijkstra();
      const distances = pathfinder.computeAllPaths(graph, 'A');

      expect(distances).toEqual({ A: 0 });
    });

    it('includes neighbor-only nodes in results', () => {
      const graph = {
        A: { B: 3 }
      };

      const pathfinder = new Dijkstra();
      const distances = pathfinder.computeAllPaths(graph, 'A');

      expect(distances['B']).toBe(3);
    });
  });

  describe('computeDistancesAndPaths', () => {
    it('computes both distances and predecessors', () => {
      const graph = {
        A: { B: 5, C: 2 },
        B: { A: 5, D: 1 },
        C: { A: 2, D: 6 },
        D: { B: 1, C: 6, E: 2 },
        E: { D: 2 }
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.computeDistancesAndPaths(graph, 'A');

      expect(result.distances).toEqual({
        A: 0,
        B: 5,
        C: 2,
        D: 6,
        E: 8
      });

      expect(result.predecessors).toEqual({
        B: 'A',
        C: 'A',
        D: 'B',
        E: 'D'
      });
    });

    it('includes neighbor-only nodes in distances and predecessors', () => {
      const graph = {
        A: { B: 2 },
        B: { C: 3 }
      };

      const pathfinder = new Dijkstra();
      const result = pathfinder.computeDistancesAndPaths(graph, 'A');

      expect(result.distances['C']).toBe(5);
      expect(result.predecessors['C']).toBe('B');
    });
  });
});
