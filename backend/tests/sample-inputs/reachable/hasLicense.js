function allowedToDrive(age, hasLicense) {
    const allowedToDrive = age >= 18 && hasLicense;

    if(allowedToDrive) {
        console.log("Let's go on a joyride!");
    } else {
        console.log("Go learn to drive!");
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
