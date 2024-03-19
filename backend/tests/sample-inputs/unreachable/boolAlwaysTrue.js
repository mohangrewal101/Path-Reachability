function alwaysTrue() {
    if (true) {
        console.log("This is always reachable.");
    } else {
        console.log("This is unreachable.");
    }
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 3
 * 
 * Unreachable Execution Paths:
 * a) 1, 2, 4
 * 
 * Parameters required for 100% test coverage of reachable paths:
 * NULL
 */