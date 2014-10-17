var Benchmark = require('benchmark'),
    Layout = require('../test/layout.js'),
    Layout2 = require('../test/layout2.js');

var suite = new Benchmark.Suite;

suite
    .add('Imerge#before', function() {
        new Layout();
    })
    .add('Imerge#after', function() {
        new Layout2();
        //console.log(1, 2)
    })
    .on('cycle', function(e) {
        console.log(String(e.target))
    })
    .on('complete', function() {
        //console.log(this)
        console.log(this.filter('fastest').pluck('name'))
    })
    .run();