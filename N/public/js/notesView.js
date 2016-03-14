/////// notesView.js 
(function (angular) {
    var theModule = angular.module("notesView", ["ui.bootstrap"]);
    //debugger;
    theModule.controller("notesViewController",
        ["$scope","$window","$http",
         function ($scope, $window, $http) {
            $scope.notes = [];
            
            $scope.newNote = createBlankNote();
            // Get category name 
            var urlParts = $window.location.pathname.split("/");
            var categoryName = urlParts[urlParts.length - 1];
            var notesUrl = "/api/notes/" + categoryName;
            $http.get(notesUrl)
                 .then(function (result) {
                //success
                //debugger;
                $scope.notes = result.data;
                 }, function (err) { 
                       //Error
                       //TODO
                alert(err);
            });
            
            
            //Socket
            var socket = io.connect();
            //socket.on("showThis", function (msg) {
            //    alert(msg);
            //});
            
            socket.emit("join category", categoryName); // we re part of this category

            socket.on("broadcast note", function (note) {
                $scope.notes.push(note);
                $scope.$apply(); //--> to force the data binding to update
            });

            // FUNCTION 
            //--1--SAVE
            $scope.save = function () {
                $http.post(notesUrl, $scope.newNote)
                     .then(function (result) {
                        //success
                    $scope.notes.push(result.data);
                    $scope.newNote = createBlankNote();
                    //socket
                    socket.emit("newNote", { category: categoryName, note:result.data })
                     }, function (err) {
                        //failure
                        //TO DO
                         alert(err);
                     });
            };
        }
    ]);

    function createBlankNote(){
      return {
                note: "",
                color: "yellow"
            };
    }

})(window.angular);

