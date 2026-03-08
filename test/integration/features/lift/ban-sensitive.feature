Feature: ban-sensitive-files is unmaintained

  @wip
  Scenario: project with legacy ban-sensitive-files configuration
    Given the project has legacy ban-sensitive-files configuration
    When the scaffolder results are processed
    Then ban-sensitive-files is removed from the project
