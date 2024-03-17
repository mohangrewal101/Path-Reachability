if (true) {
  if (false) {
    console.log("Nested unreachable code.");
  }
  console.log("Outer reachable code.");
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 5
 *
 * Unreachable Execution Paths:
 * a) 1, 2, 3, 5
 *
 * Parameters required for 100% test coverage of reachable paths:
 * NULL
 */
