
import {Condition} from "./Condition";
import {CheckSatResult, init} from 'z3-solver';

export class ContextToZ3 {

    async checkPaths(paths: Condition[][]) {
        const { Context } = await init();
        const { Solver, Bool, Not, And, Or } = Context('main');
        for(let path of paths) {
            let pathConditions = [];
            let pathParams: {[id: string]: any} = {};

            path.forEach((condition) => {
                let conditionString = condition.toString();
                let paramKey = this.extractContent(conditionString);
                let conditionVariableType = condition.vars[paramKey];
                //TODO: Add more cases if necessary
                switch (conditionVariableType) {
                    case 'boolean': {
                        //TODO: Maybe put this in a function and add other operators
                        if (!(paramKey in pathParams)) {
                            pathParams[paramKey] = Bool.const(paramKey);
                        }

                        if (conditionString.includes("!")) {
                            pathConditions.push(Not(pathParams[paramKey]));
                        } else {
                            pathConditions.push(pathParams[paramKey]);
                        }
                    }
                }
            })
            const solver = new Solver();
            let combinedPath = And(...pathConditions);

            console.log("[ " + pathConditions.join(", "), "]");
            solver.add(combinedPath);

            const result: CheckSatResult = await solver.check();

            if (result === 'sat') {
                console.log('Z3: Path is Satisfiable');
            } else if (result === 'unsat') {
                //TODO: Add line number where code is not satisfiable
                console.log('Z3: Path is Unsatisfiable');
            } else {
                console.log('Z3: Unknown'); // The solver couldn't determine satisfiability
            }

        }
    }

    extractContent(input: string): string | null {
        const matches = input.match(/(?:\(|\[|\{)(.*?)(?:\)|\]|\})/);
        if (matches && matches.length > 1) {
            return matches[1];
        }
        return input;
    }





}