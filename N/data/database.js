
//database.js

(function (database) {
    var mongodb = require("mongodb");
    var mongoUrl = "mongodb:// fmukendi:peace123@ds034878.mongolab.com:34878/MongoLab-5";
    var theDb = null;

    database.getDb = function (next){
        if (!theDb) {
            //connect to the database
            mongodb.MongoClient.connect(mongoUrl, function (err, db)
                {
                //debugger;
                if (err) {
                    next(err, null);
                } else {
                    theDb = {
                        db: db,
                        notes: db.collection("notes"),//---> mongodb works with collections ? collections are table vs sql
                        users: db.collection("users")
                    };
                    next(null, theDb);
                }
                });
        } else {
            next(null, theDb);
        }
    }

})(module.exports);