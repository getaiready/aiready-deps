import {
  calculateDocDrift,
  ToolName,
  buildStandardToolScore,
} from '@aiready/core';
import type { ToolScoringOutput } from '@aiready/core';
import type { DocDriftReport } from './types';

/**
 * Convert doc-drift report into a standardized ToolScoringOutput.
 *
 * @param report - The detailed doc-drift report including raw metrics.
 * @returns Standardized scoring and risk factor breakdown.
 * @lastUpdated 2026-03-24
 */
export function calculateDocDriftScore(
  report: DocDriftReport
): ToolScoringOutput {
  const { rawData, summary } = report;

  // Recalculate using core math to get risk contribution breakdown
  const riskResult = calculateDocDrift({
    uncommentedExports: rawData.uncommentedExports,
    totalExports: rawData.totalExports,
    outdatedComments: rawData.outdatedComments,
    undocumentedComplexity: rawData.undocumentedComplexity,
    actualDrift: rawData.actualDrift,
  });

  return buildStandardToolScore({
    toolName: ToolName.DocDrift,
    score: summary.score,
    rawData,
    dimensions: riskResult.dimensions,
    dimensionNames: {
      undocumentedComplexityScore: 'Undocumented Complexity',
      outdatedCommentsScore: 'Outdated/Incomplete Comments',
      uncommentedExportsScore: 'Uncommented Exports',
    },
    recommendations: riskResult.recommendations,
    rating: summary.rating,
  });
}
