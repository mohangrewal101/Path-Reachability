function isSunny(isSunny: boolean, isWeekday: boolean, isSummer: boolean) {
  if (isSunny && (isWeekday || isSummer)) {
    console.log("execute on sunny weekdays or during summer");
  } else {
    console.log("unreachable code");
  }
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 3
 * b) 1, 2, 5
 *
 * Unreachable Execution Paths:
 * All paths are reachable!
 *
 * Parameters required for 100% test coverage of reachable paths:
 * a)   isSunny=true
 *      isWeekday=false
 *      isSummer=true
 * b)   isSunny=false
 *      isWeekday=true
 *      isSummer=true
 */
