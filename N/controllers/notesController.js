
// notesController.js

(function (notesController) {
    
    var data = require("../data");
    var auth = require("../auth"); //-->  needed to  protect individual API
    

    notesController.init = function (app) {

        // 1--- creating GET ACTION
        app.get("/api/notes/:categoryName", 
            auth.ensureAuthenticated, //--> we re giving it a function so that it can execute it first 
            function (req, res) {
            var categoryName = req.params.categoryName;

            data.getNotes(categoryName, function (err, notes) {
                if (err) {
                    res.send(400, err);
                } else {
                res.set("Content-Type", "application/json");
                //res.send({ foo: "bar" });
                //res.send(notes);//---> entire object 
                    res.send(notes.notes); //---> just the array of notes 
                }
            });
        });

        //2---POST
        app.post("/api/notes/:categoryName", 
            auth.ensureAuthenticated, //--> we re giving it a function so that it can execute it first 
            function (req, res) {

            var categoryName = req.params.categoryName;
            var noteToInsert = {
                note: req.body.note,
                color: req.body.color,
                author: "Franck Kabanga"
            };
            data.addNote(categoryName,noteToInsert, function (err) {
                if (err) {
                    res.send(400, "Failed to add note to data Store :" );
                } else {
                    res.set("Content-Type", "application/json");
                    res.send(201, noteToInsert); //---> 201 means created. and send back the data it passed to us [noteToInsert]
                }
            });
        });

    };

})(module.exports);