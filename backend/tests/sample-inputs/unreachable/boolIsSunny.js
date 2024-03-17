const isSunny = true;
const isWeekday = false;
const isSummer = true;

if (isSunny && (isWeekday || isSummer)) {
  console.log("execute on sunny weekdays or during summer");
} else {
  console.log("unreachable code");
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 3, 5, 6
 *
 * Unreachable Execution Paths:
 * a) 1, 2, 3, 5, 8
 *
 * Parameters required for 100% test coverage of reachable paths:
 * NULL
 */
