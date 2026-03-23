import { Command } from 'commander';
import { analyzeDocDrift } from './analyzer';
import { executeSpokeCli } from '@aiready/core';
import pc from 'picocolors';

export function createCommand() {
  const program = new Command('doc-drift')
    .description(
      'Scan for documentation drift (outdated comments, mismatched signatures)'
    )
    .option('--include <patterns...>', 'File patterns to include')
    .option('--exclude <patterns...>', 'File patterns to exclude')
    .option(
      '--stale-months <number>',
      'Months before a comment is considered potentially outdated',
      '6'
    )
    .action(async (options) => {
      await executeSpokeCli(
        'Doc Drift',
        'documentation drift',
        {
          include: options.include,
          exclude: options.exclude,
          staleMonths: parseInt(options.staleMonths, 10),
        },
        analyzeDocDrift
      );
    });

  return program;
}

if (require.main === module) {
  createCommand()
    .parseAsync(process.argv)
    .catch((err) => {
      console.error(pc.red(err.message));
      process.exit(1);
    });
}
