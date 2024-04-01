function numContradiction(num1: number, num2: number) {
  if (num1 > num2) {
    // This block is reachable if num1 is greater than num2
  }

  if (num1 > num2 && num1 <= num2) {
    // This block is unreachable because num1 cannot be both greater than and less than or equal to num2 at the same time
  }
}

/**
 * Reachable Execution paths:
 * num1 > num2
 * 1, 2, 3,4, 6, 8, 9
 *
 * num 2 < num2
 * 1, 2, 4, 6, 8, 9
 *
 *
 * Unreachable Execution Paths:
 * num1 > num2 & num1 <= num2
 * 1, 2, 3,4, 6, 7, 8, 9
 *
 * num1 <= num2 & num1 > num2
 * 1, 2, 4, 6, 7, 8, 9
 *
 */
