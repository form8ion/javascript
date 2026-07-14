Feature: Scaffold CI workflow

  Background:
    Given the project will use the "esm" dialect
    And the default answers are chosen
    And the npm cli is logged in
    And nvm is properly configured
    And the project will be a "any"

  Scenario: Scaffold CI workflow
    Given the CI service is configured for the repository
    When the project is scaffolded
    Then the CI workflow is scaffolded

  Scenario: No CI service configured for the repository
    Given the CI service is not configured for the repository
    When the project is scaffolded
    Then no CI workflow is scaffolded
