const isWeekend = true;
const isHoliday = false;

if (isWeekend && !isHoliday) {
  // This code block will execute on weekends (when not a holiday)
  console.log("Executed when weekend=true and isHoliday=false");
} else {
  // This code block will execute during weekdays or holidays
  console.log("Executed when isWeekend=false or isHoliday=true");
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 4, 6
 *
 * Unreachable Execution Paths:
 * a) 1, 2, 4, 9
 *
 * Parameters required for 100% test coverage of reachable paths:
 * NULL
 */
