function compareToConst(num: number) {
  const CONSTANT_ONE = 10;
  const CONSTANT_TWO = 20;

  if (num < CONSTANT_ONE && num >= CONSTANT_TWO) {
    // This block is unreachable
  } else if (num >= CONSTANT_ONE && num < CONSTANT_TWO) {
    // This block is reachable if 'value' is between 10 and 20
  } else {
    // This block is reachable if 'value' is less than 10 or greater than or equal to 20
  }
}

/**
 * Reachable Execution paths:
 * num < 10 | num > 20
 * 1, 2, 3, 5, 7, 9, 10, 11, 12
 *
 * num > 10 && num < 20
 * 1, 2, 3, 5, 7, 8, 11, 12
 *
 *
 * Unreachable Execution Paths:
 * num < 10 && num >= 20
 * 1, 2, 3, 5, 6, 11, 12
 */
