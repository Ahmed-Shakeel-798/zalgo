var fs = require('fs');
var cache = {};

/**
 * The callback behavior of our inconsistentRead() function is really unpredictable
 * It is syncronous when cache is available and async when fs.readFile is invoked.
 */
function inconsistentRead(filename, callback) {
	if (cache[filename]) {
		//invoked synchronously
		console.log('Reading from cache');
		callback(cache[filename]);
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
	 * Here since this function is being executed after the async read there is no waiting
	 * So the callback provided to the function inconsistentRead() is executed immediately
	 * while there is no listener. 
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