import { describe, it, expect } from 'vitest';
import { collectFutureProofRecommendations } from '../metrics/remediation-utils';

describe('Remediation Utils', () => {
  it('should collect recommendations from all dimensions', () => {
    const params: any = {
      cognitiveLoad: { score: 50, rating: 'moderate' },
      patternEntropy: {
        recommendations: ['Consolidate dirs'],
        rating: 'moderate',
      },
      conceptCohesion: { rating: 'poor' },
      aiSignalClarity: {
        recommendations: ['Fix magic literals'],
        rating: 'high',
      },
      agentGrounding: { recommendations: ['Add README'], rating: 'poor' },
      testability: {
        recommendations: ['Add tests'],
        aiChangeSafetyRating: 'blind-risk',
        rating: 'poor',
      },
    };

    const recs = collectFutureProofRecommendations(params);

    const actions = recs.map((r) => r.action);
    expect(actions).toContain('Consolidate dirs');
    expect(actions).toContain('Fix magic literals');
    expect(actions).toContain('Add README');
    expect(actions).toContain('Add tests');
    expect(actions).toContain(
      'Improve concept cohesion by grouping related exports'
    );

    // Check prioritization
    const addTests = recs.find((r) => r.action === 'Add tests');
    expect(addTests?.priority).toBe('high');
  });
});
