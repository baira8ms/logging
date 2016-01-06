# log-message
Logs the project execution status based on the given log configurations levels [INFO, WARN, ERROR]
This is built using the event emitter module.

## Installation

```sh
$ npm i --save log-message
```

## Example

```js
const log = require("log-message");

log.info("INFO message");
log.warn("WARNING message");
log.error("ERROR message");
```

## Documentation
`log-message` has 3 events `INFO`, `WARN` and `ERROR`. Each event has a logging level. For example, if the user
opts out for `ERROR` level (which has higher level level), the `INFO` and `WARN` messages will get displayed as well.

Enabling the logging includes below steps

 1. Gets the logging module
 2. Add `logProperties.json` in new properties folder under project home folder.
 
    Example:

    ```json
    {
      "level": "ERROR",
      "savedToFile": true,
      "fileLocation": "/../",
      "logFileName": "application.log",
      "maxFileSizeInBytes": 10000
    }
    ```
    
    These fields represent:
    
     - `level`: The debug level
	   - `savedToFile`: This will enable the creating log file in below given filepath.
	   - `fileLocation`: Default location is main file path. User can specify the path. The path should start and end with slash (e.g. `/../`). Note: Configure the path any existing directory and no new folders will be created to place this log file.
	   - `logFileName`: The log file name. If not specified, the default log name will be applied.
	   - `maxFileSizeInBytes`: The log file size (bytes), once size exceeded file will be backed up and a new log file will be created.


 3. Enable the options in the `logProperties.json` file according to the log options.
 4. Add the logging emits where ever required in your project code (e.g. `log.info("INFO message")`).
 5. Run your node project and then see the magic log statements in the console and in the file as well (if that was configured).

## How to contribute
Have an idea? Found a bug? Send me the list of them and will try the fix for those. I also accept contributions (via GitHub pull requests)!

## Where is this library used?
If you are using this library in one of your projects, add it in this list.

## License
[MIT](http://showalicense.com/?year=2016&fullname=Chiranjeevi%20Bairaagoni%20(Jeevi)#license-mit) © Chiranjeevi Bairaagoni (Jeevi)