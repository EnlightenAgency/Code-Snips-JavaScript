// Ensure app.util is available
(function() {
    window.app = window.app || {};
    window.app.util = window.app.util || {};
})();

/**
 * To use <body data-module='users' data-action='show'>
 *
 * Only a single module can be initialized per page, if that page requires other modules
 * then there should be a "page" module that initializes all of the modules for that page,
 * and that page module is what would be initialized via this method.
 *
 */
app.util.moduleExec = (function (namespace){

    var DEFAULT_MODULE_NAME = 'common';  // this should init everything that inits every time

    /**
     * util.init, when passed a single argument, defaults to calling an 'init' function 
     * (should it exist). Otherwise, util.init will execute appNamespace.module.action().
     * 
     */
    function init() {
        var body = document.body,
            module = body.getAttribute('data-module'),
            action = body.getAttribute('data-action');

        exec(DEFAULT_MODULE_NAME); 
        exec(module);
        exec(module, action);
    }

    /**
     * util.exec accepts a module and action, and executes that method
     * 
     * @param  {string} module the module name
     * @param  {string} action     If the action is omitted, the init() method will be executed
     * 
     */
    function exec(module, action) {
        var ns = namespace;

        action = (action === undefined) ? 'init' : action;

        if (module !== '' && ns[module] && typeof ns[module][action] == 'function') {
            ns[module][action]();
        }
    }

    // add this module last and self-execute
    init();

    // could also tell init to run on Document Ready via jQuery if jQuery is available
    // The reason for using this would be to avoid having to make sure this module is concatenated
    // at the end of all of the JavaScript files
    // $(init); 

    return {
        init: init
    };

})(app);

