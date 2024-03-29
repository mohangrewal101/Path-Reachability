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

# Check-In 3 - March 15, 2024

## Mockup of how your project is planned to operate (as used for your first user study). Include any sketches/examples/scenarios.

The project will have a front-end where users can upload a program for analysis. The front-end will send the program to the server, where the analysis will be performed. The analysis will determine all potential execution paths through a program by keeping track of the conditional statements. The analysis will determine which paths cannot be executed (if the conditions required to work through a path are not satisfiable). If there is time to implement it, the program will suggest inputs to use to achieve the highest possible path coverage test score.

## Notes about first user study results.

The first user study went fairly well. Two potential users were sampled. Each user was asked to create a small function that accepted at least one value. The function was to have a few conditional statements that depended on the function parameters.

The first user submitted the following program:

```
export const getWeekend = (weekend: boolean) => {
  let day;
  if (weekend) {
    day = 6;
  } else {
    day = 1;
  }

  if (day === 0 || day === 6) {
    console.log('Weekend');
  } else {
    console.log('Weekday');
  }
};
```

This program yielded the following output:

```
Your possible execution paths are lines:
1) 2,4,10
2) 2,6,12

Your possible testing path coverage: 100%

Example test inputs for getWeekend to achieve 100% path coverage:
weekend = true,
weekend = false
```

The users thought this type of feedback was helpful, but wanted more explicit output indicating that there were no branches found that were not executable. One user suggested that for cases where branches were not executable, the analysis should provide suggestions for next steps. This however, does not seem like a feasible request for a small 6-week project.

## Any changes to original design.

Originally, the design of the analysis was to determine which code in the program was unreachable based on the conditional statements required to get to a specific block. If the chain of conditional statements to get to a specific block was not satisfiable, then that block would be marked "unreachable".

This was changed after a conversation with the TA this week, where the design pivoted to determining what all the potential paths through the program could be. From there, the conditional statements that determine the control flow through the program could be analyzed to see which paths could not be executed, based on if the chain of conditionals is satisfiable or not. Lastly, if there is time to implement this, the analysis tool will provide suggested program inputs that could go through all satisfiable paths.

After conducting the user study, the only additional change that would be made to the design is the output. It should explicitly state if there were no un-executable branches found in the program.

## Progress against the timeline planned for your team, including the specific goals you defined (as part of Check-in 2) for Check-in 3; any revisions to future Check-in goals.

The team may be a bit behind schedule, largely due to the pivot in design that occurred late this week. We need to spend some time determining how the analysis tool will determine the all the possible paths through a given program.

# Check-In 4 - March 22, 2024

## Status of implementation so far.

The implementation is going great so far.
We have implemented the bulk of the AST traversal to gather the required information for the analysis context object.
We have also completed the context transformation to input to Z3 to the point where we are able to determine if a given path of boolean conditions is satisfiable or not.
By Tuesday March 26 we are expecting to complete the MVP, where we are able to accept a program with boolean inputs, and output all possible paths through the program plus possible inputs for test cases where the path is satisfiable.
Following completion of the MVP, we will extend the functionality to include numeric function parameters, more complex conditional statements, and possibly function calls if there is enough time remaining.

## Plans for final user study.

Once the MVP is completed next week, we will be able to begin the final user study.
For this study, we will ask participants to use the MVP to analyze a simple program and examine the output.
Users will be asked about the usefulness of the output, and to provide feedback on other information they would like to see.
Based on the current rate of progress through the MVP, it is expected that we will administer the user study on March 26 or March 27.

## Planned timeline for the remaining days.

| Item                                                   | Responsible Individual(s) | Start Date | Expected Completion Date |
| ------------------------------------------------------ | ------------------------- | ---------- | ------------------------ |
| AST Traversal Implementation - MVP                     | Will                      | March 10   | March 26                 |
| AST Context Transformation for Z3 Implementation - MVP | Mohan                     | March 10   | March 26                 |
| MVP Completed                                          | Everyone                  |            | March 26                 |
| AST Traversal - Stretch Goals                          | Will                      | March 26   | March 31                 |
| Context Transformation - Stretch Goals                 | Mohan                     | March 26   | March 31                 |
| Testing - AST Traversal                                | Rodrigo                   | March 10   | March 31                 |
| Testing - Context Transformation                       | Kenny                     | March 10   | March 31                 |
| Stretch Goals Completed                                | Everyone                  |            | March 31                 |
| Integration Testing                                    | Everyone                  | April 1    | April 4                  |
| Demo Creation                                          | Rodrigo                   | April 3    | April 4                  |
| Video Production                                       | Alex, Kenny               | April 5    | April 6                  |
| Project Submission                                     | Everyone                  |            | April 7                  |

## Progress against the timeline planned for your team, including the specific goals you defined (originally as part of Check-in 2) for Check-in 4; any revisions to Check-in 5 goals.

The team is making lots of progress against the planned timeline.
We are expected to complete the first iteration of the project by March 26, which will include the ability to analyze simple programs with boolean parameters used in conditional statements.
This analysis will return a list of possible paths, indicate which of these paths are satisfiable, and a set of parameter values that can be used to test the paths that are satisfiable.

Since the MVP will be completed relatively early, the team will then focus on expanding the scope of the analysis to include programs with numeric parameters, and expanding the complexity of the conditional statements that can be analyzed.
These are fairly small extensions to the capabilities of the MVP, so it is still expected the team will be able to meet this milestone by March 31.
This timeline will give the team a full week to do extensive integration testing and documentation before producing the final video for submission.

# Check-In 5 - March 29, 2024

## Status of final user study; any feedback and changes planned.

### User Study 2 - User 1

- User 1 presented with an example program, asked to upload to the front end of the application
- The user thought the application was interesting.
- The user did not understand why the “unsatisfiable” paths would be useful to know about. Said we should consider removing these.
- The user thought it would be great if the program could generate the test case templates, since it is already outputting the variable assignments for satisfiable paths through the program.
- The user mentioned it would be beneficial if the application analysis was able to handle more complex conditions (like operators on numerical values, and variable assignments). The team is actively working on these features already.

### User Study 2 - User 2

- After doing a tour of the UI and seeing an example of how the program works, the user was unsure how useful this would be for their work. They did mention it might be useful for some machine learning applications that have a lot of conditional statements.
- User did like how the UI showed every execution path in the script, but was confused by the paths marked in red. I had to explain to him that those are not necessarily unreachable code, but rather that they are paths that have some kind of contradiction in the parameters used by Z3 (ie. a == !a). He suggested we exclude those from the UI and instead just mark in actual unreachable code.
- User suggested we make it more clear what parameters values are used for each path - maybe making the satisfying assignment on the right more clear.
- Many of the sample programs were crashing, so the user was not able to write a script that worked for the analyzer. We just explored the analyzer using test cases provided in the repo
- The program still needs more flexibility and error handling to prevent it from crashing when it encounters programs it can’t analyse.

## Plans for final video (possible draft version).

- The video will begin with a brief overview of the application and analysis that was built out.
- This will be followed with an overview of the process followed, and the results of the two user studies that were conducted. This part will highlight which feedback for improvement was given, and which feedback was actually implemented.
- Finally, a quick demonstration will be presented wherein a sample program is uploaded to the application. A few sample paths will be selected for review, and the video presenter will walk through the execution path and explain what would be happening to validate the execution path presented by the analysis is correct.

## Planned timeline for the remaining days.

- The MVP is currently working (for simple programs with boolean conditions, boolean program arguments, and no variable reassignments).
- The remaining items are to finish up the MVP extensions (numerical conditions, numerical program arguments, with variable declarations and reassignments).
- Once the last of the features are built out, the video will be recorded and submitted.

| Item                                   | Responsible Individual(s) | Start Date | Expected / Actual Completion Date |
| -------------------------------------- | ------------------------- | ---------- | --------------------------------- |
| MVP Completed                          | Everyone                  |            | March 27                          |
| AST Traversal - Stretch Goals          | Will                      | March 26   | March 31                          |
| Context Transformation - Stretch Goals | Mohan                     | March 26   | March 31                          |
| Testing - AST Traversal                | Rodrigo                   | March 10   | March 31                          |
| Testing - Context Transformation       | Kenny                     | March 10   | March 31                          |
| Stretch Goals Completed                | Everyone                  |            | March 31                          |
| Integration Testing                    | Everyone                  | April 1    | April 4                           |
| Demo Creation                          | Rodrigo                   | April 3    | April 4                           |
| Video Production                       | Alex, Kenny               | April 5    | April 6                           |
| Project Submission                     | Everyone                  |            | April 7                           |

## Progress against the timeline planned for your team, including the specific goals you defined (originally as part of Check-in 2) for Check-in 5.

- The progress is lining up fairly well with the planned timeline for the team. The MVP was finished one day after the original plan. The team still considered that to be a success!
- Progress is going well for the remaining items. The team is working on getting numerical values and conditions to work with the analysis, and to build it out further to handle simple variable assignments and reassignments.
- We are still targeting March 31 to complete these remaining items. This will give us a large buffer to complete sufficient testing and record the video.
