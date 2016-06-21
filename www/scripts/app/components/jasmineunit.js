System.register([], function(exports_1) {
    function normalizeDataTest(jsonIn) {
        var data = JSON.parse(jsonIn);
        return {
            name: data.Name,
            id: Number(data.PersonalIdentifier)
        };
    }
    exports_1("normalizeDataTest", normalizeDataTest);
    return {
        setters:[],
        execute: function() {
        }
    }
});
