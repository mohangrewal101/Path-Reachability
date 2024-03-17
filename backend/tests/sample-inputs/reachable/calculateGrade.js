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
        grade = "F"
    }

    if(cheated) {
        grade = "F"
    }

    return grade;
}

/**
 * Reachable Execution paths:
 * a) 1, 2, 3, 5, 6, 17, 21
 * b) 1, 2, 3, 5, 6, 17, 18, 21
 * c) 1, 2, 3, 5, 7, 8, 17, 21
 * d) 1, 2, 3, 5, 7, 8, 17, 18, 21
 * e) 1, 2, 3, 5, 7, 9, 10, 17, 21
 * f) 1, 2, 3, 5, 7, 9, 10, 17, 18, 21
 * g) 1, 2, 3, 5, 7, 9, 11, 12, 17, 21
 * h) 1, 2, 3, 5, 7, 9, 11, 12, 17, 18, 21
 * i) 1, 2, 3, 5, 7, 9, 11, 14, 17, 21
 * j) 1, 2, 3, 5, 7, 9, 11, 14, 17, 18, 21
 * 
 * Unreachable Execution Paths:
 * All paths are reachable!
 * 
 * Parameters required for 100% test coverage of reachable paths:
 * a)   score=90
 *      total=100
 *      cheated=false
 * b)   score=90
 *      total=100
 *      cheated=true
 * c)   score=80
 *      total=100
 *      cheated=false
 * d)   score=80
 *      total=100
 *      cheated=true
 * e)   score=70
 *      total=100
 *      cheated=false
 * f)   score=70
 *      total=100
 *      cheated=true
 * g)   score=50
 *      total=100
 *      cheated=false
 * h)   score=70
 *      total=100
 *      cheated=true
 * i)   score=49
 *      total=100
 *      cheated=false
 * j)   score=49
 *      total=100
 *      cheated=true
 */