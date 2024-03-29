Feature: Application Project Type

  Scenario: Minimal Options for an Application
    Given the project will be an "Application"
    And the project will use the "babel" dialect
    And the project will be versioned on GitHub
    And the default answers are chosen
    And the project will have "Public" visibility
    And the npm cli is logged in
    And nvm is properly configured
    And a babel preset is provided
    When the project is scaffolded
    Then no error is thrown
    And the expected details are provided for a root-level project
    And the expected files for an "Application" are generated
    And the "babel" dialect is configured
    And repository details will be defined using the shorthand
    And the expected results for an "Application" are returned to the project scaffolder

  Scenario: Application with application-type plugin applied
    Given the project will be an "Application"
    And the project will use the "babel" dialect
    And a babel preset is provided
    And the default answers are chosen
    And the npm cli is logged in
    And nvm is properly configured
    And an application-type plugin is chosen
    When the project is scaffolded
    Then no error is thrown
    And the "babel" dialect is configured
    And the expected files for an "Application" are generated
