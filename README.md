# MountainPath

## Table of Contents

1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Analysis Capabilities](#analysis-capabilities)
4. [Future Work](#future-work)
5. [How It Works](#how-it-works)
6. [Libraries Used](#libraries-used)

## Overview

MountainPath is a static analysis tool used to visualize viable execution paths through a given TypeScript program.
Users can upload a Typescript file through the user interface, and after some processing the tool will display the full list of possible execution paths through the program.
After clicking on one of the execution paths, the tool will highlight all the lines executed and the following summary information:

- Whether or not the selected path is "satisfiable". That is, whether this particular execution can be run at all.
- What the require function parameter assignments would need to be to execute this path.

## Getting Started

### System Requirements

To run MountainPath locally, please ensure that you have the following pieces of software installed on your machine:

- `npm`
- `node`

### Installing Dependencies

To install project dependencies, open a terminal in the project root directory and follow these steps:

1. From the project root directory, run `cd frontend && npm install`.
2. From the project root directory, run `cd backend && npm install`.

### Starting the Project

To run the project, open two terminals and follow these steps:

1. In one terminal, run `cd frontend && npm run dev` from the project root directory.
2. In a second terminal, run `cd backend && npm run dev` from the project root directory.
3. Open `http://localhost:5173/` in your web browser.

## Analysis Capabilities

MountainPath can currently analyze TypeScript files with the following properties:

- The file contains the definition of a single function.
- The function parameters are either numbers or boolean.
- The function does not have any loops or function calls.
- Variables are not reassigned inside the function.
- Conditional statements inside the function body make use of only the numerical and boolean variables provided in the function parameters, or declared in the function body.

## Future Work

Given additional time, the team would continue the work on MountainPath and introduce this next set of capabilities:

- Loops: Add the ability to highlight execution paths through loops in provided programs.
- Function Calls: Add the ability for the analysis to jump to other functions.
- Recursive Function Calls: Add the ability for the analysis to jump from one function into itself in recursive calls.

## How It Works

Upon uploading a Typescript file to the user interface, the contents of the file are sent to the server.
The server will first attempt to compile the file using the Typescript compiler, and if there are errors these will be sent back to the user interface to alert the user.
If the file compiles successfully, the server will traverse the program AST.
It collects information on the function parameters, the line numbers of blocks surrounded by `if` and `else` clauses, and the conditions specified in `if` statements. The result of this traversal is an n-ary tree, with nodes representative of the conditional statements in the program. This tree is traversed to determine all the possible paths through the program. Each path of conditions is evaluated for satisfiability using the Z3 theorem prover. Finally, the satisfiability data, and the lines executed, for each path are sent back to the user interface.

## Libraries Used

- **TypeScript**: This library is used to traverse the AST of TypeScript files.
- **ts-morph**: This library is used to attempt a compilation of the program the user uploads to the server.
- **Z3**: This is a theorem prover that can be used to determine the satisfiability of a series of conditional statements. For those satisfiable paths, it outputs the satisfying assignments for each variable appearing in the conditional statements.
- **React**: This library is used to create the interactive user interface.
- **Material UI**: This is a React component library, and was used in building out the user interface.
- **Jest**: This is a testing framework that was used to test the AST traversal and context evaluation.

## Testing

We used the Jest testing framework to write automated tests of the AST traversal and context evaluation. This allowed us to ensure not only that the AST traversal and contaxt evaluation would not crash, but also to ensure that Z3 received the correct input to evaluate. We wrote a number of sample scripts that met the accepted language features to test that the evaluator was able to handle all of these features. These sample scripts were also used to test the frontend and ensure that Z3 did not crash or hang when evaluating the path satisfiability.
