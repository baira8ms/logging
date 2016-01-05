var logging = require("events").EventEmitter;
var fs = require("fs");
var path = require('path');

var loggerEvent = new logging();
var activeLogEvent ='INFO';
var logProperties;

// Reading the log properties
try{
	logProperties = JSON.parse(fs.readFileSync(__dirname+"/../properties/logProperties.json",'utf8'));
}catch(err){
	logProperties = null;
}

var logObject = {
	info:function(message){
		loggerEvent.emit("INFO", message);
	},
	error:function(message){
		loggerEvent.emit("ERROR", message);
	},
	warn:function(message){
		loggerEvent.emit("WARN", message);
	}
};

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

var logMessage = function(actualMessage){
	var msg =prepareLogMessage(actualMessage, __function, __line);

		//Printing the log message on console
		console.log(msg);

		// Writing to log file
		if(logProperties != null && logProperties.savedToFile){
			streamingIntoFile(logProperties.fileLocation,msg +"\n");  	
		}
	}

// Creating the log message by using current timestamp, methodname, line number and filename and given log message
var prepareLogMessage = function(message, __function, __line) {
	var levels = ['ERROR', 'WARN', 'INFO'];
	var filename;
	var defaultLogLevel = logProperties != null ? levels.indexOf(logProperties.level) : 'ERROR';

	if (levels.indexOf(activeLogEvent) >=  levels.indexOf(defaultLogLevel)) {
		var dateString = new Date().toString();

		if(process.mainModule != null && process.mainModule !== undefined){
			filename = process.mainModule.filename;
		}else{
			filename = " ";
		}

		var getMessage = function(){
			var	constructMsg =dateString.substring(0, dateString.indexOf(dateString.split(' ')[5]));

			if(filename != " "){
				constructMsg = constructMsg +':'+ filename.substring(filename.lastIndexOf('\\')+1,filename.length);
			}

			if(__function != null && __function !== undefined && __function != "" && __function != " "){
				constructMsg = constructMsg+':'+__function+"():";
			}

			if(__line != null && __line !== undefined && __line != "" && __line != " "){
				constructMsg = constructMsg+':'+__line+":";	
			}

			constructMsg = constructMsg+':'+ activeLogEvent;

			if(message != null && message !== undefined && message != "" && message != " "){
				constructMsg = constructMsg+':'+message;	
			}

			return constructMsg;
		}

		return getMessage();
	}
}

// Writing into log file
var streamingIntoFile = function(userDefinedPath, content)	{

	if(userDefinedPath !== "" && userDefinedPath !== " "){
		global.filePath = path.join(__dirname,userDefinedPath,logProperties.logFileName);
	}else{
		global.filePath = path.join(__dirname,"\\"+logProperties.logFileName);
	}

	fs.exists(global.filePath, function (exists) {
		if(exists){
			if( (getSize(global.filePath) + content.length) < logProperties.maxFileSizeInBytes){
				fs.appendFile(global.filePath ,content,function(err){
					if(err){
					}
				});
			}else{
				fs.rename(global.filePath, global.filePath.substring(0,global.filePath.lastIndexOf('\\'))+'\\application_'+new Date().getTime().toString()+'.txt', function(err){
					createLog(content);
					if(err){
					}
				});
			}
		}else{
			createLog(content);
		}
	});
}

var createLog = function(content){
	fs.writeFile(global.filePath ,content,function(err){
		if(err){ }
	});
}

var getSize = function(fileNameOnLocation){
	var fileSizeInBytes = 0;
	try{
		var stats = fs.statSync(fileNameOnLocation);
		fileSizeInBytes = stats["size"];
	}catch(ex){}
	return fileSizeInBytes;
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
		return __stack[5].getLineNumber(); 
	}
});

Object.defineProperty(global, '__function', {
	get: function() {
		return __stack[5].getFunctionName();
	}
});


module.exports = logObject;