/**
 * To use <body data-module='users' data-action='show'>
 *
 * Only a single module can be initialized per page, if that page requires other modules
 * then there should be a "page" module that initializes all of the modules for that page,
 * and that page module is what would be initialized via this method.
 *
 * Based heavily on the work by Paul Irish and Jason Garber
 *  - http://www.paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 *  - http://viget.com/inspire/extending-paul-irishs-comprehensive-dom-ready-execution
 * 
 */
;(function (baseNamespace, moduleNamespace){

    var DEFAULT_MODULE_NAME = 'common';  // this should init everything that inits every time

    // setup defaults if namespaces aren't passed in or are empty
    if (!baseNamespace) {
        baseNamespace = window.app || {};
        baseNamespace.util = baseNamespace.util || {};
    }
    if (!moduleNamespace) {
        moduleNamespace = baseNamespace.util;
    }

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
        var ns = baseNamespace;

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

    moduleNamespace.moduleExec = {
        init: init
    };

// Pass in the base namespace and where to attach the module as part of the IIFE
// Example does not have it because there is no surrounding app/namespace 
// i.e. 
// })(app, app.util); 
})();