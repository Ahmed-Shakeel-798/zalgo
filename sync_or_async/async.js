var fs = require('fs');
var cache = {};

/**
 * To make the function behavior consistent, we would make sure that the callback is invoked asyncronously
 * using process.nextTick()
 */
function inconsistentRead(filename, callback) {
	if (cache[filename]) {
		console.log('Reading from cache');
		// process.nextTick() takes a callback and pushes it on the top of event queue for the next cycle 
        // of the event loop. This is called deferred execution.
        process.nextTick(function () {
            callback(cache[filename]);
        });
	} else {
		//asynchronous function
		console.log('Reading from readFile');
		fs.readFile(filename, 'utf8', function (err, data) {
			cache[filename] = data;
			callback(data);
		});
	}
}

function createFileReader(filename) {
	var listeners = []; // An array of functions

	inconsistentRead(filename, function (value) {
		listeners.forEach(function (listener) {
			listener(value);
		});
	});

	return {
		onDataReady: function (listener) {
			listeners.push(listener);
		}
	};
}

/**
 * The idea here is that while the async operation (fs.read) is busy reading a file,
 * We would create a listener in the mean time.
 */
var reader1 = createFileReader('text1.txt');
reader1.onDataReady(function (data) {
	console.log('First call data: ' + data);

    /**
     * Now since the callback invocation is async by using process.nextTick(), the following listener would
     * be registered before the next event loop cycle. 
     */
	var reader2 = createFileReader('text1.txt');
	reader2.onDataReady(function (data) {
		console.log('Second call data: ' + data);
	});
});

/**
 * This one isn't affected by the async read because it is called fairly before the 
 * async operation concludes which means it won't read from the cache but rather invoke the fs.read
 */
var reader3 = createFileReader('text1.txt');
reader3.onDataReady(function (data) {
	console.log('third call data: ' + data);
});