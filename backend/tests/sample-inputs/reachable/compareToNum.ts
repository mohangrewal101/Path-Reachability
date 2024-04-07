function compareToNum(a: number, b: number) {
  if (a == 10) {
    // do something
  }

  if (b > 20) {
    // do something
  } else {
    if (a * b < 100) {
      // do something
    }
    // do something here
  }
}

/**
 * Reachable Execution paths:
 * a = 10, b = 21
 * a) 1, 2, 3, 4, 6, 7, 14
 *
 * a = 10, b = 2
 * b) 1, 2, 3, 4, 6, 8, 9, 10, 11, 13 14
 *
 * a = 10, b = 20
 * c) 1, 2, 3, 4, 6, 8, 9, 11, 13 14
 *
 * a = 5, b = 21
 * d) 1, 2, 4, 6, 7, 14
 *
 * a = 5, b = 2
 * e) 1, 2, 4, 6, 8, 9, 10, 11, 13 14
 *
 * a=5, b=20
 * f) 1, 2, 4, 6, 8, 9, 11, 13 14
 *
 * Unreachable Execution Paths:
 * All paths are reachable!
 *
 */
