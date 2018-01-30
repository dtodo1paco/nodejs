var express = require('express');
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var util = require('util');
var app = express();
var calculator = require('./calculator.js');


app.set('port', (process.env.PORT || 5000));
app.use('/static', express.static('public'));

app.set('view engine', 'jade');
app.set('views', './views');

var calculator_form = forms.create({
    expression: fields.string({ required: validators.required('Please, enter a valid term to calculate or a function to plot') })
});

app.get('/', function(request, response) {
    response.render('calculator', {title: 'calculator', form: calculator_form.toHTML()});
});

app.post('/calculate', function(req,res){
    var data = {};
    if (req.method.toLowerCase() == 'get') {
        response.render('calculator', {title: 'calculator', form: calculator_form.toHTML()});
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }
})

function processAllFieldsOfTheForm(req, res) {
    calculator_form.handle(req, {
        success: function (form) {
            // there is a request and the form is valid
            // form.data contains the submitted data
            console.log("data:" + JSON.stringify(form.data));
            var exp = form.data.expression;
            if (exp.indexOf('=') === -1) {
                result = calculator.processTerm(exp);
                form.data.result = result;
            } else {
                var xValues = [];
                var yValues = [];
                var expY = exp.replace('y=','');
                for (var x = 0; x < 10; x++) {
                    var expX = expY.replaceAll('x',x);
                    var y = calculator.processTerm(expX);
                    xValues.push(x);
                    yValues.push(y);
                }
                var line = {
                    x: xValues,
                    y: yValues,
                    type: 'scatter'
                };
                form.data.lines = [];
                form.data.lines.push(line);
            }
            res.render('calculator', {title: 'result', form: form.toHTML(), data: form.data });
        },
        error: function (form) {
            // the data in the request didn't validate,
            // calling form.toHTML() again will render the error messages
            res.render('calculator', {title: 'calculator', form: form.toHTML() });
        },
        empty: function (form) {
            // there was no form data in the request
            console.log("empty form");
        }
    });
}

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
});

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};