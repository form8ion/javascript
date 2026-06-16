Feature: Lift a cli-type project

  Background:
    Given the project is of type "CLI"
    And husky v5 is installed

  Scenario: not yet linting package details
    Given an "npm" lockfile exists
    When the scaffolder results are processed
    Then publint is configured

  Scenario: incorrect homepage
    Given an "npm" lockfile exists
    And the registry plugin defines the package details page as "https://registry.test/packages/foo"
    When the scaffolder results are processed
    Then the homepage is updated to the package details page for the registry
