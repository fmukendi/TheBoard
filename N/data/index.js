(function (data) {
    var seedData = require("./seedData");
    var database = require("./database");
    
    //1---geting data from local files ---> it works fine 
    //data.getNoteCategories = function (next) {
    //    next(null, seedData.initialNotes);
    //};

    //2---geting data from MongoDb Database 
    data.getNoteCategories = function (next) {
        database.getDb(function (err, db) {
            if (err) {
                console.log("Failed to get data from database: " + err);
                next(err, null);//---> we use it to tell call about the error 
            } else {
                db.notes.find().sort({ name: 1}).toArray(function (err, results) {// find can filters  
                    //1-->  db.notes.find().toArray
                    //2-->  db.notes.find({ name: "Fun" }).toArray
                    //3-->  db.notes.find({ notes: { $size: 3 } }).toArray
                    //4-->  db.notes.find({ notes: { $not: { $size: 3 } } }).toArray
                    //5--> db.notes.find().sort({ name: -1}).toArray
                    //6--> db.notes.find().sort({ name: 1}).toArray
                    if (err) {
                        next(err, null);
                    } else {
                        next(null, results);
                    }
                });
            } 
        });
    };
    
    data.getNotes = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                //check to see if category already exists 
                db.notes.findOne({ name: categoryName }, next);
            }//<--
        });
    };
    
    data.getUser = function (username, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);//--> return back to the caller /
            } else {
                //check to see if category already exists 
                db.users.findOne({ username: username }, next);
            }//<--
        });
    };

    
    //3--create
    //--3a---addNote
    data.addNote = function (categoryName, noteToInsert, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err);
            } else {
                db.notes.update(
                    { name: categoryName }, 
                    { $push: { notes: noteToInsert } },
                    next
                );
            }
        });
    };
    
    
    
    //---3b ---create a new category
    
    //1ST-PUT 
    data.createNewCategory = function (categoryName, next) {
        database.getDb(function (err, db) {
            if (err) {
                next(err, null);
            } else {
                //check to see if category already exists 
                db.notes.find({ name: categoryName }).count(function (err, count) {
                    if (err) {
                        next(err, null);
                    } else {

                        if (count != 0) {
                            next("Category already exists !!!");
                        } else {                
                            var cat = {
                                name: categoryName,
                                notes: []
                            };
                
                            //insert the category or element 
                            db.notes.insert(cat, function (err) {
                                if (err) {
                                    next(err);
                                } else {
                                    next(null);
                                }
                            });
                        }
                    }
               });
            }
        });
    };
    
    //2ND PUT
    data.addUser = function (user, next) {
        database.getDb(function (err, db) {
            
            //debugger;
            if (err) {
                console.log("Failed to seed database: " + err);
            } else {
                db.users.insert(user, next);
            }
        })
    };
    

    //SeedDatabase
    function seedDatabase(){
        database.getDb(function (err, db) {
            
            //debugger;
            if (err) {
                console.log("Failed to seed database: " + err);
            } else {
                // test to see if data exists
                //if (db.notes.count == 0) { //} --> not a good way because it will block---it must be asynchronous
                db.notes.count(function (err, count) {
                    if (err) {
                        console.log("Failed to retrieve database count");
                    } else {
                        if (count == 0) {
                            console.log("Seeding the Database...");
                            seedData.initialNotes.forEach(function (item) {
                                db.notes.insert(item, function (err) {
                                    if (err) console.log("Failed to insert node into database");
                                });
                            });
                        } else {
                            console.log("Database already seeded...");
                        }
                    }
                });
            }
        });
    };

    seedDatabase();


})(module.exports);