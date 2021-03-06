// helper functions to query db and return standardized API responses
const { pool } = require('../config');

async function makeDbQuery(queryString) {
  try {
    return await pool.query(queryString)
  } catch (e) {
    throw e
  }
};

async function queryWithParameters(queryString, parameters) {
  try {
    const results = await pool.query(queryString, parameters);

    return results.rows[0];
  } catch (err) {
    throw err;
  }
}

async function queryWithParametersForMultipleRows(queryString, parameters) {
  try {
    const results = await pool.query(queryString, parameters);

    return results.rows;
  } catch (err) {
    throw err;
  }
}

module.exports = {
   makeDbQuery,
   queryWithParameters,
   queryWithParametersForMultipleRows,
}