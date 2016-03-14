/////////////////////////////////////////////////
//----GROUP I-----> Libraries  and Config    ////
/////////////////////////////////////////////////
//---1.1---require (require comes from Node.js
var http = require("http");  //---> we need http to create a server. http is a standard Node.js Library.
//---2--1-- Calling express and underscore
/*
Web Applications
Express.js is a Node.js web application framework, designed for building single-page, multi-page, and hybrid web applications
 */
var express = require("express"); //---> express will be able to be executed like a function
var bodyParser = require('body-parser');//---> Franck 


var app = express(); //--> we can express our app this way
//Express.js is a Node.js web application framework, designed for building single-page, multi-page, and hybrid web applications


//4--1
var controllers = require("./controllers");//---> this will give us access to all the conntrollers



var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require("connect-flash");


//--- 3.1---Set up View Engine
app.set("view engine", "vash");

// Opt into Services 
//app.use(express.urlencoded());---> from video do not work 
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());//--> so that http API can understand json objects 
//--just to error notifications!!!!--req.flash("newCatName", err);//--> store this temporary error --> store this in session
app.use(cookieParser());
app.use(session({ secret: "PluralsightTheBoard" }));//---> secret is what the session state is encrypted with.//--> we also need to track cookie for indivual user using above 
app.use(flash());//--> but flash use session state while node do not .... so we ll add something above 





//set the public static resource folder
app.use(express.static(__dirname + "/public"));// so that layout.vash can do link href="/css/site.css"


// use authentication ---> before going to the controller 
var auth = require("./auth");
auth.init(app);


/////////////////////////////////////////////////
//----GROUP II----->   CREATE SERVER         ////
/////////////////////////////////////////////////

//4---2  Map the routes
controllers.init(app);

//----1.2----- create a server 
//var server = http.createServer(function (req, res) {
//    console.log(req.url);
//    res.write("<html><body><h1>" + req.url +"</h1></body></html>");
//    res.end();
//});

//---2-1 use app to create a server 
//router---> what will the server points to 
//app.get("/", function (req, res) {
//    res.send("<html><body><h1>" + "Express" + "</h1></body></html>");
//});
app.get("/api/users", function (req, res) {
    res.set("Content-Type", "application/json");
    res.send({ name: "Franck", isValid: true, group: "Admin" });
});

//----> QUERY  1 
app.get("/api/sql", function (req, res) {
    
    var sql = require("mssql");
    
    var config = {
        user: 'nukeapps',
        password: 'Sh@mbuyi123',
        server: '184.168.194.75', // You can use 'localhost\\instance' to connect to named instance 
        database: 'nukeapps',
        
        options: {
            encrypt: false // Use this if you're on Windows Azure 
        }
    }
    
    var connection = new sql.Connection(config, function (err) {
        // ... error checks 
        // Query 
        var request = new sql.Request(connection); // or: var request = connection.request(); 
        request.query('SELECT TOP 10 *  FROM [nukeapps].[Person].[Address]', function (err, recordset) {
            //Error Handling
            res.send(recordset);
        });

       
    });
    
});
//----> QUERY  2
app.get("/api/sql/knockout", function (req, res) {
    var sql = require("mssql");
    
    var config = {
        user: 'nukeapps',
        password: 'Sh@mbuyi123',
        server: '184.168.194.75', // You can use 'localhost\\instance' to connect to named instance 
        database: 'nukeapps',
        
        options: {
            encrypt: false // Use this if you're on Windows Azure 
        }
    }
    
    var connection = new sql.Connection(config, function (err) {
        // ... error checks 
        // Query 
        var request = new sql.Request(connection); // or: var request = connection.request(); 
        request.query('SELECT [Id],[Name]FROM [nukeapps].[nukeapps].[KnockOut]', function (err, recordset) {
            //Error Handling
            // Website you wish to allow to connect
            res.setHeader('Access-Control-Allow-Origin', 'http://run.plnkr.co');

            res.send(recordset);
        });
    });
});

//----> STORE PROCEDURE 
app.get("/api/sqlStoreProcedure", function (req, res) {
    
    var sql = require("mssql");
    
    var config = {
        user: 'nukeapps',
        password: 'Sh@mbuyi123',
        server: '184.168.194.75', // You can use 'localhost\\instance' to connect to named instance 
        database: 'nukeapps',
        
        options: {
            encrypt: false // Use this if you're on Windows Azure 
        }
    }
    
    var connection = new sql.Connection(config, function (err) {
        // ... error checks 
        // Stored Procedure
        var request = new sql.Request(connection);
        request.query("EXEC [dbo].[sp_vendor_list_ACTION] @Action='SEARCH', @phone='432-555-0100'", function (err, recordsets) {
            //Error Handling
            res.send(recordsets);
        });

       
    });
    
});


//--3.2
//app.get("/", function (req, res) {
//    res.render("index", { title: "Express + Vash" });
//});
// create the actual server 
var server = http.createServer(app);

/////////////////////////////////////////////////
//----GROUP III-----> RUN THE SERVER         ////
/////////////////////////////////////////////////
//---1.3--- Listen to the server 
//var port = process.env.port || 1337;//---> for online purpose only
server.listen(3000); //---> for local purpose only 
//server.listen(port);


//---5--Socket io
var updater = require("./updater");
updater.init(server);

