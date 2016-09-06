var express = require('express');
var morgan = require('morgan'); // logger
var bodyParser = require('body-parser');

var app = express();
app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/../node_modules'));
app.use('/bundle', express.static(__dirname + '/bundle'));
app.use('/app', express.static(__dirname + '/app'));

// //Testing favicon
// app.use(favicon(join(__dirname, "../public", "favicon.ico")));
// app.use(express.static(join(__dirname, '../public')));
// //end


// app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));

app.use(express.static('./public'));



// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// app.use(morgan('dev'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://heroku_zqzb4k8p:5m32btqsmb2vgs4lgbeo749q51@ds019866.mlab.com:19866/heroku_zqzb4k8p');
var db = mongoose.connection;
mongoose.Promise = global.Promise;

// -------------------------------------------------

// // MongoDB Configuration configuration
// mongoose.connect('mongodb://heroku_zqzb4k8p:5m32btqsmb2vgs4lgbeo749q51@ds019866.mlab.com:19866/heroku_zqzb4k8p');
// var db = mongoose.connection;

// db.on('error', function (err) {
//     console.log('Mongoose Error: ', err);
// });

// db.once('open', function () {
//     console.log('Mongoose connection successful.');
// });



// -------------------------------------------------

// // mongojs configuration
// var mongojs = require('mongojs');
// // var databaseUrl = "scraper"; //for local
// var databaseUrl = "mongodb://heroku_m0x3bd23:4oe52tkq14f11u5tlobjk3gkj7@ds139645.mlab.com:39645/heroku_m0x3bd23";//for heroku
// var collections = ["scrapedData"];

// // hook our mongojs config to the db var
// var db = mongojs(databaseUrl, collections);
// db.on('error', function(err) {
//   console.log('Database Error:', err);
// });



// Models
var Employee = require('./employee.model.js');

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');

    // select all
    app.get('/employees', function(req, res) {
        Employee.find({}, function(err, docs) {
            if(err) return console.error(err);
            res.json(docs);
        });
    });

    // count all
    app.get('/employees/count', function(req, res) {
        Employee.count(function(err, count) {
            if(err) return console.error(err);
            res.json(count);
        });
    });

    // create
    app.post('/employee', function(req, res) {
        var obj = new Employee(req.body);
        obj.save(function(err, obj) {
            if(err) return console.error(err);
            res.status(200).json(obj);
        });
    });

    // find by id
    app.get('/employee/:id', function(req, res) {
        Employee.findOne({_id: req.params.id}, function (err, obj) {
            if(err) return console.error(err);
            res.json(obj);
        })
    });

    // update by id
    app.put('/employee/:id', function(req, res) {
        Employee.findOneAndUpdate({_id: req.params.id}, req.body, function (err) {
            if(err) return console.error(err);
            res.sendStatus(200);
        })
    });

    // delete by id
    app.delete('/employee/:id', function(req, res) {
        Employee.findOneAndRemove({_id: req.params.id}, function(err) {
            if(err) return console.error(err);
            res.sendStatus(200);
        });
    });


    // all other routes are handled by Angular
    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/public/index.html');
    });


    app.listen(app.get('port'), function() {
        console.log('MEAN app listening on port '+app.get('port'));
    });
});
