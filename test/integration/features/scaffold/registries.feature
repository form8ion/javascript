Feature: Scaffold Registries

  Scenario: registries defined for scopes
    Given the project will be an "any"
    And the project will use the "babel" dialect
    And a babel preset is provided
    And the npm cli is logged in
    And the project will not be tested
    And nvm is properly configured
    And registries are defined for scopes
    When the project is scaffolded
    Then no error is thrown
    And the registry configuration is defined

  Scenario: registry override
    Given the project will be an "any"
    And the project will use the "babel" dialect
    And a babel preset is provided
    And the npm cli is logged in
    And the project will not be tested
    And nvm is properly configured
    And an override is defined for the official registry
    When the project is scaffolded
    Then no error is thrown
    And the registry configuration is defined

  Scenario: alternate registry for publishing packages
    Given the project will be a "Package"
    And the project will use the "babel" dialect
    And a babel preset is provided
    And the npm cli is logged in
    And the project will not be tested
    And nvm is properly configured
    And an alternative registry is defined for publishing
    When the project is scaffolded
    Then no error is thrown
    And the registry configuration is defined
    And the publish registry is defined

  Scenario: alternate registry for publishing CLI packages
    Given the project will be a "CLI"
    And the project will use the "babel" dialect
    And a babel preset is provided
    And the npm cli is logged in
    And the project will not be tested
    And nvm is properly configured
    And an alternative registry is defined for publishing
    When the project is scaffolded
    Then no error is thrown
    And the registry configuration is defined
    And the publish registry is defined
