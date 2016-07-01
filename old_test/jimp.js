var Jimp = require('jimp'),
    fs = require('fs');

fs.readFile('../test/web/test.png', function(err, image) {
    console.log(image);
    Jimp.read(image).then(function(image) {
        console.dir(image);
        console.log(image.bitmap.width, image.bitmap.height);
        var canvas = new Jimp(100, 100);
        canvas.composite(image, 10, 10);
        canvas.write('../test/web/jimpa.png');
    });
});
