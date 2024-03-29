function allowedToDrive(age: number, hasLicense: boolean) {
  const allowedToDrive: boolean = age >= 18 && hasLicense;

  if (allowedToDrive) {
    // Allowed to drive;
  } else {
    // Not allowed to drive;
  }
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 4, 5
 * b) 1, 2, 4, 7
 *
 * Unreachable Execution Paths:
 * All paths are reachable!
 *
 * Parameters required for 100% test coverage of reachable paths:
 * a)   age=25
 *      hasLicense=true
 * b)   age=25
 *      hasLicense=false
 */
