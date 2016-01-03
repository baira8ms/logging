var logging = require("events").EventEmitter;
var fs = require("fs");
var path = require('path');

var loggerEvent = new logging();
var activeLogEvent ='INFO';

// Reading the log properties
var logProperties = JSON.parse(fs.readFileSync(__dirname+"/../properties/logProperties.json",'utf8'));

// Addding event listeners for INFO, WARN, ERROR
loggerEvent.on("INFO", function(message){
 	//console.log(process.mainModule.filename);
 	activeLogEvent = 'INFO'
 	logMessage(message);
 });

loggerEvent.on("WARN", function(message){
	activeLogEvent = 'WARN'
	logMessage(message);
});

loggerEvent.on("ERROR", function(message){
	activeLogEvent = 'ERROR'
	logMessage(message + ":" + new Error().stack);
});

// Creating the log message by using current timestamp, methodname, line number and filename and given log message
var logMessage = function(message) {
	var levels = ['ERROR', 'WARN', 'INFO'];
	if (levels.indexOf(activeLogEvent) >= levels.indexOf(logProperties.level) ) {
		var dateString = new Date().toString();
		var filename = process.mainModule.filename;
		var logStatement = dateString.substring(0, dateString.indexOf(dateString.split(' ')[5]))+':'+
		filename.substring(filename.lastIndexOf('\\')+1,filename.length)+':'+__function+"():"+
		__line+':'+activeLogEvent+' : '+message;
		console.log(logStatement);
		if(logProperties.savedToFile === 'Yes'){
			streamingIntoFile(logProperties.fileLocation,logStatement +"\n");  	
		}
	}
}

// Getting stack details to find out the method invoker name and line number where it is invoked.
Object.defineProperty(global, '__stack', {
	get: function() {
		var orig = Error.prepareStackTrace;
		Error.prepareStackTrace = function(_, stack) {
			return stack;
		};
		var err = new Error;
		Error.captureStackTrace(err, arguments.callee);
		var stack = err.stack;
		Error.prepareStackTrace = orig;
		return stack;
	}
});

Object.defineProperty(global, '__line', {
	get: function() {
		return __stack[4].getLineNumber(); 
	}
});

Object.defineProperty(global, '__function', {
	get: function() {
		return __stack[4].getFunctionName();
	}
});

// Writing into log file
var streamingIntoFile = function(userDefinedPath, content)	{

	if(userDefinedPath !== "" && userDefinedPath !== " "){
		global.filePath = __dirname+userDefinedPath+logProperties.logFileName;
	}else{
		global.filePath = __dirname+"\\"+logProperties.logFileName;
	}

	fs.exists(global.filePath, function (exists) {
			if(exists){
				if(getSize(global.filePath) < logProperties.maxFileSizeInBytes){
					fs.appendFile(global.filePath ,content,function(err){
						if(err){
							//console.log(err);
						}
					});
				}else{
					fs.rename(global.filePath, global.filePath.substring(0,global.filePath.lastIndexOf('\\'))+'\\application_'+new Date().getTime().toString()+'.txt', function(err){
						if(err){
							//console.log(err);
						}
					});
				}
			}else{
				fs.writeFile(global.filePath ,content,function(err){
					if(err){
						//console.log(err);
					}
				});
			}
		});
}

var getSize = function(fileNameOnLocation){
  	var stats = fs.statSync(fileNameOnLocation);
 	var fileSizeInBytes = stats["size"];
 	return fileSizeInBytes;
}

module.exports = loggerEvent;