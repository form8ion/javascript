Feature: Script Ordering

  Scenario: ensure scripts are ordered correctly
    Given an "npm" lockfile exists
    And the project is versioned on GitHub
    And the project is of type "Package"
    And husky v5 is installed
    When the scaffolder results are processed
    Then the scripts are ordered correctly
