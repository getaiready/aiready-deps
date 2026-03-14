import path from 'path';

interface AliasBuilderOptions {
  packagesRootRelative: string;
  useIndexEntrypoints: boolean;
  includeCli?: boolean;
  includeConsistency?: boolean;
}

function packageSrcPath(
  baseDir: string,
  packagesRootRelative: string,
  pkgName: string,
  useIndexEntrypoints: boolean
): string {
  const suffix = useIndexEntrypoints ? '/index.ts' : '';
  return path.resolve(
    baseDir,
    `${packagesRootRelative}/${pkgName}/src${suffix}`
  );
}

export function createAireadyVitestAliases(
  baseDir: string,
  options: AliasBuilderOptions
): Record<string, string> {
  const aliases: Record<string, string> = {
    '@aiready/core': packageSrcPath(
      baseDir,
      options.packagesRootRelative,
      'core',
      options.useIndexEntrypoints
    ),
    '@aiready/pattern-detect': packageSrcPath(
      baseDir,
      options.packagesRootRelative,
      'pattern-detect',
      options.useIndexEntrypoints
    ),
    '@aiready/context-analyzer': packageSrcPath(
      baseDir,
      options.packagesRootRelative,
      'context-analyzer',
      options.useIndexEntrypoints
    ),
  };

  if (options.includeCli) {
    aliases['@aiready/cli'] = packageSrcPath(
      baseDir,
      options.packagesRootRelative,
      'cli',
      options.useIndexEntrypoints
    );
  }

  if (options.includeConsistency) {
    aliases['@aiready/consistency'] = packageSrcPath(
      baseDir,
      options.packagesRootRelative,
      'consistency',
      options.useIndexEntrypoints
    );
  }

  return aliases;
}
