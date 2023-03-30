var EventEmitter = require('events').EventEmitter;
var fs = require('fs');

class FindPattern extends EventEmitter {
  constructor(regex) {
    super();

    this.regex = regex;
    this.files = [];
  }
}

FindPattern.prototype.addFile = function (file) {
  this.files.push(file);
  return this; // Used for method chaining.
}

FindPattern.prototype.findMatch = function () {
  /**
   * Self is created as a reference to the this of the FindPattern instance
   * before the callback function is defined.
   * 
   * Accessible due to the concept of closures.
   */
  var self = this;

  self.files.forEach(function (file) {
    fs.readFile(file, 'utf-8', function (err, content) {
      if (err) {
        return self.emit('error', err);
      }

      self.emit('fileread', file);

      var match = null;
      if (match = content.match(self.regex)) {
        match.forEach(function (elem) {
          self.emit('found', file, elem);
        });
      }
    })
  });

  return self;
}

// Async implementation
FindPattern.prototype.findMatchSync = function () {
  // 'for-of' is faster than 'forEach'
  for (const file of this.files) {
    try {
      const content = fs.readFileSync(file, 'utf-8');
      
      this.emit('fileread', file);

      const matches = content.match(this.regex) || [];
      for (const match of matches) {
        this.emit('found', file, match);
      }
    } catch (err) {
      this.emit('error', err);
    }
  }
  return this;
}


const findPattern = new FindPattern(/Hello \w+/g);

findPattern.addFile('fileA.txt');
findPattern.addFile('fileB.json');

findPattern.on('fileread', function (file) {
  console.log("Read file: " + file);
});

findPattern.on('found', function (file, elem) {
  console.log("Match found: " + "'" + elem + "'" + " in the file: " + file);
});

findPattern.on('error', function (err) {
  console.log("Error emitted: " + err.message);
});

// findPattern.findMatch();
findPattern.findMatchSync();