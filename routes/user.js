var express = require('express');
var router = express.Router();
var storage = require("../utils/storage");
var jsonfile = require('jsonfile');

/* GET home page. */
router.get('/', function(req, res, next) {
    storage.read('user', {}, function(msg){
        res.render('user', { activeTab: 'user', userData: msg });
    });
});
router.post('/add', function(req, res, next) {
    /*
{
  "name": "许亚林",
  "tel": "13333333333",
  "address": "360大厦",
  "orders": [

  ]
}
     */
    var userData = req.body;
    userData.orders = [];
    storage.write('user', userData, function(v){
        res.redirect('/user');
        storage.read('user',{}, function(data){
            jsonfile.writeFile("./public/json/user.json", data, function(err){
            
            });
        });
    });
});

module.exports = router;
