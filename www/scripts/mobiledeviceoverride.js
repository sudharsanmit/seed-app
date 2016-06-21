console.log('add es6shim');
var scriptElem = document.createElement('script');
scriptElem.setAttribute('src', 'scripts/lib/es6-shim/es6-shim.js');
if (document.body) {
    document.body.appendChild(scriptElem);
}
else {
    document.head.appendChild(scriptElem);
}
