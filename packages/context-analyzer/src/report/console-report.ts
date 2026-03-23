import chalk from 'chalk';
import { analyzeContext } from '../orchestrator';
import { generateSummary } from '../summary';

/**
 * Display analysis report in console
 */
export function displayConsoleReport(
  summary: ReturnType<typeof generateSummary>,
  results: Awaited<ReturnType<typeof analyzeContext>>,
  maxResults: number = 10
): void {
  const divider =
    '──────────────────────────────────────────────────────────────────';
  const totalIssues =
    summary.criticalIssues + summary.majorIssues + summary.minorIssues;

  console.log(chalk.bold('📊 Context Analysis Summary:\n'));
  console.log(`   • Total Files:      ${chalk.cyan(summary.totalFiles)}`);
  console.log(
    `   • Total Tokens:     ${chalk.cyan(summary.totalTokens.toLocaleString())}`
  );
  console.log(
    `   • Avg Budget:       ${chalk.cyan(summary.avgContextBudget.toFixed(0))} tokens`
  );
  console.log(
    `   • Potential Saving: ${chalk.green(summary.totalPotentialSavings.toLocaleString())} tokens`
  );
  console.log();

  if (totalIssues > 0) {
    console.log(chalk.bold('⚠️ Issues Detected:\n'));
    console.log(`   • ${chalk.red('🔴 Critical:')} ${summary.criticalIssues}`);
    console.log(`   • ${chalk.yellow('🟡 Major:')}    ${summary.majorIssues}`);
    console.log(`   • ${chalk.blue('🔵 Minor:')}    ${summary.minorIssues}`);
    console.log();
  } else {
    console.log(chalk.green('✅ No significant context issues detected!\n'));
  }

  // Fragmented modules
  if (summary.fragmentedModules.length > 0) {
    console.log(chalk.bold('🧩 Top Fragmented Modules:\n'));

    summary.fragmentedModules.slice(0, maxResults).forEach((mod) => {
      const scoreColor =
        mod.fragmentationScore > 0.7
          ? chalk.red
          : mod.fragmentationScore > 0.4
            ? chalk.yellow
            : chalk.green;

      console.log(
        `   ${scoreColor('■')} ${chalk.white(mod.domain)} ${chalk.dim(`(${mod.files.length} files, ${(mod.fragmentationScore * 100).toFixed(0)}% frag)`)}`
      );
    });
    console.log();
  }

  // Top expensive files
  if (summary.topExpensiveFiles.length > 0) {
    console.log(chalk.bold('💸 Most Expensive Files (Context Budget):\n'));

    summary.topExpensiveFiles.slice(0, maxResults).forEach((item) => {
      const fileName = item.file.split('/').slice(-2).join('/');
      const severityColor =
        item.severity === 'critical'
          ? chalk.red
          : item.severity === 'major'
            ? chalk.yellow
            : chalk.blue;

      console.log(
        `   ${severityColor('●')} ${chalk.white(fileName)} ${chalk.dim(`- ${item.contextBudget.toLocaleString()} tokens`)}`
      );
    });
    console.log();
  }

  // Recommendations
  if (totalIssues > 0) {
    console.log(chalk.bold('💡 Top Recommendations:\n'));

    const topFiles = results
      .filter((r) => r.severity === 'critical' || r.severity === 'major')
      .slice(0, 3);

    topFiles.forEach((result, index) => {
      const fileName = result.file.split('/').slice(-2).join('/');
      console.log(chalk.cyan(`   ${index + 1}. ${fileName}`));
      result.recommendations.slice(0, 2).forEach((rec) => {
        console.log(chalk.dim(`      • ${rec}`));
      });
    });
    console.log();
  }

  // Footer
  console.log(chalk.cyan(divider));
  console.log(
    chalk.dim(
      '\n⭐ Like aiready? Star us on GitHub: https://github.com/caopengau/aiready-context-analyzer'
    )
  );
  console.log(
    chalk.dim(
      '🐛 Found a bug? Report it: https://github.com/caopengau/aiready-context-analyzer/issues\n'
    )
  );
}
