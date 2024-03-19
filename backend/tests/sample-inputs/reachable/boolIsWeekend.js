function isWeekend(isWeekend, isHoliday) {
    if (isWeekend && !isHoliday) {
        console.log("Executed when weekend=true and isHoliday=false");
    } else {
        console.log("Executed when isWeekend=false or isHoliday=true");
    }
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 3
 * b) 1, 2, 5
 * 
 * Unreachable Execution Paths:
 * All paths are reachable!
 * 
 * Parameters required for 100% test coverage of reachable paths:
 * a)   isWeekend=true
 *      isHoliday=false
 * b)   isWeekend=false
 *      isHoliday=true
 */

