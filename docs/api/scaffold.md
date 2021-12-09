# `scaffold`

Language scaffolder for JavaScript projects

## Table of Contents

* [Arguments](#arguments)
  * [`projectRoot` __string__ (_required_)](#projectroot-string-required)
  * [`projectName` __string__ (_required_)](#projectname-string-required)
  * [`description` __string__ (_optional_)](#description-string-optional)
  * [`pathWithinParent` __string__ (_required_)](#pathwithinparent-string-required)
  * [`license` __string__ (_required_)](#license-string-required)
  * [`decisions` __object__ (_optional_)](#decisions-object-optional)
  * [`visibility` __string__ (_required_)](#visibility-string-required)
  * [`vcs` __object__ (_required_)](#vcs-object-required)
  * [`registries` __object__ (_optional_)](#registries-object-optional)
  * [`ciServices` __object__ (_optional_)](#ciservices-object-optional)
  * [`hosts` __object__ (_optional_)](#hosts-object-optional)
  * [`applicationTypes` __object__ (_optional_)](#applicationtypes-object-optional)
  * [`packageTypes` __object__ (_optional_)](#packagetypes-object-optional)
  * [`monorepoTypes` __object__ (_optional_)](#monorepotypes-object-optional)
  * [`unitTestFrameworks` __object__ (_required_)](#unittestframeworks-object-required)
  * [`configs` __object__ (_optional_)](#configs-object-optional)
    * [`eslint`: __object__ (_optional_)](#eslint-object-optional)
    * [`commitlint` __object__ (_optional_)](#commitlint-object-optional)
    * [`babelPreset` __object__ (_optional_)](#babelpreset-object-optional)
    * [`typescript`: __object__ (_optional_)](#typescript-object-optional)
    * [`remark`: __string__ (_optional_)](#remark-string-optional)
  * [`overrides` __object__ (_optional_)](#overrides-object-optional)

## Arguments

Takes a single options object as an argument, containing:

### `projectRoot` __string__ (_required_)

path to the root of the project

### `projectName` __string__ (_required_)

name of the project (w/o a [scope](https://docs.npmjs.com/misc/scope))

### `description` __string__ (_optional_)

short summary of the project

### `pathWithinParent` __string__ (_required_)

path within a parent project when scaffolding a sub-project

### `license` __string__ (_required_)

[SPDX License](https://spdx.org/licenses/) Identifier.
`UNLICENSED` should be used for proprietary projects that are not being
licensed for use by others.

### `decisions` __object__ (_optional_)

Answers for prompt questions so that the prompt is skipped at execution time

* keys: __string__ Name of the prompt question
* values: Hard-coded answer for the prompt question

### `visibility` __string__ (_required_)

visibility of the project (`Public` or `Private`)

### `vcs` __object__ (_required_)

* `host` __string__ (_required_)
  VCS hosting service
* `owner` __string__ (_required_)
  account name on the host service for the repository
* `name` __string__ (_required_)
  repository name

### `registries` __object__ (_optional_)

* keys: __string__ Scope of packages related to this registry (without the `@`)
* values: __string__ URL for the registry

### `ciServices` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [CI-service plugin options](https://github.com/form8ion/awesome#continuous-integration-services)

### `hosts` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [hosting-service plugin options](https://github.com/form8ion/awesome#hosts)

### `applicationTypes` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [application-type plugin options](https://github.com/form8ion/awesome#application-types)

### `packageTypes` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [package-type plugin options](https://github.com/form8ion/awesome#package-types)

### `monorepoTypes` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining monorepo-type plugin options

### `unitTestFrameworks` __object__ (_required_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [unit-testing framework options](https://github.com/form8ion/awesome#unit-testing-frameworks)
to be passed to the [unit-testing scaffolder](./scaffold-unit-testing.md)

### `configs` __object__ (_optional_)

#### `eslint`: __object__ (_optional_)

* `scope` __string__ (_required_)
  [scope](https://docs.npmjs.com/misc/scope) to be used for [shareable configs](https://eslint.org/docs/developer-guide/shareable-configs)
  added as dependencies by the scaffolder

#### `commitlint` __object__ (_optional_)

details about the [shareable config](https://marionebl.github.io/commitlint/#/concepts-shareable-config)
to be used for the project

* `packageName` __string__ (_required_)
  name of the `npm` package
* `name` __string__ (_required_)
  name to be used when referring to the config within the `.commitlintrc.js`
  file

#### `babelPreset` __object__ (_optional_)

details about the [preset](https://babeljs.io/docs/plugins/#creating-a-preset)
to be used for the project

* `packageName` __string__ (_required_)
  name of the `npm` package
* `name` __string__ (_required_)
  shorthand name to be used when referring to the config

#### `typescript`: __object__ (_optional_)

* `scope` __string__ (_required_)
  [scope](https://docs.npmjs.com/misc/scope) to be used for shareable configs
  added as dependencies by the scaffolder

#### `remark`: __string__ (_optional_)

name of the package to use as a preset for configuring [remark](https://remark.js.org/)
in the scaffolded project

### `overrides` __object__ (_optional_)

__DEPRECATED__ use [decisions](#decisions-object-optional) instead

* `npmAccount` __string__ (_optional_)
  the account the package should be published under. used to suggest a
  [scope](https://docs.npmjs.com/misc/scope). defaults to `$ npm whoami`
* `author` __object__ (_optional_)
  [details](https://docs.npmjs.com/files/package.json#people-fields-author-contributors)
  about the package author

  * `name` __string__ (_required_) defaults to `$npm config get init.author.name`
  * `email` __string__ (_optional_) defaults to `$npm config get init.author.email`
  * `url` __string__ (_optional_) defaults to `$npm config get init.author.url`
