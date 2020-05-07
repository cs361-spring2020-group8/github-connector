var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (process.env.NODE_ENV === 'dockerlocal') {
    return res.redirect(`http://localhost:${process.env.REACT_PORT}`);
  }

  res.sendFile(path.join(__dirname, '../../dist/index.html'))
});

module.exports = router;
