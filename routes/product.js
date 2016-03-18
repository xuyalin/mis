var express = require('express');
var router = express.Router();
var fs = require('fs');
var storage = require("../utils/storage");
var multipart = require('connect-multiparty');
var jsonfile = require('jsonfile');

var qiniu = require('qiniu');
qiniu.conf.ACCESS_KEY = 'NnQ-dh4_Vc5azn-dayT3-Eo3yrFaRseC1CDnMLvF';
qiniu.conf.SECRET_KEY = 'ysDjIIvmNOLAArQiRQQARhQX_hAaL8vAroXR6kGS';
var bucket = 'mis-xuyalin';
var qiniuHost = 'http://7xrrn1.com1.z0.glb.clouddn.com/';
var productArr,productJson={};
var initJson = function(){
    productArr = JSON.parse(fs.readFileSync('./public/json/product.json','utf-8'));
    for (var i = 0; i < productArr.length; i++) {
        productJson[productArr[i]._id] = productArr[i];
    }
};
initJson();

var uploadImage = function(bucket,key, localFile){
    var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
    var token = putPolicy.token();

    var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log(ret);       
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
};
/* GET home page. */
router.get('/', function(req, res, next) {
    storage.read('product', {}, function(msg){
        res.render('product', { activeTab: 'product', productData: msg });
    });
});
var multipartMiddleware = multipart();
router.post('/upload', multipartMiddleware, function(req,res, resp) {
    var productData = req.body;
    // storage.write('product', productData, function(v){
    //     res.redirect('/product');
    // });
    var files = req.files.images;
    var images = [];
    var writeTime = 0;
    if(files.length){
        for (var i = 0; i < files.length; i++) {
            var uploadedPath = files[i].path;
            //var dstPath = './public/files/' + files[i].originalFilename;
                //重命名为真实文件名
            uploadImage(bucket,files[i].originalFilename,uploadedPath);
            images.push(qiniuHost + files[i].originalFilename);

            //fs.rename(uploadedPath, dstPath, function(err) {
                writeTime++;
                if(images.length == writeTime){
                    productData.images = images;
                    storage.write('product', productData, function(v){
                        res.redirect('/product');
                    });
                }
                //console.log(err);
            //});
        }
    } else {
        var uploadedPath = files.path;
        //var dstPath = './public/files/' + files.originalFilename;
        uploadImage(bucket,files.originalFilename,uploadedPath);
            //重命名为真实文件名
        //fs.rename(uploadedPath, dstPath, function(err) {
            images.push(qiniuHost + files.originalFilename);
            productData.images = images;
            storage.write('product', productData, function(v){
                res.redirect('/product');
                storage.read('product',{}, function(data){
                    jsonfile.writeFile("./public/json/product.json", data, function(err){
                        initJson();
                    });
                });
            });
            
            //console.log(err);
        //});
    }
});

router.get('/detail', function(req, res, next) {
    var pId = req.param('id');

    res.render('productdetail', { activeTab: 'product', productData: productJson[pId],id:pId });
});

router.post('/update', multipartMiddleware, function(req,res, resp) {
    var productData = req.body;
    var id = productData.id;
    delete productData.id;

    // storage.write('product', productData, function(v){
    //     res.redirect('/product');
    // });
    var files = req.files.images;
    var images = [];
    var writeTime = 0;
    if(files.length || files.originalFilename){
        if(files.length){
            for (var i = 0; i < files.length; i++) {
                var uploadedPath = files[i].path;
                //var dstPath = './public/files/' + files[i].originalFilename;
                    //重命名为真实文件名
                uploadImage(bucket,files[i].originalFilename,uploadedPath);
                images.push(qiniuHost + files[i].originalFilename);

                //fs.rename(uploadedPath, dstPath, function(err) {
                    writeTime++;
                    if(files.length == writeTime){
                        productData.images = images;
                        storage.update('product',{"_id": id}, productData, function(v){
                            storage.read('product',{}, function(data){
                                jsonfile.writeFile("./public/json/product.json", data, function(err){
                                    initJson();
                                    res.redirect('/product');
                                });
                            });
                        });
                    }
                    //console.log(err);
                //});
            }
        } else {
            var uploadedPath = files.path;
            //var dstPath = './public/files/' + files.originalFilename;
            uploadImage(bucket,files.originalFilename,uploadedPath);
                //重命名为真实文件名
            //fs.rename(uploadedPath, dstPath, function(err) {
                images.push(qiniuHost + files.originalFilename);
                productData.images = images;
                storage.update('product',{"_id": id}, productData, function(v){
                    res.redirect('/product');
                    storage.read('product',{}, function(data){
                        jsonfile.writeFile("./public/json/product.json", data, function(err){
                            initJson();
                        });
                    });
                });
                
                //console.log(err);
            //});
        }
    } else {
        storage.update('product',{"_id": id}, productData, function(v){
            res.redirect('/product');
            storage.read('product',{}, function(data){
                jsonfile.writeFile("./public/json/product.json", data, function(err){
                    initJson();
                });
            });
        });
    }
});



module.exports = router;
