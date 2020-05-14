require('dotenv').config();

const express = require('express');
const router = express.Router();
const {check, body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

const { createJWT, getUserIdFromToken } = require('../helpers/jwt-helpers')
const { getUserByEmail, getFullUserProfile, getRecommendations, createUser, updateUser } = require('../helpers/user-helpers')
const { rejectAsUnauthorized, returnGeneralError, returnErrorWithMessage, returnNotFound } = require('../helpers/response-helpers')
const { validateSelfJWT } = require('../middlewares/jwt-validators');
const { checkValidation } = require('../middlewares/body-validators');
const GitHubAPI = require('../api/github-api');
const GitHubInfo = require('../helpers/github-info-helpers');

const PASSWORD_MIN_LENGTH = 8;

// user routes
/* GET user by ID */
router.get('/:id', validateSelfJWT, async function(req, res, next) {
  // verify user has permission to get this data
  const userID = await getUserIdFromToken(req, res);

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

/* GET users recommendations */
router.get('/:id/recommendations', validateSelfJWT, async function(req, res, next) {
  // veryify permission and retrieve ID.
  const userID = await getUserIdFromToken(req, res);

  // use helper to retrieve recommendation list.
  let responseBody = await getRecommendations(userID);

  if (!responseBody) {
    // no user data could be found
    return res.status(403).send('No recommendations for user.');
  }
  return res.status(200).send([responseBody]);
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
      dbResults = await createUser(email, hashedPassword);

      let responseBody = await getFullUserProfile(dbResults.id);
      if (!responseBody) {
        // no user data could be found
        return res.status(403).send('User not in database.');
      }

      // generate and return a jwt to include with the user representation
      responseBody['token'] = createJWT(dbResults.id);

      return res.status(200).send(responseBody);

    } catch(err){
      return returnErrorWithMessage(res, err);
    }
});

// Attach valid GitHub user profile to user account
router.put(
  '/:id/github_info',
  validateSelfJWT,
  [body('github_username').exists().trim().isLength({ min: 1 })], // Avoiding github_username=''
  checkValidation,
  async (req, res) => {
    const userId = req.params.id;
    const username = req.body['github_username'];

    try {
      const userProfile = await GitHubAPI.getUserProfile(username);

      if (!userProfile) {
        return returnNotFound(res, 'GitHub username does not exist.');
      }

      const repositories = await GitHubAPI.getUserRepositories(username);
      const preferredLanguage = GitHubInfo.findPreferredLanguage(repositories);

      const savedGitHubInfo = await GitHubInfo.save(
        userId,
        username,
        userProfile['avatar_url'],
        preferredLanguage
      );

      return res.status(200).json(savedGitHubInfo);
    } catch (err) {
      return res.status(500).json(err);
    }
  }
);

/* PUT to update select user information */
// Allows user to modify select attributes of his or her profile
router.put('/:id', validateSelfJWT, [
    check('email').optional().isEmail().normalizeEmail(),
    check('twitter').optional().trim().escape(),
    check('phone').optional().trim(),
  ], async function(req, res, next) {

    // validate user has permission to modify this endpoint
    const userID = await getUserIdFromToken(req, res);

    // update the user's info in the database
    try {
      if(req.body.password) {
        // need to salt and hash password before storing it
        const password = req.body.password;
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword
      }

      await updateUser(req.body, userID);

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
