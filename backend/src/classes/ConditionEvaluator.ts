import * as ts from "typescript";
import {PrefixUnaryExpression, SyntaxKind} from "typescript";
import { CustomContext } from "./CustomContext";

const WARNING = true;

const warn = (...args: any[]) => {
    if (WARNING) {
        console.warn(...args);
    }
};


export class ConditionEvaluator {
    z3Context;
    pathParams: { [id: string]: any } = {};
    jumpTable: any;
    constructor(z3Context) {
        this.z3Context = z3Context;
        this.jumpTable = {
            [SyntaxKind.Identifier]: this.visitIdentifier,
            [SyntaxKind.PrefixUnaryExpression]: this.visitPrefixUnaryExpression,
            [SyntaxKind.ParenthesizedExpression]: this.visitParenthesizedExpression,
            [SyntaxKind.BinaryExpression]: this.visitBinaryExpression,
            [SyntaxKind.NonNullExpression]: this.visitNonNullExpression,
            [SyntaxKind.ExclamationToken]: this.visitExclamationToken,
            [SyntaxKind.BarBarToken]: this.visitBarBarToken,
            [SyntaxKind.AmpersandAmpersandToken]: this.visitAmpersandAmpersandToken,
            [SyntaxKind.LessThanToken]: this.visitLessThanToken,
            [SyntaxKind.LessThanEqualsToken]: this.visitLessThanEqualsToken,
            [SyntaxKind.GreaterThanToken]: this.visitGreaterThanToken,
            [SyntaxKind.EqualsGreaterThanToken]: this.visitEqualsGreaterThanToken,
            [SyntaxKind.EqualsEqualsToken]: this.visitEqualsEqualsToken,
            [SyntaxKind.ExclamationEqualsToken]: this.visitNotEqualsToken,
            [SyntaxKind.FirstLiteralToken]: this.visitFirstLiteralToken
        };

    }

    setPathParams = (pathParams: { [id: string]: any }) => {
        this.pathParams = pathParams;
    }

    visitCondition = (context: CustomContext, node: ts.Node) => {
        if (Object.prototype.hasOwnProperty.call(this.jumpTable, node.kind)) {
            const visitFn = this.jumpTable[node.kind];
            return visitFn(context, node);
        } else {
            warn(
                "Found an unspecified condition: ",
                node.getText(),
                ", ",
                ts.SyntaxKind[node.kind]
            );
        }
    }

    visitIdentifier = (context: CustomContext, node: ts.Identifier) => {
        console.log("Found identifier: ", node.getText());
        return this.pathParams[node.getText().toString()];
    }


    visitPrefixUnaryExpression = (context: CustomContext, node: ts.PrefixUnaryExpression) => {
        console.log("Found a prefix unary expression: ", node.getText());
        let unaryValue = this.visitCondition(context, node.getChildren()[0]);
        if (unaryValue == "!") {
            return this.z3Context.Not(this.visitCondition(context, node.operand));
        }
    }

    visitParenthesizedExpression = (context: CustomContext, node: ts.ParenthesizedExpression) => {
        console.log("Found a parenthesized expression: ", node.getText());
        if (Object.prototype.hasOwnProperty.call(this.jumpTable, node.expression.kind)) {
            const visitFn = this.jumpTable[node.expression.kind];
            return visitFn(context, node.expression);
        } else {
            warn(
                "found an unspecified paranthesized expression: ",
                node.expression.getText(),
                ", ",
                ts.SyntaxKind[node.kind]
            );
        }
    }

    visitBinaryExpression = (context: CustomContext, node: ts.BinaryExpression) => {
        console.log("Found a binary expression: ", node.getText());
        if (Object.prototype.hasOwnProperty.call(this.jumpTable, node.operatorToken.kind)) {
            const visitFn = this.jumpTable[node.operatorToken.kind];
            return visitFn(context, node.left, node.operatorToken, node.right);
        } else {
            warn(
                "found an unspecified operator: ",
                node.operatorToken.getText(),
                ", ",
                ts.SyntaxKind[node.kind]
            );
        }

    }

    visitNonNullExpression = (context: CustomContext, node: ts.NonNullExpression) => {
        console.log("Found non null expression ", node.expression.getText());
    }

    visitExclamationToken = (context: CustomContext, node: ts.ExclamationToken) => {
        console.log("Found exclamation token ", node.getText());
        return "!";
    }


    visitBarBarToken = (context: CustomContext, leftNode: ts.Node,
                        operatorNode: ts.Node,
                        rightNode: ts.Node) => {
        console.log("Found bar bar token ", operatorNode.getText());
        return this.z3Context.Or(this.visitCondition(context, leftNode),
            this.visitCondition(context, rightNode));
    }

    visitAmpersandAmpersandToken = (context: CustomContext, leftNode: ts.Node,
                                    operatorNode: ts.Node,
                                    rightNode: ts.Node) => {
        console.log("Found ampersand ampersand token ", operatorNode.getText());
        return this.z3Context.And(this.visitCondition(context, leftNode),
            this.visitCondition(context, rightNode));
    }

    visitGreaterThanToken = (context: CustomContext, leftNode: ts.Node,
                          operatorNode: ts.Node,
                          rightNode: ts.Node) => {
        console.log("Found greater than token ", operatorNode.getText());
        return this.z3Context.GT(this.visitCondition(context, leftNode),
            this.visitCondition(context, rightNode));

    }

    visitEqualsGreaterThanToken = (context: CustomContext, leftNode: ts.Node,
                                operatorNode: ts.EqualsGreaterThanToken,
                                rightNode: ts.Node) => {
        console.log("Found greater than equals token ", operatorNode.getText());
        return this.z3Context.GE(this.visitCondition(context, leftNode),
            this.visitCondition(context, rightNode));
    }

    visitLessThanToken = (context: CustomContext, leftNode: ts.Node,
                       operatorNode: ts.Node,
                       rightNode: ts.Node) => {
        console.log("Found less than token ", operatorNode.getText());
        return this.z3Context.LT(this.visitCondition(context, leftNode),
            this.visitCondition(context, rightNode));

    }

    visitLessThanEqualsToken = (context: CustomContext, leftNode: ts.Node,
                             operatorNode: ts.Node,
                             rightNode: ts.Node) => {
        console.log("Found less than equals token ", operatorNode.getText());
        return this.z3Context.LE(this.visitCondition(context, leftNode),
            this.visitCondition(context, rightNode));

    }

    visitEqualsEqualsToken = (context: CustomContext, leftNode: ts.Node,
                           operatorNode: ts.Node,
                           rightNode: ts.Node) => {
        console.log("Found equals equals token ", operatorNode.getText());
        return this.z3Context.Eq(this.visitCondition(context, leftNode),
            this.visitCondition(context, rightNode));


    }

    visitNotEqualsToken = (context: CustomContext, leftNode: ts.Node,
                           operatorNode: ts.Node,
                           rightNode: ts.Node) => {
        console.log("Found not equals token ", operatorNode.getText());
        return this.z3Context.Not(this.z3Context.Eq(this.visitCondition(context, leftNode),
            this.visitCondition(context, rightNode)));

    }

    visitFirstLiteralToken = (context: CustomContext, node: ts.Node) => {
        console.log("Found a number/literal token: ", node.getText());
        return Number(node.getText());
    }
}