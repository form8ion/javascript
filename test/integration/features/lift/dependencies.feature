Feature: Dependencies

  Scenario: prod dependency installation failure
    When the scaffolder results are processed

  Scenario: npm lockfile exists
    Given an "npm" lockfile exists
    And the node version is captured for the project
    When the scaffolder results are processed
    Then dependencies are installed with "npm"

  Scenario: npm passed as packageManager in results
    Given "npm" is defined as the package manager in the results
    And the node version is captured for the project
    When the scaffolder results are processed
    Then dependencies are installed with "npm"

  Scenario: npm pinned in the package.json
    Given "npm" is pinned in the package.json
    And the node version is captured for the project
    When the scaffolder results are processed
    Then dependencies are installed with "npm"

  Scenario: yarn lockfile exists
    Given an "yarn" lockfile exists
    And the node version is captured for the project
    When the scaffolder results are processed
    Then dependencies are installed with "yarn"

  Scenario: yarn passed as packageManager in results
    Given "yarn" is defined as the package manager in the results
    And the node version is captured for the project
    When the scaffolder results are processed
    Then dependencies are installed with "yarn"

  Scenario: yarn pinned in the package.json
    Given "yarn" is pinned in the package.json
    And the node version is captured for the project
    When the scaffolder results are processed
    Then dependencies are installed with "yarn"
