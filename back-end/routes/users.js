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

// UPDATED to be async for bcrypt library.
router.post('/login', async function (req, res, next) {

  // ie with a hashed password stored and checking against that.
  try {
    const query = "SELECT password FROM users WHERE username = ?";
    const inputUsername = [req.body.username];

    // initialize as invalid password value.
    let passwordCheck = "bad";

    // Not sure if this is the best way to do this query, maybe
    // it should be a separate function.
    pool.query(query, inputUsername, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      // value changes if query worked.
      passwordCheck = results[0];
    });

    if(await bcrypt.compare(req.body.password, passwordCheck)){
      res.send('Successful login.');
    } else {
      res.send('Login attempt failed.');
    }
  } catch {
    res.status(500).send();
  }


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
