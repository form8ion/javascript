Feature: Lift Registries

  Scenario: npmrc exists, no registry defined, no registries provided
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And lockfile-lint is configured
    And husky v5 is installed
    When the scaffolder results are processed
    Then registry is defined as the official registry
    And the lockfile-lint config allows the "npm" registry

  Scenario: npmrc exists, no registry defined, custom registry provided
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And the project is of type "CLI"
    And husky v5 is installed
    And lockfile-lint is configured
    And an override is defined for the official registry
    When the scaffolder results are processed
    Then registry is defined as an alternate registry
    And the lockfile-lint config allows the custom registry

  Scenario: npmrc exists, no registry defined, custom scoped registry provided
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And lockfile-lint is configured
    And husky v5 is installed
    And registries are defined for scopes
    When the scaffolder results are processed
    Then registry is defined as the official registry
    And the lockfile-lint config allows the "npm" registry
    And the lockfile-lint config allows the scoped registries

  Scenario: npmrc exists, no registry defined, alternative publish registry provided
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And lockfile-lint is configured
    And the project is of type "Package"
    And husky v5 is installed
    And an alternative registry is defined for publishing
    When the scaffolder results are processed
    Then registry is defined as the official registry
    And the lockfile-lint config allows the "npm" registry
    And the registry configuration is defined

  Scenario: npmrc exists, no registry defined, registry defined for the package's scope
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And lockfile-lint is configured
    And the project is of type "Package"
    And husky v5 is installed
    And a registry is defined for the package's scope
    When the scaffolder results are processed
    Then registry is defined as the official registry
    And the lockfile-lint config allows the "npm" registry

  Scenario: scoped package falls back to main registry override when no scope registry is defined
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And lockfile-lint is configured
    And the project is of type "Package"
    And husky v5 is installed
    And the package is published under a scope
    And an override is defined for the official registry
    When the scaffolder results are processed
    Then registry is defined as an alternate registry
    And the lockfile-lint config allows the custom registry

  Scenario: scoped registry takes priority over main registry override
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And lockfile-lint is configured
    And the project is of type "Package"
    And husky v5 is installed
    And a registry is defined for the package's scope
    And an override is defined for the official registry
    When the scaffolder results are processed
    Then registry is defined as an alternate registry
    And the lockfile-lint config allows the custom registry

  Scenario: no npmrc or lockfile-lint config exists
    Given an "npm" lockfile exists
    And lockfile-lint is not configured
    And husky v5 is installed
    When the scaffolder results are processed
    Then registry is defined as the official registry
    And the lockfile-lint config allows the "npm" registry
