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
const {dialects, projectTypes} = require('@form8ion/javascript-core');
const {
  scaffold: scaffoldJavaScript,
  lift: liftJavascript,
  test: thisIsAJavaScriptProject,
  scaffoldUnitTesting,
  questionNames
} = require('@form8ion/javascript');
```

#### Execute

```javascript
(async () => {
  const accountName = 'form8ion';
  const projectRoot = process.cwd();

  await scaffoldJavaScript({
    projectRoot,
    projectName: 'project-name',
    visibility: 'Public',
    license: 'MIT',
    configs: {
      eslint: {scope: `@${accountName}`},
      remark: `@${accountName}/remark-lint-preset`,
      babelPreset: {name: `@${accountName}`, packageName: `@${accountName}/babel-preset`},
      commitlint: {name: `@${accountName}`, packageName: `@${accountName}/commitlint-config`}
    },
    overrides: {npmAccount: accountName},
    ciServices: {},
    unitTestFrameworks: {},
    decisions: {
      [questionNames.DIALECT]: dialects.BABEL,
      [questionNames.NODE_VERSION_CATEGORY]: 'LTS',
      [questionNames.PACKAGE_MANAGER]: 'npm',
      [questionNames.PROJECT_TYPE]: projectTypes.PACKAGE,
      [questionNames.SHOULD_BE_SCOPED]: true,
      [questionNames.SCOPE]: accountName,
      [questionNames.AUTHOR_NAME]: 'Your Name',
      [questionNames.AUTHOR_EMAIL]: 'you@domain.tld',
      [questionNames.AUTHOR_URL]: 'https://your.website.tld',
      [questionNames.UNIT_TESTS]: true,
      [questionNames.INTEGRATION_TESTS]: true,
      [questionNames.PROVIDE_EXAMPLE]: true
    }
  });

  if (await thisIsAJavaScriptProject({projectRoot})) {
    await liftJavascript({
      projectRoot,
      configs: {eslint: {scope: '@foo'}},
      results: {
        dependencies: [],
        devDependencies: [],
        scripts: {},
        eslint: {configs: [], ignore: {directories: []}},
        packageManager: 'npm'
      }
    });
  }

  await scaffoldUnitTesting({
    projectRoot: process.cwd(),
    frameworks: {
      Mocha: {scaffolder: options => options},
      Jest: {scaffolder: options => options}
    },
    visibility: 'Public',
    vcs: {host: 'GitHub', owner: 'foo', name: 'bar'},
    decisions: {[questionNames.UNIT_TEST_FRAMEWORK]: 'Mocha'}
  });
})();
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

[renovate-badge]: https://img.shields.io/badge/renovate-enabled-brightgreen.svg?logo=renovatebot

[github-actions-ci-link]: https://github.com/form8ion/javascript/actions?query=workflow%3A%22Node.js+CI%22+branch%3Amaster

[github-actions-ci-badge]: https://github.com/form8ion/javascript/workflows/Node.js%20CI/badge.svg

[license-link]: LICENSE

[license-badge]: https://img.shields.io/github/license/form8ion/javascript.svg

[npm-link]: https://www.npmjs.com/package/@form8ion/javascript

[npm-badge]: https://img.shields.io/npm/v/@form8ion/javascript.svg?logo=npm

[node-badge]: https://img.shields.io/node/v/@form8ion/javascript.svg?logo=node.js

[runkit-link]: https://npm.runkit.com/@form8ion/javascript

[runkit-badge]: https://badge.runkitcdn.com/@form8ion/javascript.svg

[coverage-link]: https://codecov.io/github/form8ion/javascript

[coverage-badge]: https://img.shields.io/codecov/c/github/form8ion/javascript.svg?logo=codecov

[slsa-badge]: https://slsa.dev/images/gh-badge-level2.svg
