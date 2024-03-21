Feature: Non-JavaScript Project

  Scenario: project is not javascript
    When the scaffolder results are processed
    Then no error is thrown
    And the project is determined to not be a JavaScript project
