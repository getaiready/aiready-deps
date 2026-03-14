import {
  ToolProvider,
  ToolName,
  SpokeOutput,
  ScanOptions,
  ToolScoringOutput,
  SpokeOutputSchema,
  groupIssuesByFile,
  buildSimpleProviderScore,
} from '@aiready/core';
import { analyzeDocDrift } from './analyzer';
import { DocDriftOptions } from './types';

/**
 * Documentation Drift Tool Provider
 */
export const DocDriftProvider: ToolProvider = {
  id: ToolName.DocDrift,
  alias: ['doc-drift', 'docs', 'jsdoc'],

  async analyze(options: ScanOptions): Promise<SpokeOutput> {
    const report = await analyzeDocDrift(options as DocDriftOptions);
    return SpokeOutputSchema.parse({
      results: groupIssuesByFile(report.issues),
      summary: report.summary,
      metadata: {
        toolName: ToolName.DocDrift,
        version: '0.9.5',
        timestamp: new Date().toISOString(),
        rawData: report.rawData,
      },
    });
  },

  score(output: SpokeOutput): ToolScoringOutput {
    const summary = output.summary as any;
    const rawData = (output.metadata as any)?.rawData || {};
    return buildSimpleProviderScore(ToolName.DocDrift, summary, rawData);
  },

  defaultWeight: 8,
};
