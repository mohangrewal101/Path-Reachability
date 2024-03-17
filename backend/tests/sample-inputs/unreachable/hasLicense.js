const age = 25;
const hasLicense = true;

const allowedToDrive = age >= 18 && hasLicense;

if (allowedToDrive) {
  console.log("Let's go on a joyride!");
} else {
  console.log("unreachable code here");
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 4, 6, 7
 *
 * Unreachable Execution Paths:
 * a) 1, 2, 4, 6, 9
 *
 * Parameters required for 100% test coverage of reachable paths:
 * NULL
 */
