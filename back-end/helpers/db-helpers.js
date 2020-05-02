// helper functions to query db and return standardized API responses
const { pool } = require('../config');

async function makeDbQuery(queryString) {
  try {
    return await pool.query(queryString)
  } catch (e) {
    throw e
  }
};

async function getRowFromDb(queryString) {
  let results;
  try {
    results = await pool.query(queryString)
  } catch (e) {
    throw e
  }
  return results.rows[0];
};


module.exports = {
   makeDbQuery,
   getRowFromDb,
}