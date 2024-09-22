Feature: Lift Registries

  Scenario: npmrc exists, no registry defined, no registries provided
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And husky v5 is installed
    When the scaffolder results are processed
    Then registry is defined as the official registry

  Scenario: npmrc exists, no registry defined, custom registry provided
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And husky v5 is installed
    And an override is defined for the official registry
    When the scaffolder results are processed

  Scenario: npmrc exists, no registry defined, custom scoped registry provided
    Given the npmrc does not define registry
    And an "npm" lockfile exists
    And husky v5 is installed
    And registries are defined for scopes
    When the scaffolder results are processed
    Then registry is defined as the official registry

  Scenario: no npmrc exists
    Given an "npm" lockfile exists
    And husky v5 is installed
    When the scaffolder results are processed
    Then registry is defined as the official registry
