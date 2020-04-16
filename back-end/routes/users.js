var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { pool } = require('../config');
const validator = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expjwt = require('express-jwt');

const makeDbQueryAndReturnResults = (queryString, res) => {
  pool.query(queryString, (error, results) => {
    if (!results || !results.rows || results.rows[0] === undefined || error) {
      return res.status(500).send('An error occurred');
    }
    return res.status(200).send(results.rows);
  })
};

const makeDbQueryAndReturnStatus = (queryString, res) => {
  pool.query(queryString, (error, results) => {
    if (error) {
      return res.status(500).send('An error occurred');
    }
    return res.status(200);
  })
};

/* GET all users */
router.get('/', function(req, res, next) {
  const getAllUsersQuery = 'SELECT * FROM users';
  makeDbQueryAndReturnResults(getAllUsersQuery, res);
});

/* GET user by ID */
router.get('/:id', function(req, res, next) {
  const getUserQuery = 'SELECT * FROM users WHERE id=' + req.params.id;
  makeDbQueryAndReturnResults(getUserQuery, res);
});

/* POST for logging in */
// TODO: fix this with an .env variable?
// jwt middleware, just fake for now until I figure out proper way:
// read that it normally should be a .env variable.
const jwtMW = expjwt({
  secret: 'a fake key for demo purposes'
});

router.post('/login', function (req, res, next) {
  const {
    username, password
  } = req.body;
  // TODO: whats the best way to query DB for existing user?
  // Just pseudo code for now...
  // TODO: remember to hash / unhash password.
  // fake DB entry just for demo purposes:
  const user = {
    id: 1,
    username: fakeUser,
    password: fakePassword,
  };

  if(username == user.username && password == user.password){
    let token = jwt.sign({
      id: user.id,
      username: user.username
    }, 'a fake key for demo purposes',
        {
          expiresIn: 123456
        });
    res.json({
      success: true,
      err: null,
      token
    });
  }else{
    res.status(401).json({
      success: false,
      token: null,
      err: 'Username or password incorrect.'
    });
  }
});

/* mockup using the literal jwtMW above */
// TODO: modify this to be a real route w/ real middleware.
router.get('/', jwtMW, function (req, res, next) {
  res.send('Authentication successful.');
});

/* POST to create new users */
// TODO: use express-validator to check for valid queries.
// UPDATED to be async (for generated proper salt)
router.post('/', async function(req, res, next) {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const username = req.body.username;
    const github_username = req.body.github_username;

    const createUserQuery = `INSERT INTO users(username, password, github_username, created_at) \
  VALUES('${username}', '${hashedPassword}', '${github_username}', CURRENT_TIMESTAMP) returning *`
    console.log(createUserQuery)
    makeDbQueryAndReturnResults(createUserQuery, res);
  } catch{
    res.status(500).send();
  }
});

/* DELETE user by ID. */
router.delete('/:id', function(req, res, next) {
  const deleteUserQuery = 'DELETE FROM users WHERE id=' + req.params.id;
  makeDbQueryAndReturnStatus(deleteUserQuery, res);
});


module.exports = router;
