require('dotenv').config();

const express = require('express');
const router = express.Router();
const {check, body, validationResult} = require('express-validator');
const bcrypt = require('bcrypt');

const { createJWT, getUserIdFromToken } = require('../helpers/jwt-helpers')
const { getUserByEmail, getFullUserProfile, getRecommendations, updateConnectionStatus, createUser, updateUser, getUserGitHubInfo, getFullConnectionProfile } = require('../helpers/user-helpers')
const { rejectAsUnauthorized, returnGeneralError, returnErrorWithMessage, returnNotFound } = require('../helpers/response-helpers')
const { validateSelfJWT } = require('../middlewares/jwt-validators');
const { checkValidation } = require('../middlewares/body-validators');
const GitHubAPI = require('../api/github-api');
const GitHubInfo = require('../helpers/github-info-helpers');
const logger = require('../helpers/logger');

const PASSWORD_MIN_LENGTH = 8;

// user routes
/* GET user by ID */
router.get('/:id', async function(req, res, next) {

  const requestedID = req.params.id;

  // verify user has permission to get this data
  const userID = await getUserIdFromToken(req, res);
  let responseBody;

  if (requestedID !== userID) {
    logger.info('Requested ID is different from User ID. Getting full user profile for possible connection');
    responseBody = await getFullConnectionProfile(requestedID, userID);
  } else {
    logger.info(`Getting full user profile for user ${requestedID}`);
    responseBody = await getFullUserProfile(requestedID);
  }

  if (!responseBody) {
    // no user data could be found
    logger.warn(`User with id ${requestedID} not found in database`);
    return res.status(404).send('Not found.');
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

    logger.info(`Found user with email ${email}`);

    if(!dbResults){
      // If dbResults return undefined, user not present in DB.
      logger.warn(`User with id ${userId} not found in database`);
      return res.status(404).send('Not found.');
    }

    const passwordCheck = dbResults.password;
    const id = dbResults.id;

    // check if user-supplied password matches the hashed password from the db
    if (await bcrypt.compare(password, passwordCheck)) {
      // if it does, generate and return a jwt
      const token = createJWT(id);

      logger.info(`Login succeeded. Sending token to user ${id}`);

      res.status(200).send({token, id});
    } else {
      logger.warn('Invalid password provided');
      res.status(403).send('Login attempt failed.');
    }
  } catch(err) {
    logger.error(`An unexpected error occurred: ${err}`)
    res.status(500).send(err);
  }
});

/* GET users recommendations */
router.get('/:id/recommendations', async function(req, res, next) {
  // veryify permission and retrieve ID.
  const userID = req.params.id;

  // use helper to retrieve recommendation list.

  let responseBody = await getRecommendations(userID, 5)

  if(responseBody) {
    return res.status(200).send(responseBody);
  }else{
    return res.status(403).send('No user language.');
  }
});

/* POST to create new users */
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

      // get email from request body
      const { email } = req.body;

      // check if email is already in use
      let dbResults = await getUserByEmail(email);
      if(dbResults) {
        logger.warn(`User with email ${email} already exists.`);
        return res.status(400).send('Email address is already in use.');
      }

      // salt and hash password
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password || '', salt);

      // create user in DB
      dbResults = await createUser(email, hashedPassword);

      const { password, created_at, ...user} = dbResults;
      const userGitHubData = await getUserGitHubInfo(user.id);
      user.github_info = userGitHubData ? userGitHubData : null;

      // generate and return a jwt to include with the user representation
      user['token'] = createJWT(user.id);

      return res.status(200).send(user);

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
      logger.info(`Getting GitHub profile for user ${username}`);
      const userProfile = await GitHubAPI.getUserProfile(username);

      if (!userProfile) {
        logger.warn(`Github user ${username} does not exist`);
        return returnNotFound(res, 'GitHub username does not exist.');
      }

      const repositories = await GitHubAPI.getUserRepositories(username);
      const preferredLanguage = GitHubInfo.findPreferredLanguage(repositories);
      logger.info('Got user\'s preferred language');

      const savedGitHubInfo = await GitHubInfo.save(
        userId,
        username,
        userProfile['avatar_url'],
        preferredLanguage
      );

      return res.status(200).json(savedGitHubInfo);
    } catch (err) {
      logger.error(`An error occurred: ${err}`);
      return res.status(500).json(err);
    }
  }
);

// Accept/reject recommendations
router.put(
  '/:id/recommendations',
  validateSelfJWT,
  [body('id').exists(), body('accepted').exists()],
  checkValidation,
  async (req, res) => {
    const selfID = req.params.id;
    const matchID = Number.parseInt(req.body.id, 10);
    const accepted = req.body.accepted

    try {
      logger.info(`Updating the connection status for user ${selfID} and ${matchID}`);
      const connectionStatus = await updateConnectionStatus(selfID, matchID, accepted);
      return res.status(200).send();
    } catch (err) {
      logger.error(`An error occurred: ${err}`);
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

    logger.info(`Updating user details for user ${userID}`);
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
        logger.warn(`Unable to find user with id ${userID}`);
        return res.status(404).send('Not found.');
      }
      res.status(200).send([responseBody]);

    } catch(err){
      res.status(500).send(err);
    }
});

module.exports = router;
