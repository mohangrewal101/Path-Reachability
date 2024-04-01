function twoVarContradiction(a: boolean, b: boolean) {
  if (a && b) {
    if (!a || !b) {
      // This block is unreachable because condition1 cannot be true and false at the same time
    }
    // This block is reachable
  }
  // This block is also reachable
}

/**
 * Reachable Execution paths:
 * a & b
 * 1, 2, 3, 5, 6, 7, 8, 9
 *
 * !a & b
 * 1, 2, 8, 9
 *
 * Unreachable Execution Paths:
 * a & b & !a
 * 1, 2, 3, 4, 5, 6, 7, 8, 9
 *
 * Parameters required for 100% test coverage of reachable paths:
 * NULL
 */
