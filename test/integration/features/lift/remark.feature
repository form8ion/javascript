Feature: Lift Remark

  @wip
  Scenario: convert .cjs to .json
    Given remark config is in "cjs" format
    And an "npm" lockfile exists
    And husky v5 is installed
    When the scaffolder results are processed
    Then remark config exists in "json" format
    And remark config exists in "cjs" format
