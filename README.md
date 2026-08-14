# javascript

JavaScript language plugin for the [@form8ion](https://github.com/form8ion)
toolset

<!--status-badges start -->

[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
[![Codecov][coverage-badge]][coverage-link]
[![OpenSSF Scorecard](https://api.securityscorecards.dev/projects/github.com/form8ion/javascript/badge)](https://securityscorecards.dev/viewer/?uri=github.com/form8ion/javascript)
![SLSA Level 2][slsa-badge]

<!--status-badges end -->

## Table of Contents

* [Usage](#usage)
  * [Installation](#installation)
  * [Example](#example)
    * [Import](#import)
    * [Execute](#execute)
  * [Documentation](#documentation)
* [Contributing](#contributing)
  * [Dependencies](#dependencies)
  * [Verification](#verification)

## Usage

<!--consumer-badges start -->

[![MIT license][license-badge]][license-link]
[![npm][npm-badge]][npm-link]
![node][node-badge]
[![Try @form8ion/javascript on RunKit][runkit-badge]][runkit-link]

<!--consumer-badges end -->

### Installation

```sh
$ npm install @form8ion/javascript --save
```

### Example

#### Import

```javascript
import 'validate-npm-package-name';
```

```javascript
const {dialects, projectTypes} = await import('@form8ion/javascript-core');
const {
  scaffold: scaffoldJavaScript,
  lift: liftJavascript,
  test: thisIsAJavaScriptProject,
  scaffoldUnitTesting,
  promptConstants
} = await import('./lib/index.js');
```

#### Execute

```javascript
const accountName = 'form8ion';
const projectRoot = process.cwd();
const logger = {
  info: () => undefined,
  warn: () => undefined,
  error: () => undefined,
  success: () => undefined
};

await scaffoldJavaScript(
  {
    projectRoot,
    projectName: 'project-name',
    visibility: 'OSS',
    license: 'MIT',
    configs: {
      eslint: {scope: `@${accountName}`},
      remark: `@${accountName}/remark-lint-preset`,
      babelPreset: {
        name: `@${accountName}`,
        packageName: `@${accountName}/babel-preset`
      },
      commitlint: {
        name: `@${accountName}`,
        packageName: `@${accountName}/commitlint-config`
      }
    },
    plugins: {
      unitTestFrameworks: {},
      applicationTypes: {},
      packageTypes: {},
      packageBundlers: {},
      ciServices: {}
    }
  },
  {
    logger,
    prompt: ({id}) => {
      const {questionNames, ids} = promptConstants;
      const {BASE_DETAILS: baseDetailsPromptId} = ids;

      switch (id) {
        case baseDetailsPromptId: {
          const {
            DIALECT,
            NODE_VERSION_CATEGORY,
            PACKAGE_MANAGER,
            PROJECT_TYPE,
            SHOULD_BE_SCOPED,
            SCOPE,
            AUTHOR_NAME,
            AUTHOR_EMAIL,
            AUTHOR_URL,
            UNIT_TESTS,
            INTEGRATION_TESTS,
            PROVIDE_EXAMPLE
          } = questionNames[baseDetailsPromptId];

          return {
            [DIALECT]: dialects.ESM,
            [NODE_VERSION_CATEGORY]: 'LTS',
            [PACKAGE_MANAGER]: 'npm',
            [PROJECT_TYPE]: projectTypes.PACKAGE,
            [SHOULD_BE_SCOPED]: true,
            [SCOPE]: accountName,
            [AUTHOR_NAME]: 'Your Name',
            [AUTHOR_EMAIL]: 'you@domain.tld',
            [AUTHOR_URL]: 'https://your.website.tld',
            [UNIT_TESTS]: true,
            [INTEGRATION_TESTS]: true,
            [PROVIDE_EXAMPLE]: true
          };
        }
        default:
          throw new Error(`Unknown prompt with ID: ${id}`);
      }
    }
  }
);

if (await thisIsAJavaScriptProject({projectRoot}, {logger})) {
  await liftJavascript({
    projectRoot,
    configs: {eslint: {scope: '@foo'}},
    results: {
      dependencies: {javascript: {production: [], development: []}},
      scripts: {},
      eslint: {configs: [], ignore: {directories: []}},
      packageManager: 'npm'
    },
    enhancers: {
      PluginName: {
        test: () => true,
        lift: () => ({})
      }
    }
  }, {logger});
}

await scaffoldUnitTesting(
  {
    projectRoot: process.cwd(),
    frameworks: {
      Mocha: {scaffold: options => options},
      Jest: {scaffold: options => options}
    },
    visibility: 'OSS',
    vcs: {
      host: 'GitHub',
      owner: 'foo',
      name: 'bar'
    }
  },
  {
    logger,
    prompt: ({id}) => {
      const {questionNames, ids} = promptConstants;
      const {UNIT_TESTING: unitTestingPromptId} = ids;

      switch (id) {
        case unitTestingPromptId: {
          const {UNIT_TEST_FRAMEWORK} = questionNames[unitTestingPromptId];

          return {[UNIT_TEST_FRAMEWORK]: 'Vitest'};
        }
        default:
          throw new Error(`Unknown prompt with ID: ${id}`);
      }
    }
  }
);
```

### Documentation

* [API](./docs/api)
* [Constants](./docs/constants)

## Contributing

<!--contribution-badges start -->

[![PRs Welcome][PRs-badge]][PRs-link]
[![Commitizen friendly][commitizen-badge]][commitizen-link]
[![Conventional Commits][commit-convention-badge]][commit-convention-link]
[![semantic-release][semantic-release-badge]][semantic-release-link]
[![Renovate][renovate-badge]][renovate-link]

<!--contribution-badges end -->

### Dependencies

```sh
$ nvm install
$ npm install
```

### Verification

```sh
$ npm test
```

[PRs-link]: http://makeapullrequest.com

[PRs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg

[commitizen-link]: http://commitizen.github.io/cz-cli/

[commitizen-badge]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg

[commit-convention-link]: https://conventionalcommits.org

[commit-convention-badge]: https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg

[semantic-release-link]: https://github.com/semantic-release/semantic-release

[semantic-release-badge]: https://img.shields.io/badge/semantic--release-angular-e10079?logo=semantic-release

[renovate-link]: https://renovatebot.com

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovate

[github-actions-ci-link]: https://github.com/form8ion/javascript/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://img.shields.io/github/actions/workflow/status/form8ion/javascript/node-ci.yml.svg?branch=master&logo=github

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/javascript.svg?logo=opensourceinitiative

[npm-link]: https://www.npmjs.com/package/@form8ion/javascript

[npm-badge]: https://img.shields.io/npm/v/@form8ion/javascript?logo=npm

[node-badge]: https://img.shields.io/node/v/@form8ion/javascript?logo=node.js

[runkit-link]: https://npm.runkit.com/@form8ion/javascript

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/javascript.svg

[coverage-link]: https://codecov.io/github/form8ion/javascript

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/javascript/master?logo=codecov

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg
