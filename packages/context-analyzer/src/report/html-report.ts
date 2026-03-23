import { analyzeContext } from '../orchestrator';
import { generateSummary } from '../summary';
import {
  generateReportHead,
  generateReportHero,
  generateStatCards,
  generateIssueSummary,
  generateTable,
  generateReportFooter,
  wrapInCard,
} from '@aiready/core';

/**
 * Generate HTML report
 */
export function generateHTMLReport(
  summary: ReturnType<typeof generateSummary>,
  results: Awaited<ReturnType<typeof analyzeContext>>
): string {
  const totalIssues =
    summary.criticalIssues + summary.majorIssues + summary.minorIssues;

  // 'results' may be used in templates later; reference to avoid lint warnings
  void results;

  const head = generateReportHead('AIReady Context Analysis Report');

  const stats = generateStatCards([
    { value: summary.totalFiles, label: 'Files Analyzed' },
    { value: summary.totalTokens.toLocaleString(), label: 'Total Tokens' },
    { value: summary.avgContextBudget.toFixed(0), label: 'Avg Context Budget' },
    {
      value: totalIssues,
      label: 'Total Issues',
      color: totalIssues > 0 ? '#f39c12' : undefined,
    },
  ]);

  const hero = generateReportHero(
    '🔍 AIReady Context Analysis Report',
    `Generated on ${new Date().toLocaleString()}`
  );

  let body = `${hero}
${stats}`;

  if (totalIssues > 0) {
    body += generateIssueSummary(
      summary.criticalIssues,
      summary.majorIssues,
      summary.minorIssues,
      summary.totalPotentialSavings
    );
  }

  if (summary.fragmentedModules.length > 0) {
    const fragmentedRows = summary.fragmentedModules.map((m) => [
      m.domain,
      String(m.files.length),
      `${(m.fragmentationScore * 100).toFixed(0)}%`,
      m.totalTokens.toLocaleString(),
    ]);
    body += wrapInCard(
      generateTable({
        headers: ['Domain', 'Files', 'Fragmentation', 'Token Cost'],
        rows: fragmentedRows,
      }),
      '🧩 Fragmented Modules'
    );
  }

  if (summary.topExpensiveFiles.length > 0) {
    const expensiveRows = summary.topExpensiveFiles.map((f) => [
      f.file,
      `${f.contextBudget.toLocaleString()} tokens`,
      `<span class="issue-${f.severity}">${f.severity.toUpperCase()}</span>`,
    ]);
    body += wrapInCard(
      generateTable({
        headers: ['File', 'Context Budget', 'Severity'],
        rows: expensiveRows,
      }),
      '💸 Most Expensive Files'
    );
  }

  const footer = generateReportFooter({
    title: 'Context Analysis Report',
    packageName: 'context-analyzer',
    packageUrl: 'https://github.com/caopengau/aiready-context-analyzer',
    bugUrl: 'https://github.com/caopengau/aiready-context-analyzer/issues',
  });

  return `${head}
<body>
  ${body}
  ${footer}
</body>
</html>`;
}
