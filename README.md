# javascript

JavaScript language plugin for the [@form8ion](https://github.com/form8ion)
toolset

<!--status-badges start -->

[![Node CI Workflow Status][github-actions-ci-badge]][github-actions-ci-link]
[![Codecov][coverage-badge]][coverage-link]

<!--status-badges end -->

## Table of Contents

* [Usage](#usage)
  * [Installation](#installation)
  * [Example](#example)
    * [Import](#import)
    * [Execute](#execute)
  * [API](#api)
    * [`scaffoldUnitTesting`](#scaffoldunittesting)
      * [`projectRoot` __string__ (_required_)](#projectroot-string-required)
      * [`frameworks` __object__ (_required_)](#frameworks-object-required)
      * [`decisions` __object__ (_optional_)](#decisions-object-optional)
      * [`visibility` __string__ (_required_)](#visibility-string-required)
      * [`vcs` __object__ (_required_)](#vcs-object-required)
    * [`questionNames`](#questionnames)
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
const {scaffold: scaffoldJavaScript, scaffoldUnitTesting, questionNames} = require('@form8ion/javascript');
```

#### Execute

```javascript
(async () => {
  const accountName = 'form8ion';

  await scaffoldJavaScript({
    projectRoot: process.cwd(),
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
      [questionNames.INTEGRATION_TESTS]: true
    }
  });

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

### API

#### `scaffoldUnitTesting`

Scaffolder for enabling unit-testing in a project with the ability to choose a
desired framework from provided options.

Takes a single options object as an argument, containing:

##### `projectRoot` __string__ (_required_)

path to the root of the project

##### `frameworks` __object__ (_required_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [unit-testing framework options](https://github.com/form8ion/awesome#unit-testing-frameworks)

##### `decisions` __object__ (_optional_)

Answers for prompt questions so that the prompt is skipped at execution time

* keys: __string__ Name of the prompt question
* values: Hard-coded answer for the prompt question

##### `visibility` __string__ (_required_)

visibility of the project (`Public` or `Private`)

##### `vcs` __object__ (_required_)

* `host` __string__ (_required_)
  VCS hosting service
* `owner` __string__ (_required_)
  account name on the host service for the repository
* `name` __string__ (_required_)
  repository name

#### `questionNames`

Constants defining the question names for the prompts implemented in this
package

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
