var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// Populates req.session
app.use('/mercury',session({  
  name:'session-mercury',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat',
  cookie: {        
    path:'/mercury'
  }
}));

app.use('/share',session({  
  name:'session-share',
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat',
  cookie: {        
    path:'/share'
  }
}));

app.get('/mercury', function(req, res){
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting mercury? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed mercury<strong>' + req.session.views + '</strong> times.</p>');
});

app.get('/share', function(req, res){
  var body = '';
  if (req.session.views) {
    ++req.session.views;
  } else {
    req.session.views = 1;
    body += '<p>First time visiting share? view this page in several browsers :)</p>';
  }
  res.send(body + '<p>viewed share<strong>' + req.session.views + '</strong> times.</p>');
});

/* istanbul ignore next */
// if (!module.parent) {
//   app.listen(3000);
//   console.log('Express started on port 3000');
// }
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/share',require('./routes/share'));
app.use('/mercury', require('./routes/mercury'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
