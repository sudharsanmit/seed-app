function bootstrapApp(m) {
    m[m.length - 1].initialize();
}
Promise.all([
    System.import('soundJS'),
    System.import('index')
])
    .catch(function (error) { return console.error('Error: index loading with System:', error.toString()); })
    .then(bootstrapApp)
    .catch(function (error) { return console.error('Error: Boostrapping', error.toString()); });
