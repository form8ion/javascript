# `scaffoldUnitTesting`

Scaffolder for enabling unit-testing in a project with the ability to choose a
desired framework from provided options.

## Table of Contents

* [Arguments](#arguments)
  * [`projectRoot` __string__ (_required_)](#projectroot-string-required)
  * [`frameworks` __object__ (_required_)](#frameworks-object-required)
  * [`decisions` __object__ (_optional_)](#decisions-object-optional)
  * [`visibility` __string__ (_required_)](#visibility-string-required)
  * [`vcs` __object__ (_required_)](#vcs-object-required)

## Arguments

Takes a single options object as an argument, containing:

### `projectRoot` __string__ (_required_)

path to the root of the project

### `frameworks` __object__ (_required_)

A [`choices` object](https://github.com/form8ion/javascript-core#choices-object-required)
for defining [unit-testing framework options](https://github.com/form8ion/awesome#unit-testing-frameworks)

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
