
import {Condition} from "../src/classes/Condition";
import {CheckSatResult, init} from 'z3-solver';

export class ContextToZ3 {

    async checkPaths(paths: Condition[][]) {
        const { Context } = await init();
        const { Solver, Bool, Not, And, Or } = Context('main');
        const solver = new Solver();
        let availablePaths = [];

        paths.forEach((path) => {
            let pathParams = [];
            path.forEach((condition) => {
                let conditionVariableType = condition.vars[condition.toString()];
                //TODO: Add more cases if necessary
                switch (conditionVariableType) {
                    case 'boolean': {
                        //TODO: Maybe put this in a function and add other operators
                        let conditionString = condition.toString();
                        if (conditionString.includes("!")) {
                            pathParams.push(Not(Bool.const(conditionString)));
                        } else {
                            pathParams.push(Bool.const(conditionString));
                        }
                    }
                }
            })
            let combinedPaths = And(...pathParams);
            availablePaths.push(combinedPaths);
        });


        solver.add(Or(...availablePaths));
        const result: CheckSatResult = await solver.check();
        if (result === 'sat') {
            return 'Code is Satisfiable'; // At least one path is reachable
        } else if (result === 'unsat') {
            //TODO: Add line number where code is not satisfiable
            return 'Code is not Unsatisfiable'; // No paths are reachable
        } else {
            return 'Unknown'; // The solver couldn't determine satisfiability
        }
    }





}