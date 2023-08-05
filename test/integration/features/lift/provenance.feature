Feature: Package Provenance

  Scenario: Public Package with provenance
    Given an "npm" lockfile exists
    And the project is of type "Publishable"
    And the package is published publicly
    And the package is published with provenance
    And husky v5 is installed
    When the scaffolder results are processed
    Then provenance is enabled for publishing
    And the SLSA badge is added to the status group

  Scenario: Public Package without provenance
    Given an "npm" lockfile exists
    And the project is of type "Publishable"
    And the package is published publicly
    And the package is published without provenance
    And husky v5 is installed
    When the scaffolder results are processed
    And provenance is enabled for publishing
    Then the SLSA badge is added to the status group

  @wip
  Scenario: Public Package on registry that does not support provenance
    Given an "npm" lockfile exists
    And the project is of type "Publishable"
    And the package is published publicly
    And the package is published without provenance
    And the package is published to an alternative registry
    And husky v5 is installed
    When the scaffolder results are processed
    And provenance is not enabled for publishing
    And no SLSA badge is added

  Scenario: Restricted Package
    Given an "npm" lockfile exists
    And the project is of type "Publishable"
    And the package access is restricted
    And husky v5 is installed
    When the scaffolder results are processed
    Then provenance is not enabled for publishing
    And no SLSA badge is added

  Scenario: Non-Package
    Given an "npm" lockfile exists
    And husky v5 is installed
    And the project is of type "Application"
    When the scaffolder results are processed
    Then provenance is not enabled for publishing
    And no SLSA badge is added
