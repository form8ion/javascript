# `lift`

function that takes results from a JavaScript sub-scaffolder and applies the
necessary changes to an existing project

## Table of Contents

* [Arguments](#arguments)
  * [`projectRoot` __string__ (_required_)](#projectroot-string-required)
  * [`vcs` __object__ (_required_)](#vcs-object-required)
  * [`results` __object__ (_required_)](#results-object-required)

## Arguments

Takes a single options object as an argument, containing:

### `projectRoot` __string__ (_required_)

path to the root of the project

### `vcs` __object__ (_required_)

* `host` __string__ (_required_)
  VCS hosting service
* `owner` __string__ (_required_)
  account name on the host service for the repository
* `name` __string__ (_required_)
  repository name

### `results` __object__ (_required_)

results from sub-scaffolder
