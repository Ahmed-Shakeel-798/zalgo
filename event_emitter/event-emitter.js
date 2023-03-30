var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

function findPattern(files, regex) {
	var emitter = new EventEmitter(); // reference to EventEmitter prototype

	files.forEach(function (file) {
		fs.readFileSync(file, 'utf8', function (err, content) {
			if (err)
				return emitter.emit('error', err);

			emitter.emit('fileread', file);

			var match = null;
			if (match = content.match(regex))
				match.forEach(function (elem) {
					emitter.emit('found', file, elem);
				});
		});
	});

	/**
	 * Return emitter statement below, enables the caller of the findPattern function
	 * to use the returned emitter object to handle events emitted during file processing.
	 */
	return emitter;
}

// usage
// findPattern(
// 		['fileA.txt', 'fileB.json'],
// 		/Hello \w+/g
// 	)
// 	.on('fileread', function (file) {
// 		console.log(file + ' was read');
// 	})
// 	.on('found', function (file, match) {
// 		console.log('Matched "' + match + '" in file ' + file);
// 	})
// 	.on('error', function (err) {
// 		console.log('Error emitted: ' + err.message);
// 	});


const emitter = findPattern(['fileA.txt', 'fileB.json'],
	/Hello \w+/g);

/**
 * Although the readFile function has been triggered before we can register an event, since its async
 * it has to wait till the next tick of the event loop and until then the listener is already registered 
 * downn below. 
 */
emitter
	.on('fileread', function (file) {
		console.log(file + ' was read');
	})
	.on('found', function (file, match) {
		console.log('Matched "' + match + '" in file ' + file);
	})
	.on('error', function (err) {
		console.log('Error emitted: ' + err.message);
	});