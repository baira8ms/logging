var loggerEvent = require("../lib/app.js");

var tests = function(){
loggerEvent.emit("INFO","INFO message");
loggerEvent.emit("WARN","WARNING message");
loggerEvent.emit("INFO","INFO message");
loggerEvent.emit("WARN","WARNING message");
loggerEvent.emit("ERROR","ERROR message");
}

tests();


