import { describe, it, expect } from 'vitest';
import {
  calculatePatternEntropy,
  calculateConceptCohesion,
} from '../metrics/structural-metrics';

describe('Structural Metrics', () => {
  describe('calculatePatternEntropy', () => {
    it('should calculate low entropy for localized files', () => {
      const files = [
        { path: 'src/auth/a.ts', domain: 'auth' },
        { path: 'src/auth/b.ts', domain: 'auth' },
        { path: 'src/auth/c.ts', domain: 'auth' },
      ];
      const result = calculatePatternEntropy(files);
      expect(result.entropy).toBe(0);
      expect(result.rating).toBe('crystalline');
    });

    it('should calculate high entropy for scattered files', () => {
      const files = [
        { path: 'src/auth/a.ts', domain: 'auth' },
        { path: 'src/utils/b.ts', domain: 'auth' },
        { path: 'lib/c.ts', domain: 'auth' },
      ];
      const result = calculatePatternEntropy(files);
      expect(result.entropy).toBeGreaterThan(0.5);
      expect(['fragmented', 'chaotic']).toContain(result.rating);
    });
  });

  describe('calculateConceptCohesion', () => {
    it('should calculate high cohesion for single-domain exports', () => {
      const exports = [
        { name: 'login', inferredDomain: 'auth' },
        { name: 'logout', inferredDomain: 'auth' },
      ];
      const result = calculateConceptCohesion({ exports });
      expect(result.score).toBe(1);
      expect(result.rating).toBe('excellent');
    });

    it('should calculate low cohesion for mixed-domain exports', () => {
      const exports = [
        { name: 'login', inferredDomain: 'auth' },
        { name: 'getUser', inferredDomain: 'user' },
        { name: 'formatDate', inferredDomain: 'utils' },
      ];
      const result = calculateConceptCohesion({ exports });
      expect(result.score).toBeLessThan(0.6);
      expect(['moderate', 'poor']).toContain(result.rating);
    });
  });
});
