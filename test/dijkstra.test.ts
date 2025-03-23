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
  });
});
