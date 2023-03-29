var Logger = require('./logger');
var dbLogger = new Logger('DB');
var accessLogger = Logger('ACCESS');
dbLogger.log('Hello world.');
accessLogger.log('Hello world.');
dbLogger.info('This is from database');
accessLogger.verbose('This is a verbose message from database');