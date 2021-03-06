const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: '123',
    database: 'smart-brain'
  }
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  return db.select('*').from('users')
          .then(user => {
            res.json(user);
          })
          .catch(err => res.status(400).json('unable to get user'))
})

app.post('/signin', signin.handleSignin(db, bcrypt));

app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db)});

app.put('/image', (req, res) => { image.handleImage(req, res, db)});

app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) });

// bcrypt.hash("bacon", null, null, function(err, hash) {
//   // Store hash in your password DB.
// });


app.listen(3000, () => {
  console.log('app is running on port 3000');
})


// / --> res = this is working
// /signin --> POST = success / fail
// /register --> POST = user
// /profile/:userId --> GET = user
// /image --> PUT  --> user