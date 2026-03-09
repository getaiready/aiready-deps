import { describe, it, expect } from 'vitest';
import { calculateSemanticDistance } from '../metrics/semantic-distance';

describe('Semantic Distance Metric', () => {
  it('should calculate low distance for same domain', () => {
    const result = calculateSemanticDistance({
      file1: 'a.ts',
      file2: 'b.ts',
      file1Domain: 'auth',
      file2Domain: 'auth',
      file1Imports: ['lib'],
      file2Imports: ['lib'],
      sharedDependencies: ['lib'],
    });

    expect(result.distance).toBeLessThan(0.3);
    expect(result.relationship).toBe('same-domain');
  });

  it('should calculate high distance for unrelated files', () => {
    const result = calculateSemanticDistance({
      file1: 'a.ts',
      file2: 'z.ts',
      file1Domain: 'auth',
      file2Domain: 'billing',
      file1Imports: ['a'],
      file2Imports: ['b'],
      sharedDependencies: [],
    });

    expect(result.distance).toBeGreaterThan(0.7);
    expect(result.relationship).toBe('unrelated');
  });
});
