/**
 * In asynchronous CPS however, proper error propagation is done by simply passing
 * the error to the next callback in the CPS chain.
 */

var fs = require('fs');

function readJSON(filename, callback) {
	fs.readFile(filename, 'utf8', function (err, data) {
		var parsed;
		if (err)
			//propagate the error and exit the current function
			return callback(err);
		try {
			//parse the file contents
			// parsed = JSON.parse(data);
		} catch (err) {
			//catch parsing errors
			return callback(err);
		}
		//no errors, propagate just the data
		callback(null, JSON.parse(data));
	});
};

readJSON('text1.txt', function (err, parsedData) {
	if (err) {
		console.log(err);
	} else {
		console.log(parsedData);
	}
})

process.on('uncaughtException', function(err){
	console.error('Exception caught: ' + err.message);
	//without this, the application would continue
	process.exit(1);
	});