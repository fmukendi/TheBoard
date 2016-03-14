

(function (homeController) {
    var data = require("../data");
    var auth = require("../auth"); //-->  needed to  protect individual page

    homeController.init = function (app) {
        
        //1a--- displaying data
        app.get("/", function (req, res) {
            //res.send("<html><body><h1>" + "Express" + "</h1></body></html>");---> bad ... need to view engine ... here Jade 
            data.getNoteCategories(function (err, results){
                //debugger;
                res.render("index", {
                    title: "The Board", 
                    error: err, 
                    categories: results // added newCatError Here
                    ,newCatError: req.flash("newCatName")//--> return session variable and remove from session
                    ,user: req.user
                });
             });
        });
        
        
        
        //1b--- displaying data
        app.get("/notes/:categoryName", 
               auth.ensureAuthenticated, //--> we re giving it a function so that it can execute it first 
            function (req, res) {
            var categoryName = req.params.categoryName; 
                //debugger;
                res.render("notes", { //---> call the notes view ---> notes.vash
                    title: categoryName , user: req.user
                    //,error: err, 
                    //categories: results // added newCatError Here
                    //,newCatError: req.flash("newCatName")//--> return session variable and remove from session
                });
           
        });

        //2--- posting data
        app.post("/newCategory", function (req, res) {
            var categoryName = req.body.categoryName;// first undefined so we must configure express in server.js-->app.use(express.urlencoded());

            data.createNewCategory(categoryName, function (err) {
                if (err) {
                    //Handel error 
                    console.log(err);
                    req.flash("newCatName", err);//--> store this temporary error --> store this in session
                    res.redirect("/");
                } else {
                    res.redirect("/notes/" + categoryName);
                }
            });
        });

   };
})(module.exports);