const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
   User.findById('60fa44c85d40f02ec8445298')
    .then(user => {
      req.user = user;
       next();     })
    .catch(err => console.log(err));
 });

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://Vicky:fallen906@cluster0.6dmki.mongodb.net/CartIT?retryWrites=true&w=majority'
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'Vikas',
          email: 'vikasml.2609@gmail.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
 

    app.listen(3000);
  })
  .catch(err => {
    console.log(err);
  });

