
// MAIN program
var readline = require('readline');
var rl = readline.createInterface(process.stdin, process.stdout);
console.log("Wellcome Peter, tell me the number where you left:");
rl.setPrompt('enter number (Ctrl + D to finish) > ');
rl.prompt();
rl.on('line', function (line) {
    if (line === "right") rl.close();
    var res = processNumber(line);
    console.log("RESULT: " + res);
    rl.prompt();
}).on('close', function () {
    process.exit(0);
});

function processNumber(number) {
    if (!isNumber(number)) {
        return "Wow! Type a valid number please";
    }
    if (parseInt(number) >= Math.pow(10, 18)) {
        return "Wow! Type a valid number under 10^18";
    }
    var result = number;
    var lastMax = 0;
    var i = 0;
    var pos = -1; // pos to break number
    // search in the number
    for (i; i < number.length; i++) {
        var n = parseInt(number.charAt(i));
        if (n > lastMax) {
            lastMax = n;
        } else if (n < lastMax) {
            pos = i - 1;
            break;
        } else {
            // nothing to do
        }
    }
    if (pos > 0) { // we have to build the result
        result = "";
        var numberLength = number.length;
        var key = parseInt(number.charAt(pos));
        var numberBefore = parseInt(number.charAt(pos-1));
        var n = 0;
        if (key == numberBefore) { // then, decreasing key will not be correct
            pos = pos - 1;
            n = numberBefore - 1;
        } else {
            n = key - 1;
        }
        if (n == 0) { // we have lost 1 order
            numberLength = numberLength - 1;
            pos = number.indexOf('1');
            n = 9;
        }
        // build 1st part of number
        for (var j=0; j < pos; j++) {
            result += number.charAt(j);
        }
        result += n;
        // build 2nd part of number
        for (var j=pos+1; j<numberLength; j++) {
            result += '9';
        }
    }
    return result;
}


/////////////////////
// helping functions
/////////////////////

function isNumber(item) {
    return !!item.match(/[0-9]+/);
}
function error(message) {
    console.log("ERROR: " + message);
    process.exit(2);
}
