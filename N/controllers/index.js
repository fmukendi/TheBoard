(function (controllers) {
    
    var homeController = require("./homeController");
    
    var notesContoller = require("./notesController");

    controllers.init = function (app) {
        homeController.init(app);
        notesContoller.init(app);

    };


})(module.exports);