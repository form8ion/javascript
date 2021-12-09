# `scaffold`

Language scaffolder for JavaScript projects

Takes a single options object as an argument, containing:

## `projectRoot` __string__ (_required_)

path to the root of the project

## `projectName` __string__ (_required_)

name of the project (w/o a [scope](https://docs.npmjs.com/misc/scope))

## `description` __string__ (_optional_)

short summary of the project

## `pathWithinParent` __string__ (_required_)

path within a parent project when scaffolding a sub-project

## `license` __string__ (_required_)

[SPDX License](https://spdx.org/licenses/) Identifier.
`UNLICENSED` should be used for proprietary projects that are not being
licensed for use by others.

## `decisions` __object__ (_optional_)

Answers for prompt questions so that the prompt is skipped at execution time

* keys: __string__ Name of the prompt question
* values: Hard-coded answer for the prompt question

## `visibility` __string__ (_required_)

visibility of the project (`Public` or `Private`)

## `vcs` __object__ (_required_)

* `host` __string__ (_required_)
  VCS hosting service
* `owner` __string__ (_required_)
  account name on the host service for the repository
* `name` __string__ (_required_)
  repository name

## `registries` __object__ (_optional_)

* keys: __string__ Scope of packages related to this registry (without the `@`)
* values: __string__ URL for the registry

## `ciServices` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [CI-service plugin options](https://github.com/form8ion/awesome#continuous-integration-services)

## `hosts` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [hosting-service plugin options](https://github.com/form8ion/awesome#hosts)

## `applicationTypes` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [application-type plugin options](https://github.com/form8ion/awesome#application-types)

## `packageTypes` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [package-type plugin options](https://github.com/form8ion/awesome#package-types)

## `monorepoTypes` __object__ (_optional_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining monorepo-type plugin options

## `unitTestFrameworks` __object__ (_required_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [unit-testing framework options](https://github.com/form8ion/awesome#unit-testing-frameworks)
to be passed to the [unit-testing scaffolder](./scaffold-unit-testing.md)

## `configs` __object__ (_optional_)

### `eslint`: __object__ (_optional_)

details about the [shareable config](https://eslint.org/docs/developer-guide/shareable-configs)
to be used for the project

* `packageName` __string__ (_required_)
  name of the `npm` package
* `prefix` __string__ (_required_)
  name to be used when referring to the config within the `.eslintrc` files

:warning: while i'm not confident that it is the recommended convention, it
is assumed the defined config has a `rules/` directory exposed from the
package with rulesets defined for

* `es6.js`
* `tests/base.js`
* `tests/mocha.js`

### `commitlint` __object__ (_optional_)

details about the [shareable config](https://marionebl.github.io/commitlint/#/concepts-shareable-config)
to be used for the project

* `packageName` __string__ (_required_)
  name of the `npm` package
* `name` __string__ (_required_)
  name to be used when referring to the config within the `.commitlintrc.js`
  file

\###`babelPreset` __object__ (_optional_)

details about the [preset](https://babeljs.io/docs/plugins/#creating-a-preset)
to be used for the project

* `packageName` __string__ (_required_)
  name of the `npm` package
* `name` __string__ (_required_)
  shorthand name to be used when referring to the config

## `overrides` __object__ (_optional_)

* `npmAccount` __string__ (_optional_)
  the account the package should be published under. used to suggest a
  [scope](https://docs.npmjs.com/misc/scope). defaults to `$ npm whoami`
* `author` __object__ (_optional_)
  [details](https://docs.npmjs.com/files/package.json#people-fields-author-contributors)
  about the package author

  * `name` __string__ (_required_) defaults to `$npm config get init.author.name`
  * `email` __string__ (_optional_) defaults to `$npm config get init.author.email`
  * `url` __string__ (_optional_) defaults to `$npm config get init.author.url`
