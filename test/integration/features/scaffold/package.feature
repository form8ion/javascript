Feature: Package Project Type

  Scenario: Minimal Options w/o Version Control
    Given the project will be a "Package"
    And the project will use the "babel" dialect
    And the project will not be versioned
    And the project will have "Private" visibility
    And the default answers are chosen
    And the npm cli is logged in
    And nvm is properly configured
    And a babel preset is provided
    When the project is scaffolded
    Then no repository details will be defined
    And the expected details are provided for a root-level project
    And the expected files for a "Package" are generated
    And the expected results for a "Package" are returned to the project scaffolder

  Scenario: Minimal Options w/ Version Control
    Given the project will be a "Package"
    And the project will use the "babel" dialect
    And the project will be versioned on GitHub
    And the project will have "Public" visibility
    And the default answers are chosen
    And the npm cli is logged in
    And nvm is properly configured
    And a babel preset is provided
    When the project is scaffolded
    Then repository details will be defined using the shorthand
    And the expected details are provided for a root-level project
    And the expected files for a "Package" are generated
    And the expected results for a "Package" are returned to the project scaffolder
    And provenance is enabled for publishing
    And publint is configured

  Scenario: Typescript Package
    Given the project will be a "Package"
    And the project will use the "typescript" dialect
    And the project will be versioned on GitHub
    And the project will have "Public" visibility
    And the default answers are chosen
    And the npm cli is logged in
    And nvm is properly configured
    And a babel preset is provided
    When the project is scaffolded
    Then the expected files for a "Package" are generated
    And the expected results for a "Package" are returned to the project scaffolder

  Scenario: ESM-only Package
    Given the project will be a "Package"
    And the project will use the "esm" dialect
    And the project will be versioned on GitHub
    And the project will have "Public" visibility
    And the default answers are chosen
    And the npm cli is logged in
    And nvm is properly configured
    And a babel preset is provided
    When the project is scaffolded
    Then no error is thrown
    And the expected files for a "Package" are generated
    And the expected results for a "Package" are returned to the project scaffolder

  Scenario: Simple Common JS package
    Given the project will be a "Package"
    And the project will use the "common-js" dialect
    And the project will be versioned on GitHub
    And the npm cli is logged in
    And nvm is properly configured
    And the project will not be tested
    And the package-type plugin modifies the lint-peer script
    And a babel preset is provided
    But the project will not be transpiled or linted
    When the project is scaffolded
    Then no error is thrown
    And repository details will be defined using the shorthand
    And the expected details are provided for a root-level project
    And the expected files for a "Package" are generated
    And Babel and ESLint are not scaffolded
    And the alternate lint-peer script is used

  Scenario: Common JS config package
    Given the project will be a "Package"
    And the project will use the "common-js" dialect
    And the project will have "Public" visibility
    And the project will be versioned on GitHub
    And the npm cli is logged in
    And nvm is properly configured
    And the project will not be tested
    And a babel preset is provided
    But the project will not be transpiled or linted
    And an example should not be provided
    When the project is scaffolded
    Then no error is thrown
    And the expected files for a "Package" are generated
    And the expected results for a "Package" are returned to the project scaffolder
    And provenance is enabled for publishing
    And publint is configured

  Scenario: Modern-JS package w/o an example
    Given the project will be a "Package"
    And the project will use the "babel" dialect
    And a babel preset is provided
    And the project will be versioned on GitHub
    And the project will have "Public" visibility
    And the default answers are chosen
    And the npm cli is logged in
    And nvm is properly configured
    But an example should not be provided
    When the project is scaffolded
    Then no error is thrown
    And the expected files for a "Package" are generated
    And the expected results for a "Package" are returned to the project scaffolder
