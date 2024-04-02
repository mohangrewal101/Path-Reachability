function isWeekend(isWeekend: boolean, isHoliday: boolean) {
  if (isWeekend || isHoliday) {
    // do something here
    if (isWeekend && isHoliday) {
      // do something else
    }

    if (!isHoliday) {
      // do something else
    }
  }
}

/**
 * Reachable Execution paths:
 * isWeekend = true, isHoliday = true
 * a) 1, 2, 3, 4, 5, 6, 8, 10, 11 12
 *
 * isWeekend = true, isHoliday = false
 * b) 1, 2, 3, 4, 6, 8, 9, 10, 11, 12
 *
 * isWeekend = false, isHoliday = true
 * c) 1, 2, 3, 4, 6, 8, 10, 11, 12
 *
 * isWeekend = false, isHoliday = false
 * d) 1, 11, 12
 *
 * Unreachable Execution Paths:
 * isWeekend = true, isHoliday = true & false
 * c) 1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12
 */
