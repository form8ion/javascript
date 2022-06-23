Feature: Scripts

  Scenario: No Additional Scripts from Results
    Given no additional scripts are included in the results
    And an "npm" lockfile exists
    And husky is not installed
    When the scaffolder results are processed
    Then the existing scripts still exist
    And no extra scripts were added

  Scenario: Additional Scripts Are Present in Results
    Given additional scripts are included in the results
    And an "npm" lockfile exists
    And husky is not installed
    When the scaffolder results are processed
    Then the existing scripts still exist
    And the additional scripts exist

  Scenario: Duplicate Scripts Are Present in Results
    Given additional scripts that duplicate existing scripts are included in the results
    And an "npm" lockfile exists
    And husky is not installed
    When the scaffolder results are processed
    Then the additional scripts exist

  Scenario: existing test script with build, lint, and tests
    Given additional scripts are included in the results
    And the project defines a pregenerate:md script
    And the project defines lint scripts
    And the project defines test scripts
    And an "npm" lockfile exists
    And husky is not installed
    When the scaffolder results are processed
    Then the updated test script includes build
