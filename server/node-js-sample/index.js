var express = require('express');
var forms = require('forms');
var fields = forms.fields;
var validators = forms.validators;
var util = require('util');
var app = express();

app.set('port', (process.env.PORT || 5000));
//app.use(express.static(__dirname + '/public'));
app.set('view engine', 'jade');
app.set('views', './views');

var signup_form = forms.create({
    username: fields.string({ required: true }),
    password: fields.password({ required: validators.required('You definitely want a password') }),
    confirm:  fields.password({
        required: validators.required('don\'t you know your own password?'),
        validators: [validators.matchField('password')]
    }),
    email: fields.email()
});

app.get('/', function(request, response) {
  //response.send('Hello World!')
    response.render('signup_form', {title: 'signup', form: signup_form.toHTML()});
});

app.post('/signup', function(req,res){
    var data = {};
    if (req.method.toLowerCase() == 'get') {
        //displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }
    console.log("rendering: "+ JSON.stringify(data));
})

function processAllFieldsOfTheForm(req, res) {
    signup_form.handle(req, {
        success: function (form) {
            // there is a request and the form is valid
            // form.data contains the submitted data
            res.render('home', {title: 'signup', summary: util.inspect(form.data) });
        },
        error: function (form) {
            // the data in the request didn't validate,
            // calling form.toHTML() again will render the error messages
            res.render('signup_form', {title: 'signup', form: form.toHTML() });
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
