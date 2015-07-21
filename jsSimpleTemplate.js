// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
// and Rick Strahl - http://weblog.west-wind.com/posts/2008/Oct/13/Client-Templating-with-jQuery
// Modified to use {{ code }} and {{=param}}
// Anything beyond simple object parameter replacement should probably just use Mustache
// (might be fixed) Code that includes a ' (single quote) will not work in the {{ code }} block, this is a knownn issue
// 
// Test fiddle: http://jsfiddle.net/localpcguy/a00mLLd1/
// 
var ns = {};
(function(ns){
    var fnCache = {};

    ns.tmpl = function tmpl(str, data){
        var err = "", fn, strFn, tpl;
        
        try {
            
            // str can be an ID of a template object, or the template string itself
            // If an ID, it must start with #
            tpl = str;
            if (!!tpl && tpl.indexOf('#') === 0) {
                tpl = document.getElementById(str.substring(1,str.length-1)).innerHtml;
            }
            
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            fn = fnCache[str];
            if (!fn) {
                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                
                strFn = 
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                    tpl.replace(/[\r\t\n]/g, " ")
                        .replace(/'(?=[^%]*}})/g,"\t")
                        .split("'").join("\\'")
                        .split("\t").join("'")
                        .replace(/{{=(.+?)}}/g, "',$1,'")
                        .split("{{").join("');")
                        .split("}}").join("p.push('")
                        + "');}return p.join('');"
                
                //console.log(strFn + '\n');
                fn = new Function("obj", strFn);
                fnCache[str] = fn;
            }

            // for debugging
            // console.log(fn + '\n');
            
            // Provide some basic currying to the user
            return fn( data ).replace(/\>[\n\t ]+\</g, "><" );

        } catch (e) { 
            err = e.message; 
        }
        // Only gets here if there was an error in the try
        console.error('Template Error: ', err);
        console.log(fn + '\n'); 
    };
})(ns);


// Minified
var ns={};
!function(n){var e={};n.tmpl=function(n,t){var r,p,o,i="";try{return o=n,o&&0===o.indexOf("#")&&(o=document.getElementById(n.substring(1,n.length-1)).innerHtml),r=e[n],r||(p="var p=[],print=function(){p.push.apply(p,arguments);};with(obj){p.push('"+o.replace(/[\r\t\n]/g," ").replace(/'(?=[^%]*}})/g,"\t").split("'").join("\\'").split("\t").join("'").replace(/{{=(.+?)}}/g,"',$1,'").split("{{").join("');").split("}}").join("p.push('")+"');}return p.join('');",r=new Function("obj",p),e[n]=r),r(t).replace(/\>[\n\t ]+\</g,"><")}catch(l){i=l.message}console.error("Template Error: ",i),console.log(r+"\n")}}(ns);