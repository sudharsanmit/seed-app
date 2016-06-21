System.register([], function(exports_1) {
    var AudioHandler;
    return {
        setters:[],
        execute: function() {
            AudioHandler = (function () {
                function AudioHandler() {
                    createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.HTMLAudioPlugin, createjs.CordovaAudioPlugin]);
                    createjs.Sound.alternateExtensions = ['mp3'];
                    createjs.Sound.on('fileload', this.loadHandler, this);
                }
                AudioHandler.prototype.playAudio = function (audioFiles) {
                    createjs.Sound.registerSound(audioFiles[0], 'soundID');
                };
                AudioHandler.prototype.loadHandler = function (event) {
                    console.log('this is a test' + event);
                    console.log('play audio');
                    var instance = createjs.Sound.play('soundID');
                    instance.on('complete', this.handleComplete, this);
                    instance.volume = 0.5;
                };
                AudioHandler.prototype.handleComplete = function (event) {
                    console.log('handle complete');
                };
                return AudioHandler;
            })();
            exports_1("AudioHandler", AudioHandler);
        }
    }
});
