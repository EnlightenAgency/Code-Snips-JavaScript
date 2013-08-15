var Logger = (function () {

    var browserVersion;

    function consoleEvents() {
        if (browserVersion != 9.0 && browserVersion != 8.0) {           // extend the console for ie10+
            var orgDebug = console.debug,
                orgErr = console.error,
                orgLog = console.log,
                orgWarn = console.warn;

            console.debug = function (msg) {
                orgDebug.apply(console, arguments);
                ga('send', 'event', 'JS console', 'debug', msg);        // univeral google analytics syntax
            }
            console.error = function (msg) {
                orgErr.apply(console, arguments);
                ga('send', 'event', 'JS console', 'error', msg);
            }
            console.log = function (msg) {
                orgLog.apply(console, arguments);
                ga('send', 'event', 'JS console', 'log', msg);
            }
            console.warn = function (msg) {
                orgWarn.apply(console, arguments);
                ga('send', 'event', 'JS console', 'warn', msg);
            }

            //window.onerror = function (msg, file, line) {
            //    ga('send', 'event', 'JS console', 'error', msg);
            //};
        }
        else {
            // fix ie8 not working without dev tools open
            window.console || (window.console = { debug: function () { }, error: function () { }, log: function () { }, warn: function () { } });

            // overwrite the console (.apply() breaks ie9-)
            window.console = (function (c) {
                return {
                    debug: function (v) {
                        ga('send', 'event', 'JS console', 'debug', v);
                        c.debug(v);
                    },
                    error: function (v) {
                        ga('send', 'event', 'JS console', 'error', v);
                        c.error(v);
                    },
                    log: function (v) {
                        ga('send', 'event', 'JS console', 'log', v);
                        c.log(v);
                    },
                    warn: function (v) {
                        ga('send', 'event', 'JS console', 'warn', v);
                        c.warn(v);
                    }
                };
            }(console));
        }
    }

    function browser() {
        navigator.sayswho = (function () {
            var N = navigator.appName, ua = navigator.userAgent, tem;
            var M = ua.match(/(opera|chrome|safari|firefox|msie)\/?\s*(\.?\d+(\.\d+)*)/i);
            if (M && (tem = ua.match(/version\/([\.\d]+)/i)) != null) M[2] = tem[1];
            M = M ? [M[1], M[2]] : [N, navigator.appVersion, '-?'];

            return M;
        })();

        return navigator.sayswho[1];
    }


    return {
        init: function () {
            browserVersion = browser();
            consoleEvents();
        }
    };
})();


$(function () {
    Logger.init();
});