require('dotenv').config();

var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
const { pool } = require('../config');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const expjwt = require('express-jwt');

const PASSWORD_MIN_LENGTH = 8;

const makeDbQueryAndReturnResults = (queryString, res) => {
  pool.query(queryString, (error, results) => {
    if (error) {
      return res.status(500).send(error);
    }
    else if (!results || !results.rows || results.rows[0] === undefined) {
      return res.status(500).send('An error occurred');
    }
    return res.status(200).send(results.rows);
  })
};

// async function getRowFromDb(queryString) {
//   let results;
//   try {
//     results = await pool.query(queryString)
//   } catch (e) {
//     throw e
//   }
//   return results.rows[0];
// };

// TODO: Need to validate the user has access to this query
/* GET user by ID */
router.get('/:id', function(req, res, next) {
  const getUserQuery = 'SELECT * FROM users WHERE id=' + req.params.id;
  makeDbQueryAndReturnResults(getUserQuery, res);
});

// UPDATED to be async for bcrypt library.
router.post('/login', async function (req, res, next) {

  // ie with a hashed password stored and checking against that.
  try {
    const query = "SELECT password, id FROM users WHERE email = ?";

    const { email, password } = req.body;
    let userID;
    // initialize as invalid password value.
    let passwordCheck = "bad";

    // Not sure if this is the best way to do this query, maybe
    // it should be a separate function.
    pool.query(query, email, function(error, results, fields){
      if(error){
        res.write(JSON.stringify(error));
        res.end();
      }
      // value changes if query worked.
      passwordCheck = results[0];
      userID = results[1];
    });

    if(await bcrypt.compare(password, passwordCheck)){
      const token = jwt.sign({ userID }, process.env.ACCESS_TOKEN_SECRET);
      res.json({
        token: token
      });
    } else {
      res.status(403).send('Login attempt failed.');
    }
  } catch(err) {
    res.status(500).send(err);
  }
});

// TODO: route for when logged in, what do we want to call this?
// just using login/success as a placeholder for now,
// can change if we want
app.get('/login/success', ensureToken, function(req, res, next){
  jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, function(err, data){
    if(err){
      res.status(404).send('Bad token');
    } else {
      res.json({
        text: 'successful login',
        // TODO: send back relevant data, need to choose what that is
        data: data
      });
    }
  })
});

// Middleware for above get route
function ensureToken(req, res, next) {
  const bearerHeader = req.headers["authorization"];
  if(typeof bearerHeader !== 'undefined'){
    const bearer = bearerHeader.split(" ");
    const bearerToken = bearer[1];
    req.token = bearerToken;
    next();
  } else {
    res.status(403).send('Unauthorized.');
  }
}

/* POST to create new users */
// TODO: need to validate that a user doesn't already exist
// UPDATED to be async (for generated proper salt)
router.post('/', [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isLength({ min: PASSWORD_MIN_LENGTH })
  ], async function(req, res, next) {
    try {

      // if email/password are empty, send 400 error with reasons
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const createUserQuery = `INSERT INTO users(email, password, created_at) \
VALUES('${email}', '${hashedPassword}', CURRENT_TIMESTAMP) returning *`
      makeDbQueryAndReturnResults(createUserQuery, res);
    } catch(err){
      res.status(500).send(err);
    }
});

// Allows user to modify select attributes of his or her profile
// TODO: Need to validate user has access to modify his/her information
/* PATCH to update select user information */
router.put('/:id', [
    check('email').optional().isEmail().normalizeEmail(),
    check('twitter').optional().trim().escape(),
    check('github_username').optional().trim(),
    check('phone').optional().trim(),
  ], async function(req, res, next) {
    try {

      if(req.body.password) {
        const password = req.body.password;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword
      }

      let queryString = `UPDATE users set `
      for (let [key, value] of Object.entries(req.body)) {
        queryString += `${key} = '${value}' `
      }
      queryString += `where id = ${req.params.id} RETURNING *`

      makeDbQueryAndReturnResults(queryString, res);
    } catch(err){
      res.status(500).send(err);
    }
});

module.exports = router;
