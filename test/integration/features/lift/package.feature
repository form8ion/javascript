Feature: Lift a package-type project

  Scenario: not yet linting package details
    Given an "npm" lockfile exists
    And the project is versioned on GitHub
    And the project is of type "Package"
    And husky v5 is installed
    When the scaffolder results are processed
    Then publint is configured

  Scenario: not yet linting package details
    Given an "npm" lockfile exists
    And the project is versioned on GitHub
    And the project is of type "Package" but without exports defined
    And husky v5 is installed
    When the scaffolder results are processed
    Then publint is configured

  Scenario: not yet publishing with provenance
    Given an "npm" lockfile exists
    And the project is versioned on GitHub
    And the project is of type "Package" but without exports defined
    And husky v5 is installed
    And the package is published publicly
    When the scaffolder results are processed
    Then provenance is enabled for publishing

  Scenario: missing repository details
    Given an "npm" lockfile exists
    And the project is versioned on GitHub
    And the project is of type "Package" but without repository details defined
    And husky v5 is installed
    When the scaffolder results are processed
    Then repository details will be defined using the shorthand
