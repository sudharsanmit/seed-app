System.register(['angular2/platform/browser', './app/app.component', './app/audio/audiohandler', './util/hockeyappservices'], function(exports_1) {
    var browser_1, app_component_1, audiohandler_1, hockeyappservices_1;
    function appExternalModuleTest() {
        browser_1.bootstrap(app_component_1.AppComponent);
        var testAudio = new audiohandler_1.AudioHandler();
        testAudio.playAudio(['audio/audiocheck.net_linearfrequencytest.mp3']);
        var hockeyapp = new hockeyappservices_1.HockeyAppServices();
    }
    exports_1("appExternalModuleTest", appExternalModuleTest);
    return {
        setters:[
            function (browser_1_1) {
                browser_1 = browser_1_1;
            },
            function (app_component_1_1) {
                app_component_1 = app_component_1_1;
            },
            function (audiohandler_1_1) {
                audiohandler_1 = audiohandler_1_1;
            },
            function (hockeyappservices_1_1) {
                hockeyappservices_1 = hockeyappservices_1_1;
            }],
        execute: function() {
        }
    }
});
