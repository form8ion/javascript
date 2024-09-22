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

  Scenario: no npmrc or lockfile-lint config exists
    Given an "npm" lockfile exists
    And lockfile-lint is not configured
    And husky v5 is installed
    When the scaffolder results are processed
    Then registry is defined as the official registry
    And the lockfile-lint config allows the "npm" registry
