function Logger(name) {
    // The follwing acts as a gaurd against invocations not using the new keyword
    if(!(this instanceof Logger)) {
        return new Logger(name);
    }
    this.name = name;
}

Logger.prototype.log = function(message) {
    console.log('[' + this.name + '] ' + message);
}

Logger.prototype.info = function(message) {
    console.log('info: ' + message);
}

Logger.prototype.verbose = function(message) {
    console.log('verbose: ' + message);
}

module.exports = Logger;