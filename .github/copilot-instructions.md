---
applyTo: "**"
---

# form8ion language plugin

A language plugin for the form8ion ecosystem to automate consistent configuration of JavaScript in various projects managed by form8ion.
Follows Test-Driven Development, Clean Architecture, and strict verification workflows.

## Commands

Run `nvm use` before any npm command.

```bash
# ALWAYS run first
nvm use

# Core commands
npm install               # Install dependencies (updates package-lock.json)
npm clean-install         # Clean node_modules and reinstall based on the existing
npm run test:unit:base    # Run unit tests (vitest)
npm run test:integration  # Run integration tests (cucumber)

# Validation suite (run before commits)
npm test
```

## Workflow: Outside-In TDD Required

Follow this exact sequence for ALL code changes. Work in small increments — make one change at a time and validate before proceeding.

1. **Research**: Search codebase for existing patterns, commands, utilities. Use Context7 MCP tools for library/API documentation.
2. **Write failing integration test**: Create test describing desired behavior (use Cucumber for integration tests)
3. **Verify failure**: Run `npm run test:integration` — confirm clear failure message
4. **Write failing unit test**: Create test describing desired behavior
5. **Verify failure**: Run `npm run test:unit:base` — confirm clear failure message
6. **Implement minimal code**: Write just enough to pass
7. **Verify pass**: Run `npm run test:unit:base` — confirm pass
8. **Refactor**: Clean up, remove duplication, keep tests green
9. **Check integration test result**: Run `npm run test:integration` — confirm pass. if failure, repeat steps 6-8 until pass
10. **Validate**: `npm test`

Task is NOT complete until all verification passes.

## Tech Stack

- **Language**: JavaScript (ESM)
- **Testing**: Vitest (never Jest), `@travi/any` for test fixtures
- **Linting**: ESLint as configured in `./.eslintrc.yml`

## Code Style

**Rules:**
- Use descriptive names for variables, functions, and modules
- Use full words — avoid abbreviations and acronyms unless widely understood
- Functions must be small and have single responsibility
- Avoid god functions and classes — break into smaller, focused units
- Avoid repetitive code — extract reusable functions
- Extract functions when there are multiple code paths
- Favor immutability and pure functions
- Avoid temporal coupling
- Keep cyclomatic complexity low
- Remove all unused imports and variables
- Run lint and tests after EVERY change

## Testing Standards

Tests are executable documentation. Use Arrange-Act-Assert pattern. Generate test fixtures with `@travi/any`.

```javascript
import any from '@travi/any';
import { describe, it, expect, vi } from 'vitest';
import {when} from 'vitest-when';

import { createConfigLoader } from './config-loader';

// ✅ Good - describes behavior, uses generated fixtures, mocks dependencies
describe('Config Loader', () => {
  describe('given a valid config file path', () => {
    it('loads and validates the configuration', async () => {
      const configPath = any.word() + '.json';
      const expectedConfig = {name: any.word(), version: any.integer()};
      const loader = createConfigLoader(mockReader);
      when(mockReader).calledWith(configPath).thenResolve(JSON.stringify(expectedConfig));

      const result = await loader.load(configPath);

      expect(result).toEqual(expectedConfig);
    });
  });

  describe('given an empty file path', () => {
    it('throws a validation error', async () => {
      const mockReader = vi.fn();
      const loader = createConfigLoader(mockReader);

      await expect(loader.load('')).rejects.toThrow('File path required');
    });
  });
});
```

**Rules:**
- Tests are executable documentation — describe behavior, not implementation
- Name `describe` blocks for features/scenarios, not function names
- Name `it` blocks as specifications that read as complete sentences
- Use nested `describe` blocks for "given/when" context
- Use `@travi/any` to generate test fixtures — avoid hardcoded test data unless the specific value is what is being tested
- Random values from `@travi/any` must be assigned to a constant and referenced consistently across arrange, act, and assert — the same value must appear at the stub, the call, and the assertion.
  The randomness proves the code passes data through correctly without coupling tests to specific values; the test outcome must be the same regardless of what value was generated
- Extract test data to constants — never duplicate values across arrange/act/assert
- Avoid conditional logic in tests unless absolutely necessary
- Ensure all code paths have corresponding tests
- Test happy paths, unhappy paths, and edge cases
- Never modify tests to pass without understanding root cause
- When a mock returns/resolves a value, do not assert that the mock was called (or was called with specific arguments).
  Instead, leverage `vitest-when` to make the mock return different values based on the arguments it is called with, and assert the expected result of the function under test.
  This ensures the test is focused on the behavior of the function under test rather than coupling it to specific implementation details of how it interacts with its dependencies.
- If a mock does not return/resolve a value and only has side-effects, consider whether it's behavior could be adjusted to return a value that can be asserted instead of asserting the mock call directly.

## Dependencies

- Use ranges for production dependencies (e.g. `^1.0.0`) but ensure they are updated when implementation depends on a specific version or behavior
- Pin development dependencies to exact versions (no ^ or ~)
- Ensure `package-lock.json` is updated correctly
- Use Renovate to keep dependencies current

## GitHub Actions

- Validation must be automated via GitHub Actions and runnable locally the same way
- Pin all 3rd party Actions to specific version or commit SHA followed by a comment indicating the related semver (e.g. `actions/checkout@de0fac2e4500dabe0009e67214ff5f5447ce83dd # v6.0.2`)

## Boundaries

**✅ Always do:**
- Run `nvm use` before any npm command
- Write tests before implementation (TDD)
- Run lint and tests after every change
- Run full verification before commits
- Use existing patterns from codebase
- Work in small increments

**⚠️ Ask first:**
- Adding new dependencies
- Changing project structure
- Modifying GitHub Actions workflows

**🚫 Never do:**
- Skip the TDD workflow
- Store secrets in code (use environment variables)
- Use Jest (instead, use Vitest for unit tests and Cucumber for integration tests)
- Modify tests to pass without fixing root cause
