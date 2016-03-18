var express = require('express');
var router = express.Router();
var storage = require("../utils/storage");
var fs = require('fs');
var jsonfile = require('jsonfile');
var userJson = {},orderJson = {},productJson={},sub_order,userArr,productArr;
var initJson = function(){
	sub_order = JSON.parse(fs.readFileSync('./public/json/sub_order.json','utf-8'));
	userArr = JSON.parse(fs.readFileSync('./public/json/user.json','utf-8'));
	productArr = JSON.parse(fs.readFileSync('./public/json/product.json','utf-8'));
	for (var i = 0; i < productArr.length; i++) {
	    productJson[productArr[i]._id] = productArr[i];
	}
	for (var j = 0; j < userArr.length; j++) {
	    userJson[userArr[j]._id] = userArr[j];
	}
	for (var k = 0; k < sub_order.length; k++) {
	    orderJson[sub_order[k]._id] = sub_order[k];
	}
};
initJson();
/* GET home page. */
router.get('/', function(req, res, next) {
	initJson();
    storage.read('order', {}, function(msg){
        for (var l = 0; l < msg.length; l++) {
        	var subOrder = msg[l].sub_orders;
        	for(var m = 0; m<subOrder.length;m++){
        		
        		msg[l].sub_orders[m] = "("+userJson[orderJson[subOrder[m]].user_id].name+")"+msg[l].sub_orders[m];
        	}
        }
        res.render('bigorder', { activeTab: 'bigorder', orderData: msg,sub_order:sub_order,userJson:userJson,orderJson:orderJson });
    });
});
router.post('/add', function(req, res, next) {
    var orderData = req.body;
    if(typeof orderData.sub_orders == 'string'){
    	orderData.sub_orders = [orderData.sub_orders];
    };
    var totalPrice = 0;
    for (var i = 0; i < orderData.sub_orders.length; i++) {
    	var pId = orderJson[orderData.sub_orders[i]].product_id;
    	var count = orderJson[orderData.sub_orders[i]].count;
    	totalPrice += productJson[pId].in_price*count;
    	storage.update('sub_order',{"_id": orderData.sub_orders[i]},{"has_join":1},function(v){
    		storage.read('sub_order',{}, function(data){
	            jsonfile.writeFile("./public/json/sub_order.json", data, function(err){
	            	initJson();
	            });
	        });
    	});
    }
    orderData.behalf = totalPrice * 0.06;
    storage.write('order', orderData, function(v){
        res.redirect('/bigorder');
    });
});

module.exports = router;
