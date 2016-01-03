# logging - Jeevi Project
Logs the project execution status based on the given log configurations levels [INFO, WARN, ERROR]
This is built using the event emitter module.

## Installation

```sh
$ npm i --save logging
```

## Example

```js
const logging = require("logging");

loggerEvent.emit("INFO","INFO message");
loggerEvent.emit("WARN","WARNING message");
loggerEvent.emit("ERROR","ERROR message");

## Documentation

logging has 3 events INFO WARN and ERROR. And loggIng levels as well.
if user opts out for ERROR level and it has the higher level spec in logging So ERROR level option makes the INFO and WARN message to get displayed as well.

Enabling the logging includes below steps
##### step 1: Gets the logging module
##### step 2: Add logProperties.json in new properties folder under project home folder

	***	Sample log properties to set in logProperties.json ***

	"level":"ERROR", --> debug level
	"savedToFile":"Yes", --> This will enables the creating log file in below given filepath.
	"fileLocation":"/../", --> Default location is main file path, 
								User can specify the path and  Please starts path with 															'/' for the file path and end with the same slash.
								Note: Configure the path any existing directory and no new folders will be created to place this log file.
	"logFileName":"application.log", --> User can specify the log file name if not default log name will be applied.
	"maxFileSizeInBytes":"10000" --> User can specify the log file size, once size exceeded file will be backed up 																				and new log file will be created

##### step 3: Enable the options in logProperties file according to log options
##### step 4: Add the logging emits where ever required in your project code.
##### step 5: Run your node then see the magic log statements on console as well as file if user opted for file to store.

## How to contribute
Have an idea? Found a bug? Send me the list of them and will trial the fix for those.

## Where is this library used?
If you are using this library in one of your projects, add it in this list.