Feature: Running Cucumber with Kommando

  Scenario: Verifying GitHub
  Given I go to "https://www.github.com"
  Then the headline should equal "Build software better, together."
