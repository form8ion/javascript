Feature: Remove Runkit details from existing package

  @wip
  Scenario: package with legacy runkit details
    Given the package has runkit details in the package.json
    And the README has a runkit badge
    When the scaffolder results are processed
    Then the runkit details are removed from the package.json
    And a next-step is defined to suggest removing the runkit badge from the README
