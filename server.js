const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

var app = express();

//set up partials for use
hbs.registerPartials(__dirname + '/views/partials');

//set your html view/templating engine
app.set('view engine', 'hbs');

//logger middleware we set up. logs go to server.log file
app.use((req, res, next) => {
  //next exists so you can tell express when your middleware is done
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
  next(); //must call next() for your app to continue to run
});

//maintenance mode middleware we set up
// app.use((req, res, next) => {
//   res.render('maintenance.hbs');
//   next();
// });

//Set up static directory to make public dir files available for use
  //use is express method to use middleware
  //static is middleware native to express
  //__dirname is shortcut to project directory
  //cannot use http://localhost:3000/help.html if we're in maintenance mode
app.use(express.static(__dirname + '/public'));

//helpers are reusable fns you can use within hbs files
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
  return text.toUpperCase();
});

//register a handler for get request
app.get('/', (req, res) => {
  // res.send('<h1>hello express! waddupppp</h1>');

  //express will automatically convert obj to json
  // res.send({
  //   name: 'Stephen',
  //   likes: [
  //     'food',
  //     'stuff'
  //   ],
  // });

  res.render('home.hbs', {
    pageTitle: 'Home Page',
    welcomeMsg: 'Welcome to the home page!'
  });
});

app.get('/about', (req, res) => {
  //use render to render templates
  //2nd obj arg is for data we want to inject into template
  res.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'Unable to fulfill this request'
  });
});

//binds a port to our machine
app.listen(3000, () => {
  console.log('Server is up on port 3000');
});
