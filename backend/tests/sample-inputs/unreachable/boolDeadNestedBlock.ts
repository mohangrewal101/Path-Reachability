function desdNestedLoop(a: boolean) {
  if (a) {
    if (!a) {
      // Permanently unreachable code
    }
    // reachable code
  }
}

/**
 * Reachable Execution paths:
 * a & a
 * 1, 2, 3, 5, 6, 7, 8
 *
 * !a
 * 1, 2, 7, 8
 *
 * Unreachable Execution Paths:
 * a & !a
 * a) 1, 2, 3, 5, 6, 7, 8
 *
 * Parameters required for 100% test coverage of reachable paths:
 * NULL
 */
