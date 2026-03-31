import { analyzeDeps } from '../analyzer';
import { join } from 'path';
import { writeFileSync, mkdirSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Deps Health Analyzer', () => {
  let tmpDir: string;

  beforeAll(() => {
    tmpDir = join(tmpdir(), `deps-test-complex-${Date.now()}`);
    mkdirSync(tmpDir, { recursive: true });

    // NPM
    writeFileSync(
      join(tmpDir, 'package.json'),
      JSON.stringify({
        dependencies: { lodash: '^0.4.0', request: '^2.88.2' },
      })
    );

    // Python requirements.txt
    writeFileSync(
      join(tmpDir, 'requirements.txt'),
      'requests==2.31.0\nurllib3>=1.26.15\n# Comment\nflask'
    );

    // Maven pom.xml
    writeFileSync(
      join(tmpDir, 'pom.xml'),
      `
      <project>
        <dependencies>
          <dependency>
            <artifactId>log4j</artifactId>
          </dependency>
          <dependency>
            <artifactId>junit</artifactId>
          </dependency>
        </dependencies>
      </project>
      `
    );

    // Go go.mod
    writeFileSync(
      join(tmpDir, 'go.mod'),
      `
      module example.com/m
      go 1.21
      require github.com/gorilla/mux v1.8.1
      require (
        github.com/spf13/cobra v1.8.0
        github.com/stretchr/testify v1.8.4
      )
      `
    );

    // .NET csproj
    writeFileSync(
      join(tmpDir, 'app.csproj'),
      `
      <Project Sdk="Microsoft.NET.Sdk">
        <ItemGroup>
          <PackageReference Include="Newtonsoft.Json" Version="13.0.3" />
          <PackageReference Include="Microsoft.Extensions.Logging" Version="8.0.0" />
        </ItemGroup>
      </Project>
      `
    );

    // Subdirectory with exclusions
    const subDir = join(tmpDir, 'vendor');
    mkdirSync(subDir);
    writeFileSync(
      join(subDir, 'package.json'),
      JSON.stringify({ dependencies: { 'should-be-ignored': '1.0.0' } })
    );
  });

  afterAll(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  it('detects dependencies across multiple ecosystems', async () => {
    const report = await analyzeDeps({
      rootDir: tmpDir,
      exclude: ['vendor'],
    });

    // 2 (npm) + 3 (python) + 2 (maven) + 3 (go) + 2 (dotnet) = 12
    expect(report.summary.packagesAnalyzed).toBe(12);
    expect(report.summary.filesAnalyzed).toBe(5); // Ignored vendor/package.json

    // Check for deprecated ones we added
    // request (npm), log4j (maven), gorilla/mux (go), urllib3 (python)
    expect(report.rawData.deprecatedPackages).toBeGreaterThanOrEqual(4);
  });

  it('handles empty or malformed manifests gracefully', async () => {
    const emptyDir = join(tmpdir(), `deps-test-empty-${Date.now()}`);
    mkdirSync(emptyDir);
    writeFileSync(join(emptyDir, 'package.json'), 'invalid json');
    writeFileSync(join(emptyDir, 'requirements.txt'), '');

    const report = await analyzeDeps({ rootDir: emptyDir });
    expect(report.summary.packagesAnalyzed).toBe(0);

    rmSync(emptyDir, { recursive: true, force: true });
  });

  it('should NOT flag @aws-sdk/s3-request-presigner as deprecated (substring false positive)', async () => {
    const testDir = join(tmpdir(), `deps-false-positive-${Date.now()}`);
    mkdirSync(testDir);
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        dependencies: {
          '@aws-sdk/s3-request-presigner': '^3.0.0',
          '@aws-sdk/client-s3': '^3.0.0',
        },
      })
    );

    const report = await analyzeDeps({ rootDir: testDir });
    const deprecatedIssues = report.issues.filter(
      (i) =>
        i.message.includes('@aws-sdk/s3-request-presigner') &&
        i.message.includes('deprecated')
    );
    expect(deprecatedIssues.length).toBe(0);
    expect(report.rawData.deprecatedPackages).toBe(0);

    rmSync(testDir, { recursive: true, force: true });
  });

  it('should still flag the actual "request" package as deprecated', async () => {
    const testDir = join(tmpdir(), `deps-request-test-${Date.now()}`);
    mkdirSync(testDir);
    writeFileSync(
      join(testDir, 'package.json'),
      JSON.stringify({
        dependencies: { request: '^2.88.0' },
      })
    );

    const report = await analyzeDeps({ rootDir: testDir });
    const deprecatedIssues = report.issues.filter((i) =>
      i.message.includes('request')
    );
    expect(deprecatedIssues.length).toBe(1);
    expect(report.rawData.deprecatedPackages).toBe(1);

    rmSync(testDir, { recursive: true, force: true });
  });
});
