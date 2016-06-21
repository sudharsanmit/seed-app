System.register(['./app'], function(exports_1) {
    var app_1;
    function initialize() {
        initializeCordova();
    }
    exports_1("initialize", initialize);
    function initializeCordova() {
        if (!window.cordova) {
            onDeviceReady();
        }
        else {
            document.addEventListener('deviceready', onDeviceReady, false);
        }
    }
    function onDeviceReady() {
        console.log('Cordova: on device ready');
        app_1.appExternalModuleTest();
    }
    return {
        setters:[
            function (app_1_1) {
                app_1 = app_1_1;
            }],
        execute: function() {
        }
    }
});
