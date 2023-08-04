Feature: Lift a cli-type project

  Scenario: not yet linting package details
    Given an "npm" lockfile exists
    And the project is of type "CLI"
    And husky v5 is installed
    When the scaffolder results are processed
    Then publint is configured

  Scenario: not yet publishing with provenance
    Given an "npm" lockfile exists
    And the project is of type "CLI"
    And husky v5 is installed
    And the package is published publicly
    When the scaffolder results are processed
    Then provenance is enabled for publishing
