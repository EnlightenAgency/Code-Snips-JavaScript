// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
// and Rick Strahl - http://weblog.west-wind.com/posts/2008/Oct/13/Client-Templating-with-jQuery
// Modified to use {{ }} 
// Anything beyond simple object parameter replacement should probably just use Mustache
var ns = {};
(function(ns){
    var cache = {};

    ns.tmpl = function tmpl(str, data){
        var err = "";
        try {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) 
                    ? cache[str] = cache[str] || tmpl(document.getElementById(str).innerHTML) 
                    : new Function("obj", 

                        // Generate a reusable function that will serve as a template
                        // generator (and which will be cached).
                      "var p=[],print=function(){p.push.apply(p,arguments);};" +

                      // Introduce the data as local variables using with(){}
                      "with(obj){p.push('" +

                      // Convert the template into pure JavaScript
                      str.replace(/[\r\t\n]/g, " ")
                         .replace(/'(?=[^%]*}})/g,"\t")
                         .split("'").join("\\'")
                         .split("\t").join("'")
                         .replace(/{{=(.+?)%>/g, "',$1,'")
                         .split("{{").join("'+")
                         .split("}}").join(");p.push('")
                      + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn( data ) : fn;
        } catch (e) { err = e.message; }
        console.error('Template Error: ', err);
    };
})(ns);


// Minified
var ns = {};
!function(n){var t={};n.tmpl=function p(n,e){var r="";try{var i=/\W/.test(n)?new Function("obj","var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+n.replace(/[\r\t\n]/g," ").replace(/'(?=[^%]*}})/g," ").split("'").join("\\'").split("   ").join("'").replace(/{{=(.+?)%>/g,"',$1,'").split("{{").join("'+").split("}}").join(");p.push('")+"');}return p.join('');"):t[n]=t[n]||p(document.getElementById(n).innerHTML);return e?i(e):i}catch(o){r=o.message}return"< # ERROR: "+r+" # >\n"}}(ic);