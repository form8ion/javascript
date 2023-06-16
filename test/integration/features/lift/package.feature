Feature: Lift a package-type project

  @wip
  Scenario: not yet linting package details
    Given an "npm" lockfile exists
    And the project is of type "Package"
    When the scaffolder results are processed
    Then publint is configured

  @wip
  Scenario: not yet publishing with provenance
    Given an "npm" lockfile exists
    And the project is of type "Package"
    When the scaffolder results are processed
    And provenance is enabled for publishing
