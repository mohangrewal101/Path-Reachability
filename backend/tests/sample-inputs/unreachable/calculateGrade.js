function calculateGrade(score, total, cheated) {
  let percentage = (score / total) * 100;
  let grade = "";

  if (percentage >= 90) {
    grade = "A";
  } else if (percentage >= 80 && percentage < 90) {
    grade = "B";
  } else if (percentage >= 70 && percentage < 80) {
    grade = "C";
  } else if (percentage >= 50 && percentage < 70) {
    grade = "D";
  } else {
    grade = "F";
  }

  cheated = false;

  if (cheated) {
    grade = "F";
  }

  return grade;
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 3, 5, 6, 17, 19, 23
 * b) 1, 2, 3, 5, 7, 8, 17, 19, 23
 * c) 1, 2, 3, 5, 7, 9, 10, 17, 19, 23
 * d) 1, 2, 3, 5, 7, 9, 11, 12, 17, 19, 23
 * e) 1, 2, 3, 5, 7, 9, 11, 14, 17, 19, 23
 *
 * Unreachable Execution Paths:
 * a) 1, 2, 3, 5, 6, 17, 19, 20, 23
 * b) 1, 2, 3, 5, 7, 8, 17, 19, 20, 23
 * c) 1, 2, 3, 5, 7, 9, 10, 17, 19, 20, 23
 * d) 1, 2, 3, 5, 7, 9, 11, 12, 17, 19, 20, 23
 * e) 1, 2, 3, 5, 7, 9, 11, 14, 17, 19, 20, 23
 *
 * Parameters required for 100% test coverage of reachable paths:
 * a)   score=90
 *      total=100
 *      cheated=false
 * b)   score=80
 *      total=100
 *      cheated=false
 * c)   score=70
 *      total=100
 *      cheated=false
 * d)   score=50
 *      total=100
 *      cheated=false
 * e)   score=49
 *      total=100
 *      cheated=false
 */
