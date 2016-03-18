var express = require('express');
var router = express.Router();
var storage = require("../utils/storage");
/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { activeTab: 'product' });
});

module.exports = router;
