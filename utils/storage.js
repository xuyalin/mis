var Mongo = require("mongoskin");
var mongo_conf = require("./config").mongo;
var ObjectId = Mongo.ObjectId;
var Storage = {
    db      : null,
    init    : function(){
        var env = mongo_conf.misdbOnline;

        var auth_str = "";
        if (env.username && env.passwd) {
          auth_str = env.username + ":" + env.passwd + "@";
        }
        this.db = new Mongo.db("mongodb://"+ auth_str + env.host + ":" + env.port + "/" + env.dbname);
    },
    readOne : function(collection_name, query, callback){
        if(!this.db){
            this.init();
        }

        var collection = this.db.collection(collection_name);
        collection.find(query, {limit:1, sort:{'_id': -1}}).toArray(function(err,docs){
            callback && callback(docs);
        });
    },
    read    : function(collection_name, query, callback){
        if(!this.db){
            this.init();
        }

        var collection = this.db.collection(collection_name);
        collection.find(query).toArray(function(err,docs){
            callback && callback(docs);
        });
    },
    write   : function(collection_name, data, callback){
        if(!this.db){
            this.init();
        }

        var collection = this.db.collection(collection_name);
        collection.insert(data, {w:1}, function(err, result){
            if(err)
                console.log("mongo input error: " + err);
            callback && callback(result);
        });
    },
    update   : function(collection_name, obj, data, callback){
        if(!this.db){
            this.init();
        }

        var collection = this.db.collection(collection_name);
        collection.update({_id:ObjectId(obj._id)}, {$set: data}, function(err, result){
            callback && callback(result);
        });
    }
};
//Storage.init();
// Storage.write('user', {"name":"许亚林","tel":"13333333333","address":"360大厦","orders":['333','333']}, function(v){console.log(v);});
// Storage.write('product', {"in_price":10,"sell_price":20,"name":"眼药水","images":['/data/url/1.jpg','/data/2.jpg'],"desc":"好用好用","weight":100,"freight":10,"store":0,"other_price":[10,20,30]}, function(v){console.log(v);});
// Storage.write('sub_order', {"user_id":"dddd","has_pay":0,"freight":10,"product_id":"dfasdf","order_status":0,"express_company":"圆通","express_num":'3423424222'}, function(v){console.log(v);});
// Storage.write('order', {"order_time":+new Date(),"sub_orders":['asdfasdfa','asdfasdf'],"freight":100,"order_status":0,"behalf":200}, function(v){console.log(v);});
//Storage.read('user', {}, function(v){console.log(v);});
//Storage.read('svgs', {unicode: 'e012'}, function(v){console.log(v);});
//Storage.readOne('svgs', {}, function(v){console.log(v);});
//Storage.update('sub_order',)

module.exports = Storage;
