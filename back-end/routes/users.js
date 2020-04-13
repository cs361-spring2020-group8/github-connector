var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const { pool } = require('../config')

const makeDbQueryAndReturnResults = (queryString, res) => {
  pool.query(queryString, (error, results) => {
    if (!results || !results.rows || results.rows[0] === undefined || error) {
      return res.status(500).send('An error occurred');
    }
    return res.status(200).send(results.rows);
  })
}

const makeDbQueryAndReturnStatus = (queryString, res) => {
  pool.query(queryString, (error, results) => {
    if (error) {
      return res.status(500).send('An error occurred');
    }
    return res.status(200);
  })
}

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

/* POST to create new users */
router.post('/', function(req, res, next) {
  const {
    username, password, github_username
  } = req.body;

  const createUserQuery = `INSERT INTO users(username, password, github_username, created_at) \
VALUES('${username}', '${password}', '${github_username}', CURRENT_TIMESTAMP) returning *`
  console.log(createUserQuery)
  makeDbQueryAndReturnResults(createUserQuery, res);
});

/* DELETE user by ID. */
router.delete('/:id', function(req, res, next) {
  const deleteUserQuery = 'DELETE FROM users WHERE id=' + req.params.id;
  makeDbQueryAndReturnStatus(deleteUserQuery, res);
});


module.exports = router;
