function simpleCompare(a: number, b: number) {
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
 * a) 1, 2, 3, 4, 5, 6, 7, 14
 * b) 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 13 14
 * c) 1, 2, 3, 4, 5, 6, 8, 9, 11, 13 14
 * d) 1, 2, 4, 5, 6, 7, 14
 * e) 1, 2, 4, 5, 6, 8, 9, 10, 11, 13 14
 * f) 1, 2, 4, 5, 6, 8, 9, 11, 13 14
 *
 * Unreachable Execution Paths:
 * All paths are reachable!
 *
 * /
