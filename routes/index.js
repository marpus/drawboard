var express = require('express');
var router = express.Router();
// import test from '../test/test.js';
import parser from '../comm/string-parser.js';


/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(test.test);
  // test.test([4, 5, 6]);
  // console.log(test);
  // test([4, 5, 6]);
  parser();
  //res.render('index', { title: 'Express' });
});

module.exports = router;
