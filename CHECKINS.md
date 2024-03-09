Use this file to commit information clearly documenting your check-ins' content. If you want to store more information/details besides what's required for the check-ins that's fine too. Make sure that your TA has had a chance to sign off on your check-in each week (before the deadline); typically you should discuss your material with them before finalizing it here.

# Check-In 1 - March 1, 2024

## Current Project Ideas

Several ideas for projects are currently being explored:

- Automatic test case generation:
  - Examine the control flow through a function / series of functions and determine the test cases required to reach all branches.
  - It looks like this idea can become complicated very quickly, so we may need to define a narrow scope for this project or it may not be feasible to complete within 6 weeks.
- Deadlock determination:
  - Follow the control flow through a multi-threaded program and determine if at any point it may reach a deadlock scenario.
  - There are some academic papers on this topic which we may be able to reference when building it out.

## Follow-Up Tasks

- Continue to come up with ideas for projects.
- Speak with the TA / Alex / Caroline about the ideas and decide on one to pursue.
- Define the scope of the project and distribute the work to each of the group members.

# Check-In 2 - March 8, 2024

## Brief description of your planned program analysis (and visualization, if applicable) ideas.

The planned program analysis will determine which paths in a Typescript program are reachable, and which ones are not. It will make use of the Z3 theorem prover to solve the conditional logic, which will ultimately determine if all the conditionals required to reach a specific path in the program are satisfiable. If any conditionals leading to a given path are not satisfiable, the program will return the line numbers of the conditions that cannot be met under any circumstances.

Since the analysis will be performed on a real-world programming language (Typescript) and is a static analysis, there will not be any visualizations included as part of the project.

## Notes of any important changes/feedback from TA discussion.

Initially, the project was aimed at performing a static analysis to detect code smells in a program. It was determined that this generally did not meet the criteria for the project. The idea changed from there to focus on one specific code smell, finding the dead code in a program. We took this idea to the TA, who suggested we change the idea to detect paths that cannot be reached. He suggested we use the Z3 theorem prover to assist in determining if any given condition is satisfiable.

## Any planned follow-up tasks or features still to design.

There are several features that the group still needs to design:

- How will recursive calls be handled during program analysis? If there is a recursive call in a program that is being analyzed, how deep will the analysis go?
- What will the output of the program look like?
- How will the conditionals be collected, and how will this be translated into a format that can be used with Z3?

## Planned division of main responsibilities between team members.

| Name    | Responsibilities                                                          |
| ------- | ------------------------------------------------------------------------- |
| Alex    | Project setup, create data definitions and helper classes, video creation |
| Rodrigo | Testing for AST Traversal                                                 |
| Will    | AST Traversal implementation                                              |
| Mohan   | Create conversion from AST Context to input for Z3                        |
| Kenny   | Testing for Context transformation, video creation                        |

## Summary of progress so far.

So far the group has been conducting research on the Typescript AST and Z3. The initial project setup is underway.

## Roadmap for what should be done when, including specific goals for completion by future Milestones (propose at least three such goals per future Milestone, along with who will work on them; you can revise these later as needed).

| Item                                             | Responsible Individual(s) | Start Date | Expected Completion Date |
| ------------------------------------------------ | ------------------------- | ---------- | ------------------------ |
| Project Setup                                    | Alex                      | March 1    | March 8                  |
| Create Data Definitions                          | Alex                      | March 9    | March 9                  |
| AST Traversal Implementation                     | Will                      | March 10   | March 31                 |
| AST Context Transformation for Z3 Implementation | Mohan                     | March 10   | March 31                 |
| Testing - AST Traversal                          | Rodrigo                   | March 10   | March 31                 |
| Testing - Context Transformation                 | Kenny                     | March 10   | March 31                 |
| Integration Testing                              | Everyone                  | April 1    | April 4                  |
| Demo Creation                                    | Rodrigo                   | April 3    | April 4                  |
| Video Production                                 | Alex, Kenny               | April 5    | April 6                  |
| Project Submission                               | Everyone                  |            | April 7                  |
