function loadModule(filename, module, require) {
    var wrappedSrc =
        '(function(module, exports, require) {' + fs.readFileSync(filename, 'utf8') +
        '})(module, module.exports, require);';
    eval(wrappedSrc);
}

var require = function (moduleName) {
    console.log('Require invoked for module: ' + moduleName);
    
    /**
     * A module name is accepted as input and the very first thing that we do is resolve the full path of the module, 
     * which we call id. This task is delegated o require.resolve(), which implements a specific resolving algorithm
     */
    var id = require.resolve(moduleName);
    
    /**
     * If the module was already loaded in the past, it should be available in the cache. 
     * In this case, we just return it immediately.
     */
    if (require.cache[id]) {
        return require.cache[id].exports;
    }

    //module metadata
    /**
     * If the module was not yet loaded, we set up the environment for the first load. 
     * In particular, we create a module object that contains an exports property initialized with an empty object literal. 
     * This property will be used by the code of the module to export any public API.
     */
    var module = {
        exports: {},
        id: id
    };

    //Update the cache
    require.cache[id] = module; // The module object is cached.

    //load the module
    /**
     * The module source code is read from its file and the code is evaluated, as we have seen before. 
     * We provide to the module, the module object that we just created, and a reference to the require() function. 
     * The module exports its public API by manipulating or replacing the module.exports object.
     */
    loadModule(id, module, require);


    //return exported variables
    /**
     * Finally, the content of module.exports, which represents the public API of the module,
     * is returned to the caller.
     */
    return module.exports;
};

require.cache = {};

require.resolve = function (moduleName) {
    /* resolve a full module id from the moduleName */
}