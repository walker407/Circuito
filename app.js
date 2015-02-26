var express         = require('express');
var session         = require('express-session');
var path            = require('path');
var favicon         = require('serve-favicon');
var logger          = require('morgan');
var cookieParser    = require('cookie-parser');
var bodyParser      = require('body-parser');
var multer          = require('multer');

var mongo = require('mongodb');
var monk  = require('monk');
var db    = monk('localhost:27017/Circuito');

var routes  = require('./routes/index');
var uploads = require('./routes/uploads');
var bom     = require('./routes/bom');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({
 
    dest: './uploads/',
        
    onFileUploadStart: function (file) {
        console.log(file.originalname + ' is starting ...')
    },

    onFileUploadComplete: function (file) {
        console.log(file.fieldname + ' uploaded to  ' + file.path)
        done=true;
    }
 
}));
app.use(cookieParser());
app.use(session({secret: '123456789QWERTY'}));
app.use(express.static(path.join(__dirname, 'public')));

//Link Database
app.use(function(req,res,next) {
   
    req.db = db;
    next();
    
});

//Link Routes
app.use('/', routes);
app.use('/uploads', uploads);
app.use('/bom',bom);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
