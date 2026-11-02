# Dependency exceptions

2026-11-02: `@typescript-eslint/typescript-estree`'s minimatch dependency is pinned
through a scoped override to 11.0.4 for GHSA-g3hv-75wg-m249. Its installed consumer
uses only the named `minimatch(path, pattern, { dot: true })` function. The v11
removal of `makeRe` and other APIs does not affect that call. The file-selection
contract is tested in `scripts/check-lint-globs.mjs`; CI also runs ESLint, types
and a production build. Node 24 in CI satisfies the package's engine requirement.
Remove the override when the upstream dependency adopts a patched version.

Other ESLint dependencies still use minimatch 3.1.5, which exports a callable
CommonJS function and uses older APIs. Do not override those to v11 globally.
The npm advisory currently flags all versions below 11.0.1; the maintainer's
advisory describes the `optimizationLevel >= 2` preprocessing introduced in
later versions. That path is absent from installed v3.1.5. This discrepancy is
recorded, not silently ignored: `npm audit` continues to report it. No production
dependency is affected in the current audit. Do not use `npm audit fix --force`
to downgrade ESLint or Next configuration.

Sources: [maintainer advisory](https://github.com/isaacs/minimatch/security/advisories/GHSA-g3hv-75wg-m249),
[v11 changes](https://github.com/isaacs/minimatch/blob/main/changelog.md).
