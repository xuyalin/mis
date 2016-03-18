var express = require('express');
var router = express.Router();
var storage = require("../utils/storage");
var fs = require('fs');
var jsonfile = require('jsonfile');
var productArr,userArr,productJson={},userJson={};
var initJson = function(){
    productArr = JSON.parse(fs.readFileSync('./public/json/product.json','utf-8'));
    userArr = JSON.parse(fs.readFileSync('./public/json/user.json','utf-8'));
    productJson = {},userJson = {};
    for (var i = 0; i < productArr.length; i++) {
        productJson[productArr[i]._id] = productArr[i];
    }
    for (var j = 0; j < userArr.length; j++) {
        userJson[userArr[j]._id] = userArr[j];
    }
};
initJson();
/* GET home page. */
router.get('/', function(req, res, next) {
    initJson();
    storage.read('sub_order', {}, function(msg){
        var uId,pId;
        for (var k = 0; k < msg.length; k++) {
            uId = msg[k].user_id;
            pId = msg[k].product_id;
            msg[k].name = userJson[uId].name;
            msg[k].tel = userJson[uId].tel;
            msg[k].address = userJson[uId].address;
            msg[k].product = productJson[pId].name;
        }
        res.render('order', { activeTab: 'order', orderData: msg, productArr: productArr,userArr:userArr });
    });
});
router.post('/add', function(req, res, next) {
    var orderData = req.body;
    storage.write('sub_order', orderData, function(v){
        res.redirect('/order');
        storage.read('sub_order',{}, function(data){
            jsonfile.writeFile("./public/json/sub_order.json", data, function(err){
                initJson();
            });
        });
    });
});

module.exports = router;
