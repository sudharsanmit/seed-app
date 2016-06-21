System.register([], function(exports_1) {
    var HockeyAppServices;
    return {
        setters:[],
        execute: function() {
            HockeyAppServices = (function () {
                function HockeyAppServices() {
                    this.HOCKEY_APP_ID = '9ab0087d8f0444d5955e491c35c18936';
                    this.hasCordova = window.cordova;
                    if (this.hasCordova) {
                        this.testService = hockeyapp.start(this.onSuccessCallback, this.onErrorCallback, this.HOCKEY_APP_ID);
                    }
                }
                HockeyAppServices.prototype.displayFeedbackUI = function (msg) {
                    if (this.hasCordova) {
                        this.testService.feedback(this.success, this.error);
                    }
                };
                HockeyAppServices.prototype.checkForUpdate = function () {
                    if (this.hasCordova) {
                        this.testService.checkForUpdate(this.success, this.error);
                    }
                };
                HockeyAppServices.prototype.forceCrash = function (data) {
                    if (this.hasCordova) {
                        if (data !== undefined) {
                            this.testService.addMetaData(this.success, this.error, data);
                        }
                        this.testService.forceCrash();
                    }
                };
                HockeyAppServices.prototype.success = function () {
                };
                HockeyAppServices.prototype.error = function () {
                };
                HockeyAppServices.prototype.onSuccessCallback = function () {
                };
                HockeyAppServices.prototype.onErrorCallback = function () {
                };
                return HockeyAppServices;
            })();
            exports_1("HockeyAppServices", HockeyAppServices);
        }
    }
});
