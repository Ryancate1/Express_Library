// Requires
const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
// End of Requires


const app = express();
const port = process.env.PORT || 3000;


// Middleware
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'library' }));

require('./src/config/passport.js')(app);
app.use(express.static(path.join(__dirname, '/public')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')))
app.set('views', './src/views');
app.set('view engine', 'ejs');


const nav = [
   { link: '/books', title: 'Book' },
   { link: '/authors', title: 'Author' }
];
const bookRouter = require('./src/routes/bookRoutes')(nav);
const adminRouter = require('./src/routes/adminRoutes')(nav);
const authRouter = require('./src/routes/authRoutes')(nav);


// Routing
app.use('/books', bookRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.render(
    'index', {
      title: 'Library',
      nav: [{
        link: '/books',
        title: 'Books'
      }, {
        link: '/authors',
        title: 'authors'
      }]
    });
});



// Initiate Server
app.listen(port, () => {
  debug(`Listening on port ${chalk.green(port)}`);
});