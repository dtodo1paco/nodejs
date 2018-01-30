
// MAIN program
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
console.log("Wellcome to term calculator:");
rl.setPrompt('enter term (Ctrl + D to finish) > ');
rl.prompt();
rl.on('line', function (line) {
    if (line === "right") rl.close();
    var res = processTerm(line);
    console.log("RESULT: " + res);
    rl.prompt();
}).on('close', function () {
    process.exit(0);
});

// main function
function processTerm(_term) {
    var valuesStack = [];
    var operatorsStack = [];
    console.log("Processing: " + _term);

    var idx = 0;
    var term = null;
    for (var i = 0; i < _term.length; i++) {
        var next = readNext(idx, _term);
        idx = next.idx;
        term = next.term;
        if (isNumber(term)) {
            valuesStack.push(term);
        } else if (isOperator(term)) {
            if (term === '(') {
                operatorsStack.push(term);
            } else if (term === ')') {
                while (operatorsStack[operatorsStack.length - 1] !== '(') {
                    var operator = operatorsStack.pop();
                    var partial = calculate(valuesStack.pop(), valuesStack.pop(), operator);
                    console.log("resolving parenthesis: " + partial);
                    valuesStack.push(partial);
                }
                operatorsStack.pop(); // extract the closing parenthesis
            } else {
                while (operatorsStack.length > 0 && hasPrecedence(operatorsStack[operatorsStack.length - 1], term)) {
                    var operator = operatorsStack.pop();
                    var partial = calculate(valuesStack.pop(), valuesStack.pop(), operator);
                    console.log("resolving precedent operator: " + partial);
                    valuesStack.push(partial);
                }
                operatorsStack.push(term)
            }
        }
    }
    // Now resolve stacks
    console.log("RESOLVING...");
    while (operatorsStack.length > 0) {
        var operator = operatorsStack.pop();
        var partial = calculate(valuesStack.pop(), valuesStack.pop(), operator);
        console.log("partial is: " + partial);
        valuesStack.push(partial);
    }
    return valuesStack.pop();
}

/////////////////////
// helping functions
/////////////////////
/**
 * Reads next term of a calculator expression
 * @param idx param to begin to look
 * @param text expression
 * @returns {{idx: index to begin for next term, term: term found}}
 */
function readNext(idx, text) {
    var pos = idx;
    var c = text.charAt(pos);
    while (c === ' ') {
        pos = pos + 1;
        c = text.charAt(pos);
    }
    var idx1 = pos;
    var idx2 = idx1 + 1
    if (!isOperator(c)) {
        while (isNumber(c) && pos < text.length) {
            pos = pos + 1;
            c = text.charAt(pos);
        }
        idx2 = pos;
    }
    return {idx: idx2, term: text.substring(idx1, idx2)};
}
function isNumber(item) {
    return !!item.match(/[0-9]+/);
}
function isOperator(item) {
    var res = !!item.match(/[\(|\)|\+|\-|\*|\/]/);
    return res;
}
function hasPrecedence(op1, op2) {
    var op1OverOp2 = !!op1.match(/[\*|\/]/) && !!op2.match(/[\+|\-]/);
    return op1OverOp2;
}
function calculate(oper1, oper2, op) {
    var op1 = parseFloat(oper1);
    var op2 = parseFloat(oper2);
    switch (op) {
        case '+':
            return op1 + op2;
            break;
        case '-':
            return op1 - op2;
            break;
        case '*':
            return op1 * op2;
            break;
        case '/':
            return op1 / op2;
            break;
        default:
            if (op === '(') {
                error("You broke it! unbalanced parenthesis [" + op + "]");
            }
            error("You broke it! unexpected operator [" + op + "]");
    }
}
function error(message) {
    console.log("ERROR: " + message);
    process.exit(2);
}
