Feature: Coverage

  @wip
  Scenario: Switch from `nyc` to `c8`
    Given existing "nyc" config is present
    And an "npm" lockfile exists
    And husky v5 is installed
    When the scaffolder results are processed
    Then "nyc" is not configured for code coverage
    And "c8" is configured for code coverage

  @wip
  Scenario: Project already configured to use `c8`
    Given existing "c8" config is present
    And an "npm" lockfile exists
    And husky v5 is installed
    When the scaffolder results are processed
    Then "c8" is configured for code coverage
