import {
  calculateDependencyHealth,
  ToolName,
  buildStandardToolScore,
} from '@aiready/core';
import type { ToolScoringOutput } from '@aiready/core';
import type { DepsReport } from './types';

/**
 * Convert dependency health report into a ToolScoringOutput.
 */
export function calculateDepsScore(report: DepsReport): ToolScoringOutput {
  const { rawData, summary } = report;

  // Recalculate using core math to get risk contribution breakdown
  const riskResult = calculateDependencyHealth({
    totalPackages: rawData.totalPackages,
    outdatedPackages: rawData.outdatedPackages,
    deprecatedPackages: rawData.deprecatedPackages,
    trainingCutoffSkew: rawData.trainingCutoffSkew,
  });

  return buildStandardToolScore({
    toolName: ToolName.DependencyHealth,
    score: summary.score,
    rawData,
    dimensions: riskResult.dimensions,
    dimensionNames: {
      outdatedScore: 'Outdated Packages',
      deprecatedScore: 'Deprecated Packages',
      skewScore: 'Training Cutoff Skew',
    },
    recommendations: riskResult.recommendations,
    rating: summary.rating,
  });
}
