
import {Condition} from "./Condition";
import {CheckSatResult, init} from 'z3-solver';

export class ContextToZ3 {

    async checkPaths(paths: Condition[][]) {
        const { Context } = await init();
        const { Solver, Bool, Not, And, Int, LT, GE, GT, LE, Eq } = Context('main');
        for(let path of paths) {
            let pathConditions = [];
            let pathParams: {[id: string]: any} = {};
            let satisfyingAssignment: {[id: string]: any} = {}
            path.forEach((condition) => {
                let conditionString = condition.toString();
                let extractedContent = this.extractContent(conditionString)
                //TODO: Add more cases if necessary
                for (let paramKey of extractedContent) {
                    let conditionVariableType = condition.vars[paramKey];
                    switch (conditionVariableType) {
                        case 'number': {
                            if (!(paramKey in pathParams)) {
                                pathParams[paramKey] = Int.const(paramKey);
                            }
                            break;
                        }
                        case 'boolean': {
                            //TODO: Maybe put this in a function and add other operators
                            if (!(paramKey in pathParams)) {
                                pathParams[paramKey] = Bool.const(paramKey);
                            }

                            if (!conditionString.includes("!")) {
                                pathConditions.push(pathParams[paramKey]);
                                satisfyingAssignment[paramKey] = true;
                            }
                            break;
                        }
                    }
                }

                let conditionStringSplit = conditionString.match(/\s*([a-zA-Z0-9_]+|==|!=|<=|>=|[\!\>\<\=\&\|])\s*/g);
                let left: any, right: any;
                // Adjust conditionStringSplit based on the presence of '!' and split length
                //TODO: Make it so more complex conditions can be used
                if (conditionStringSplit.length == 3) {
                    left = pathParams[conditionStringSplit[0].trim()];
                    right = pathParams[conditionStringSplit[2].trim()];
                } else if (conditionStringSplit.length == 2 && conditionStringSplit[0].trim() === "!") {
                    left = pathParams[conditionStringSplit[1].trim()];
                    right = Bool.val(false); // Dummy variable to satisfy condition syntax
                }
                //Checks the length of the condition to see if it has multiple values
                if (conditionStringSplit.length == 3) {
                    switch (conditionStringSplit[1].trim()) {
                        case '>':
                            pathConditions.push(GT(left, right));
                            break;
                        case '>=':
                            pathConditions.push(GE(left, right));
                            break;
                        case '<':
                            pathConditions.push(LT(left, right));
                            break;
                        case '<=':
                            pathConditions.push(LE(left, right));
                            break;
                        case '==':
                            pathConditions.push(Eq(left, right));
                            break;
                        case '!=':
                            pathConditions.push(Not(Eq(left, right)));
                            break;
                        default:
                            console.error(`Unsupported operator: ${conditionStringSplit[1].trim()}`);
                            break;
                    }
                } else if (conditionStringSplit.length == 2) {
                    switch(conditionStringSplit[0].trim()) {
                        case "!":
                            pathConditions.push(Not(left));
                            satisfyingAssignment[left] = false;
                            break;
                        default:
                            console.error(`Unsupported operator: ${conditionStringSplit[1].trim()}`);
                            break;
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
                const satisfyingAssignmentOutput = Object.entries(satisfyingAssignment)
                    .map(([key, value]) => `${key}: ${value}`).join(', ');
                console.log("Z3 Satisfying Assignment: [ " + satisfyingAssignmentOutput + " ]");
            } else if (result === 'unsat') {
                //TODO: Add line number where code is not satisfiable
                console.log('Z3: Path is Unsatisfiable');
            } else {
                console.log('Z3: Unknown'); // The solver couldn't determine satisfiability
            }

        }
    }

    extractContent(input: string): string[] {
        const matches = input.match(/\((.*?)\)|!(\w+)|(\w+\s*(?:>\s*|==\s*|!=\s*|<\s*)\w+)|(\w+)/);
        if (matches) {
            if (matches[1]) {
                return matches[1].split(/\s*>\s*|\s*==\s*|\s*!=\s*|\s*<\s*/).filter(Boolean);
            } else if (matches[2]) {
                return ["!" + matches[2]];
            } else if (matches[3]) {
                return matches[3].split(/\s*>\s*|\s*==\s*|\s*!=\s*|\s*<\s*/).filter(Boolean);
            } else if (matches[4]) {
                return [matches[4]];
            }
        }
        return [];
    }







}