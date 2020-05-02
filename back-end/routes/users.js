require('dotenv').config();

var express = require('express');
var router = express.Router();

var bodyParser = require('body-parser');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

const { createJWT, getUserIdFromToken } = require('../helpers/jwt-helpers')
const { makeDbQuery, getRowFromDb, getUserByEmail, getFullUserProfile } = require('../helpers/db-helpers')
const { rejectAsUnauthorized, returnGeneralError, returnErrorWithMessage } = require('../helpers/response-helpers')

const PASSWORD_MIN_LENGTH = 8;

// user routes
/* GET user by ID */
router.get('/:id', async function(req, res, next) {
  // verify user has permission to get this data
  const userID = await getUserIdFromToken(req, res);
  if (userID != req.params.id) {
    return rejectAsUnauthorized(res);
  }

  let responseBody = await getFullUserProfile(userID);
  if (!responseBody) {
    // no user data could be found
    return res.status(403).send('User not in database.');
  }
  return res.status(200).send([responseBody]);
});

// LOGIN for existing users
router.post('/login', [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isLength({ min: PASSWORD_MIN_LENGTH })
  ], async function (req, res, next) {

  try {
    const { email, password } = req.body;

    const dbResults = await getUserByEmail(email);

    if(!dbResults){
      // If dbResults return undefined, user not present in DB.
      return res.status(403).send('User not in database.');
    }

    const passwordCheck = dbResults.password;
    const id = dbResults.id;

    // check if user-supplied password matches the hashed password from the db
    if (await bcrypt.compare(password, passwordCheck)) {
      // if it does, generate and return a jwt
      const token = createJWT(id);

      res.status(200).send({token, id});
    } else {
      res.status(403).send('Login attempt failed.');
    }
  } catch(err) {
    res.status(500).send(err);
  }
});

/* POST to create new users */
// TODO: need to validate that a user doesn't already exist
// UPDATED to be async (for generated proper salt)
router.post('/', [
    check('email').exists().isEmail().normalizeEmail(),
    check('password').exists().isLength({ min: PASSWORD_MIN_LENGTH })
  ], async function(req, res, next) {
    try {

      // if email or password are empty, send 400 error with reasons
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      // get email password from request body
      const { email, password } = req.body;

      // check if email is already in use
      let dbResults = await getUserByEmail(email);
      if(dbResults) {
        return res.status(400).send('Email address is already in use.');
      }

      // salt and hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      // create user in DB
      const createUserQuery = `INSERT INTO users(email, password, created_at) \
VALUES('${email}', '${hashedPassword}', CURRENT_TIMESTAMP) RETURNING *`
      dbResults = await getRowFromDb(createUserQuery);

      console.log(dbResults)

      let responseBody = await getFullUserProfile(dbResults.id);
      if (!responseBody) {
        // no user data could be found
        return res.status(403).send('User not in database.');
      }

      // generate and return a jwt to include with the db results
      responseBody['token'] = createJWT(dbResults.id);

      return res.status(200).send([responseBody]);

    } catch(err){
      return returnErrorWithMessage(res, err);
    }
});

/* PUT to update select user information */
// Allows user to modify select attributes of his or her profile
router.put('/:id', [
    check('email').optional().isEmail().normalizeEmail(),
    check('twitter').optional().trim().escape(),
    check('phone').optional().trim(),
  ], async function(req, res, next) {

    // validate user has permission to modify this endpoint
    const userID = await getUserIdFromToken(req, res);
    if (userID != req.params.id) {
      return rejectAsUnauthorized(res);
    }

    // if user can modify it, update the user's info in the database
    try {
      if(req.body.password) {
        // need to salt and hash password before storing it
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

      await makeDbQuery(queryString);

      let responseBody = await getFullUserProfile(userID);
      if (!responseBody) {
        // no user data could be found
        return res.status(403).send('User not in database.');
      }
      res.status(200).send([responseBody]);

    } catch(err){
      res.status(500).send(err);
    }
});

module.exports = router;
