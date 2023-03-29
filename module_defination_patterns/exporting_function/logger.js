// Also know as the substack pattern
// We reassign the modules.exports variable to a function
// Only a single functionality is exposed and honors the principle of small surface area well.
module.exports = function (message) {
    console.log('info: ' + message);
};

// The exported function can be used as namespace for other public APIs
module.exports.verbose = function (message) {
    console.log('verbose info: ' + message);
}