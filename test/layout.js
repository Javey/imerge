//var _ = require('lodash');
var module = {};
var utils = {
    extend: function(obj) {
        _.each(Array.prototype.slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    Object.defineProperty(obj, prop, Object.getOwnPropertyDescriptor(source, prop));
                }
            }
        });
        return obj;
    },

    assign: function(obj, source, keys) {
        keys = _.isString(keys) ? [keys] : keys;
        for (var i = 0, l = keys.length; i < l; i++) {
            var key = keys[i];
            Object.defineProperty(obj, key, Object.getOwnPropertyDescriptor(source, key));
        }
    }
};

var point = {
    x0: 100,
    x1: 50,
    x2: 100,
    x3: 90
};

//var point = {
//    x0: 1,
//    x1: 1,
//    x2: 1,
//    x3: 1
//};

var root0 = {
        index: 0,
        type: 'root',
        get x() {
            return 0;
        },
        get y() {
            return 0;
        },
        get width() {
            return point.x3;
        },
        set width(value) {
            point.x3 = value;
        },
        get height() {
            return point.x0;
        },
        set height(value) {
            point.x0 = value;
        }
    },
    root1 = {
        index: 1,
        get x() {
            return point.x3;
        },
        get y() {
            return 0;
        },
        get width() {
            return point.x1;
        },
        set width(value) {
            point.x1 = value;
        },
        get height() {
            return point.x0;
        },
        set height(value) {
            point.x0 = value;
        }
    },
    root2 = {
        index: 2,
        get x() {
            return point.x3;
        },
        get y() {
            return point.x0;
        },
        get width() {
            return point.x1;
        },
        set width(value) {
            point.x1 = value;
        },
        get height() {
            return point.x2;
        },
        set height(value) {
            point.x2 = value;
        }
    },
    root3 = {
        index: 3,
        get x() {
            return 0;
        },
        get y() {
            return point.x0;
        },
        get width() {
            return point.x3;
        },
        set width(value) {
            point.x3 = value;
        },
        get height() {
            return point.x2;
        },
        set height(value) {
            point.x2 = value;
        }
    };

var wrapper = $('.wrapper');

var FlexLayout = module.exports = function(blocks) {
    this.blocks = blocks;
    this.roots = [root0, root1, root2, root3];
    this.init();
};

FlexLayout.prototype = {
    constructor: FlexLayout,

    init: function() {
        this.blocks = [
//            {width: 154, height:183},
//            {width: 125, height:182},
//            {width: 180, height:33},
//            {width: 62, height:176},
//            {width: 43, height:156},
//            {width: 172, height:36},
////            {width: 123, height:34},
//            {width: 142, height:12},
//
//            {"width":191,"height":143},
//            {"width":154,"height":183},
//            {"width":125,"height":182},
//            {"width":180,"height":33},{"width":180,"height":43},{"width":62,"height":176}
        ];
//        this.blocks = [{"width":1,"height":100,"fit":{"index":0,"id":"splitNode","width":1,"height":100,"x":0,"y":0}},{"width":70,"height":100,"fit":{"index":0,"id":"splitNode","width":70,"height":100,"x":1,"y":0}},{"width":43,"height":99,"fit":{"index":0,"id":"splitNode","width":43,"height":99,"x":71,"y":0}},{"width":99,"height":21,"fit":{"index":0,"id":"splitNode","width":99,"height":21,"x":0,"y":100}},{"width":41,"height":98,"fit":{"index":0,"id":"splitNode","width":41,"height":98,"x":114,"y":0}},{"width":22,"height":97,"fit":{"index":0,"id":"splitNode","width":22,"height":97,"x":155,"y":0}},{"width":97,"height":21,"fit":{"index":0,"id":"splitNode","width":97,"height":21,"x":99,"y":99}},{"width":96,"height":49,"fit":{"index":0,"id":"splitNode","width":96,"height":49,"x":0,"y":121}},{"width":16,"height":96,"fit":{"index":0,"id":"splitNode","width":16,"height":96,"x":177,"y":0}},{"width":62,"height":96,"fit":{"index":0,"id":"splitNode","width":62,"height":96,"x":196,"y":0}},{"width":96,"height":44,"fit":{"index":0,"id":"splitNode","width":96,"height":44,"x":99,"y":120}},{"width":36,"height":96,"fit":{"index":0,"id":"splitNode","width":36,"height":96,"x":258,"y":0}},{"width":95,"height":19,"fit":{"index":0,"id":"splitNode","width":95,"height":19,"x":196,"y":96}},{"width":20,"height":94,"fit":{"index":0,"id":"splitNode","width":20,"height":94,"x":0,"y":170}},{"width":94,"height":24,"fit":{"index":0,"id":"splitNode","width":94,"height":24,"x":195,"y":120}},{"width":93,"height":33,"fit":{"index":0,"id":"splitNode","width":93,"height":33,"x":96,"y":164}},{"width":6,"height":93,"fit":{"index":0,"id":"splitNode","width":6,"height":93,"x":195,"y":144}},{"width":93,"height":73,"fit":{"index":0,"id":"splitNode","width":93,"height":73,"x":201,"y":144}},{"width":73,"height":93,"fit":{"index":0,"id":"splitNode","width":73,"height":93,"x":20,"y":170}},{"width":22,"height":92,"fit":{"index":0,"id":"splitNode","width":22,"height":92,"x":294,"y":0}},{"width":92,"height":64,"fit":{"index":0,"id":"splitNode","width":92,"height":64,"x":93,"y":197}},{"width":91,"height":10,"fit":{"index":0,"id":"splitNode","width":91,"height":10,"x":201,"y":217}},{"width":91,"height":73,"fit":{"index":0,"id":"splitNode","width":91,"height":73,"x":294,"y":92}},{"width":11,"height":91,"fit":{"index":0,"id":"splitNode","width":11,"height":91,"x":294,"y":165}},{"width":90,"height":47,"fit":{"index":0,"id":"splitNode","width":90,"height":47,"x":316,"y":0}},{"width":17,"height":88,"fit":{"index":0,"id":"splitNode","width":17,"height":88,"x":305,"y":165}},{"width":87,"height":38,"fit":{"index":0,"id":"splitNode","width":87,"height":38,"x":316,"y":47}},{"width":87,"height":84,"fit":{"index":0,"id":"splitNode","width":87,"height":84,"x":0,"y":264}},{"width":86,"height":39,"fit":{"index":0,"id":"splitNode","width":86,"height":39,"x":93,"y":261}},{"width":86,"height":25,"fit":{"index":0,"id":"splitNode","width":86,"height":25,"x":185,"y":237}},{"width":31,"height":85,"fit":{"index":0,"id":"splitNode","width":31,"height":85,"x":305,"y":253}},{"width":83,"height":41,"fit":{"index":0,"id":"splitNode","width":83,"height":41,"x":322,"y":165}},{"width":82,"height":7,"fit":{"index":0,"id":"splitNode","width":82,"height":7,"x":316,"y":85}},{"width":82,"height":11,"fit":{"index":0,"id":"splitNode","width":82,"height":11,"x":87,"y":300}},{"width":63,"height":80,"fit":{"index":0,"id":"splitNode","width":63,"height":80,"x":179,"y":264}},{"width":76,"height":80,"fit":{"index":0,"id":"splitNode","width":76,"height":80,"x":406,"y":0}},{"width":79,"height":56,"fit":{"index":0,"id":"splitNode","width":79,"height":56,"x":336,"y":206}},{"width":70,"height":78,"fit":{"index":0,"id":"splitNode","width":70,"height":78,"x":398,"y":85}},{"width":11,"height":78,"fit":{"index":0,"id":"splitNode","width":11,"height":78,"x":271,"y":227}},{"width":51,"height":78,"fit":{"index":0,"id":"splitNode","width":51,"height":78,"x":336,"y":262}},{"width":76,"height":11,"fit":{"index":0,"id":"splitNode","width":76,"height":11,"x":87,"y":311}},{"width":76,"height":4,"fit":{"index":0,"id":"splitNode","width":76,"height":4,"x":196,"y":115}},{"width":27,"height":73,"fit":{"index":0,"id":"splitNode","width":27,"height":73,"x":415,"y":163}},{"width":72,"height":24,"fit":{"index":0,"id":"splitNode","width":72,"height":24,"x":387,"y":262}},{"width":3,"height":71,"fit":{"index":0,"id":"splitNode","width":3,"height":71,"x":193,"y":0}},{"width":69,"height":43,"fit":{"index":0,"id":"splitNode","width":69,"height":43,"x":387,"y":286}},{"width":67,"height":44,"fit":{"index":0,"id":"splitNode","width":67,"height":44,"x":0,"y":348}},{"width":6,"height":67,"fit":{"index":0,"id":"splitNode","width":6,"height":67,"x":189,"y":164}},{"width":1,"height":66,"fit":{"index":0,"id":"splitNode","width":1,"height":66,"x":292,"y":217}},{"width":60,"height":65,"fit":{"index":0,"id":"splitNode","width":60,"height":65,"x":242,"y":305}},{"width":45,"height":64,"fit":{"index":0,"id":"splitNode","width":45,"height":64,"x":87,"y":322}},{"width":63,"height":32,"fit":{"index":0,"id":"splitNode","width":63,"height":32,"x":387,"y":329}},{"width":57,"height":63,"fit":{"index":0,"id":"splitNode","width":57,"height":63,"x":0,"y":392}},{"width":63,"height":58,"fit":{"index":0,"id":"splitNode","width":63,"height":58,"x":132,"y":344}},{"width":18,"height":62,"fit":{"index":0,"id":"splitNode","width":18,"height":62,"x":442,"y":163}},{"width":6,"height":61,"fit":{"index":0,"id":"splitNode","width":6,"height":61,"x":385,"y":92}},{"width":61,"height":4,"fit":{"index":0,"id":"splitNode","width":61,"height":4,"x":403,"y":80}},{"width":58,"height":30,"fit":{"index":0,"id":"splitNode","width":58,"height":30,"x":302,"y":340}},{"width":45,"height":58,"fit":{"index":0,"id":"splitNode","width":45,"height":58,"x":195,"y":344}},{"width":19,"height":57,"fit":{"index":0,"id":"splitNode","width":19,"height":57,"x":456,"y":286}},{"width":57,"height":42,"fit":{"index":0,"id":"splitNode","width":57,"height":42,"x":67,"y":386}},{"width":56,"height":29,"fit":{"index":0,"id":"splitNode","width":56,"height":29,"x":360,"y":361}},{"width":24,"height":55,"fit":{"index":0,"id":"splitNode","width":24,"height":55,"x":450,"y":343}},{"width":20,"height":52,"fit":{"index":0,"id":"splitNode","width":20,"height":52,"x":460,"y":163}},{"width":52,"height":14,"fit":{"index":0,"id":"splitNode","width":52,"height":14,"x":415,"y":236}},{"width":52,"height":29,"fit":{"index":0,"id":"splitNode","width":52,"height":29,"x":124,"y":402}},{"width":30,"height":52,"fit":{"index":0,"id":"splitNode","width":30,"height":52,"x":240,"y":370}},{"width":52,"height":24,"fit":{"index":0,"id":"splitNode","width":52,"height":24,"x":57,"y":428}},{"width":10,"height":51,"fit":{"index":0,"id":"splitNode","width":10,"height":51,"x":282,"y":227}},{"width":12,"height":50,"fit":{"index":0,"id":"splitNode","width":12,"height":50,"x":416,"y":361}},{"width":9,"height":49,"fit":{"index":0,"id":"splitNode","width":9,"height":49,"x":293,"y":256}},{"width":5,"height":48,"fit":{"index":0,"id":"splitNode","width":5,"height":48,"x":391,"y":92}},{"width":47,"height":6,"fit":{"index":0,"id":"splitNode","width":47,"height":6,"x":201,"y":227}},{"width":47,"height":32,"fit":{"index":0,"id":"splitNode","width":47,"height":32,"x":270,"y":370}},{"width":39,"height":46,"fit":{"index":0,"id":"splitNode","width":39,"height":46,"x":176,"y":402}},{"width":45,"height":19,"fit":{"index":0,"id":"splitNode","width":45,"height":19,"x":132,"y":322}},{"width":34,"height":44,"fit":{"index":0,"id":"splitNode","width":34,"height":44,"x":270,"y":411}},{"width":44,"height":23,"fit":{"index":0,"id":"splitNode","width":44,"height":23,"x":428,"y":398}},{"width":44,"height":8,"fit":{"index":0,"id":"splitNode","width":44,"height":8,"x":415,"y":250}},{"width":43,"height":19,"fit":{"index":0,"id":"splitNode","width":43,"height":19,"x":317,"y":370}},{"width":40,"height":38,"fit":{"index":0,"id":"splitNode","width":40,"height":38,"x":317,"y":390}},{"width":39,"height":17,"fit":{"index":0,"id":"splitNode","width":39,"height":17,"x":215,"y":422}},{"width":37,"height":23,"fit":{"index":0,"id":"splitNode","width":37,"height":23,"x":357,"y":390}},{"width":37,"height":26,"fit":{"index":0,"id":"splitNode","width":37,"height":26,"x":304,"y":428}},{"width":34,"height":16,"fit":{"index":0,"id":"splitNode","width":34,"height":16,"x":357,"y":422}},{"width":1,"height":34,"fit":{"index":0,"id":"splitNode","width":1,"height":34,"x":96,"y":121}},{"width":34,"height":8,"fit":{"index":0,"id":"splitNode","width":34,"height":8,"x":442,"y":225}},{"width":25,"height":34,"fit":{"index":0,"id":"splitNode","width":25,"height":34,"x":242,"y":264}},{"width":33,"height":24,"fit":{"index":0,"id":"splitNode","width":33,"height":24,"x":394,"y":411}},{"width":14,"height":32,"fit":{"index":0,"id":"splitNode","width":14,"height":32,"x":322,"y":206}},{"width":32,"height":7,"fit":{"index":0,"id":"splitNode","width":32,"height":7,"x":176,"y":448}},{"width":30,"height":23,"fit":{"index":0,"id":"splitNode","width":30,"height":23,"x":427,"y":422}},{"width":10,"height":24,"fit":{"index":0,"id":"splitNode","width":10,"height":24,"x":67,"y":348}},{"width":21,"height":17,"fit":{"index":0,"id":"splitNode","width":21,"height":17,"x":360,"y":340}},{"width":19,"height":16,"fit":{"index":0,"id":"splitNode","width":19,"height":16,"x":459,"y":250}},{"width":19,"height":6,"fit":{"index":0,"id":"splitNode","width":19,"height":6,"x":109,"y":431}},{"width":7,"height":18,"fit":{"index":0,"id":"splitNode","width":7,"height":18,"x":474,"y":343}},{"width":8,"height":17,"fit":{"index":0,"id":"splitNode","width":8,"height":17,"x":468,"y":80}},{"width":4,"height":12,"fit":{"index":0,"id":"splitNode","width":4,"height":12,"x":289,"y":115}},{"width":8,"height":9,"fit":{"index":0,"id":"splitNode","width":8,"height":9,"x":385,"y":153}}];
//        this.blocks = [{"width":100,"height":97,"fit":{"index":0,"id":"splitNode","width":100,"height":97,"x":0,"y":0}},{"width":21,"height":99,"fit":{"index":0,"id":"splitNode","width":21,"height":99,"x":100,"y":0}},{"width":78,"height":99,"fit":{"index":0,"id":"splitNode","width":78,"height":99,"x":121,"y":0}},{"width":99,"height":85,"fit":{"index":0,"id":"splitNode","width":99,"height":85,"x":0,"y":97}},{"width":26,"height":98,"fit":{"index":0,"id":"splitNode","width":26,"height":98,"x":199,"y":0}},{"width":98,"height":2,"fit":{"index":0,"id":"splitNode","width":98,"height":2,"x":99,"y":99}},{"width":82,"height":96,"fit":{"index":0,"id":"splitNode","width":82,"height":96,"x":225,"y":0}},{"width":96,"height":55,"fit":{"index":0,"id":"splitNode","width":96,"height":55,"x":199,"y":98}},{"width":93,"height":95,"fit":{"index":0,"id":"splitNode","width":93,"height":95,"x":0,"y":182}},{"width":95,"height":8,"fit":{"index":0,"id":"splitNode","width":95,"height":8,"x":99,"y":101}},{"width":94,"height":33,"fit":{"index":0,"id":"splitNode","width":94,"height":33,"x":99,"y":153}},{"width":7,"height":94,"fit":{"index":0,"id":"splitNode","width":7,"height":94,"x":295,"y":96}},{"width":94,"height":67,"fit":{"index":0,"id":"splitNode","width":94,"height":67,"x":193,"y":153}},{"width":94,"height":2,"fit":{"index":0,"id":"splitNode","width":94,"height":2,"x":99,"y":109}},{"width":93,"height":28,"fit":{"index":0,"id":"splitNode","width":93,"height":28,"x":193,"y":220}},{"width":92,"height":70,"fit":{"index":0,"id":"splitNode","width":92,"height":70,"x":307,"y":0}},{"width":92,"height":19,"fit":{"index":0,"id":"splitNode","width":92,"height":19,"x":302,"y":96}},{"width":19,"height":91,"fit":{"index":0,"id":"splitNode","width":19,"height":91,"x":302,"y":115}},{"width":74,"height":91,"fit":{"index":0,"id":"splitNode","width":74,"height":91,"x":321,"y":115}},{"width":6,"height":91,"fit":{"index":0,"id":"splitNode","width":6,"height":91,"x":93,"y":182}},{"width":51,"height":90,"fit":{"index":0,"id":"splitNode","width":51,"height":90,"x":0,"y":277}},{"width":90,"height":34,"fit":{"index":0,"id":"splitNode","width":90,"height":34,"x":99,"y":111}},{"width":16,"height":88,"fit":{"index":0,"id":"splitNode","width":16,"height":88,"x":193,"y":248}},{"width":88,"height":17,"fit":{"index":0,"id":"splitNode","width":88,"height":17,"x":307,"y":70}},{"width":86,"height":87,"fit":{"index":0,"id":"splitNode","width":86,"height":87,"x":287,"y":206}},{"width":85,"height":63,"fit":{"index":0,"id":"splitNode","width":85,"height":63,"x":209,"y":293}},{"width":1,"height":84,"fit":{"index":0,"id":"splitNode","width":1,"height":84,"x":395,"y":70}},{"width":83,"height":42,"fit":{"index":0,"id":"splitNode","width":83,"height":42,"x":399,"y":0}},{"width":83,"height":73,"fit":{"index":0,"id":"splitNode","width":83,"height":73,"x":373,"y":206}},{"width":56,"height":83,"fit":{"index":0,"id":"splitNode","width":56,"height":83,"x":373,"y":279}},{"width":83,"height":33,"fit":{"index":0,"id":"splitNode","width":83,"height":33,"x":395,"y":154}},{"width":82,"height":81,"fit":{"index":0,"id":"splitNode","width":82,"height":81,"x":396,"y":70}},{"width":81,"height":14,"fit":{"index":0,"id":"splitNode","width":81,"height":14,"x":395,"y":187}},{"width":73,"height":81,"fit":{"index":0,"id":"splitNode","width":73,"height":81,"x":0,"y":367}},{"width":81,"height":73,"fit":{"index":0,"id":"splitNode","width":81,"height":73,"x":193,"y":356}},{"width":81,"height":60,"fit":{"index":0,"id":"splitNode","width":81,"height":60,"x":373,"y":362}},{"width":81,"height":26,"fit":{"index":0,"id":"splitNode","width":81,"height":26,"x":399,"y":42}},{"width":80,"height":76,"fit":{"index":0,"id":"splitNode","width":80,"height":76,"x":482,"y":0}},{"width":80,"height":41,"fit":{"index":0,"id":"splitNode","width":80,"height":41,"x":476,"y":187}},{"width":80,"height":38,"fit":{"index":0,"id":"splitNode","width":80,"height":38,"x":429,"y":279}},{"width":43,"height":80,"fit":{"index":0,"id":"splitNode","width":43,"height":80,"x":51,"y":277}},{"width":13,"height":78,"fit":{"index":0,"id":"splitNode","width":13,"height":78,"x":274,"y":356}},{"width":69,"height":77,"fit":{"index":0,"id":"splitNode","width":69,"height":77,"x":478,"y":76}},{"width":30,"height":76,"fit":{"index":0,"id":"splitNode","width":30,"height":76,"x":454,"y":317}},{"width":75,"height":38,"fit":{"index":0,"id":"splitNode","width":75,"height":38,"x":209,"y":248}},{"width":75,"height":53,"fit":{"index":0,"id":"splitNode","width":75,"height":53,"x":454,"y":393}},{"width":74,"height":24,"fit":{"index":0,"id":"splitNode","width":74,"height":24,"x":456,"y":228}},{"width":60,"height":74,"fit":{"index":0,"id":"splitNode","width":60,"height":74,"x":484,"y":317}},{"width":74,"height":68,"fit":{"index":0,"id":"splitNode","width":74,"height":68,"x":0,"y":448}},{"width":73,"height":41,"fit":{"index":0,"id":"splitNode","width":73,"height":41,"x":193,"y":429}},{"width":72,"height":61,"fit":{"index":0,"id":"splitNode","width":72,"height":61,"x":373,"y":422}},{"width":69,"height":71,"fit":{"index":0,"id":"splitNode","width":69,"height":71,"x":562,"y":0}},{"width":58,"height":71,"fit":{"index":0,"id":"splitNode","width":58,"height":71,"x":556,"y":76}},{"width":71,"height":62,"fit":{"index":0,"id":"splitNode","width":71,"height":62,"x":530,"y":228}},{"width":40,"height":70,"fit":{"index":0,"id":"splitNode","width":40,"height":70,"x":529,"y":391}},{"width":22,"height":70,"fit":{"index":0,"id":"splitNode","width":22,"height":70,"x":73,"y":357}},{"width":35,"height":69,"fit":{"index":0,"id":"splitNode","width":35,"height":69,"x":556,"y":147}},{"width":68,"height":12,"fit":{"index":0,"id":"splitNode","width":68,"height":12,"x":193,"y":470}},{"width":67,"height":64,"fit":{"index":0,"id":"splitNode","width":67,"height":64,"x":445,"y":446}},{"width":34,"height":66,"fit":{"index":0,"id":"splitNode","width":34,"height":66,"x":544,"y":290}},{"width":15,"height":64,"fit":{"index":0,"id":"splitNode","width":15,"height":64,"x":266,"y":434}},{"width":64,"height":16,"fit":{"index":0,"id":"splitNode","width":64,"height":16,"x":456,"y":252}},{"width":63,"height":9,"fit":{"index":0,"id":"splitNode","width":63,"height":9,"x":307,"y":87}},{"width":4,"height":63,"fit":{"index":0,"id":"splitNode","width":4,"height":63,"x":287,"y":356}},{"width":61,"height":46,"fit":{"index":0,"id":"splitNode","width":61,"height":46,"x":512,"y":461}},{"width":40,"height":60,"fit":{"index":0,"id":"splitNode","width":40,"height":60,"x":591,"y":147}},{"width":60,"height":9,"fit":{"index":0,"id":"splitNode","width":60,"height":9,"x":556,"y":216}},{"width":58,"height":24,"fit":{"index":0,"id":"splitNode","width":58,"height":24,"x":478,"y":153}},{"width":43,"height":57,"fit":{"index":0,"id":"splitNode","width":43,"height":57,"x":578,"y":290}},{"width":10,"height":56,"fit":{"index":0,"id":"splitNode","width":10,"height":56,"x":74,"y":427}},{"width":53,"height":25,"fit":{"index":0,"id":"splitNode","width":53,"height":25,"x":373,"y":483}},{"width":28,"height":51,"fit":{"index":0,"id":"splitNode","width":28,"height":51,"x":569,"y":356}},{"width":50,"height":3,"fit":{"index":0,"id":"splitNode","width":50,"height":3,"x":99,"y":145}},{"width":48,"height":27,"fit":{"index":0,"id":"splitNode","width":48,"height":27,"x":193,"y":482}},{"width":47,"height":22,"fit":{"index":0,"id":"splitNode","width":47,"height":22,"x":569,"y":407}},{"width":47,"height":39,"fit":{"index":0,"id":"splitNode","width":47,"height":39,"x":573,"y":429}},{"width":36,"height":45,"fit":{"index":0,"id":"splitNode","width":36,"height":45,"x":573,"y":468}},{"width":44,"height":8,"fit":{"index":0,"id":"splitNode","width":44,"height":8,"x":456,"y":268}},{"width":37,"height":43,"fit":{"index":0,"id":"splitNode","width":37,"height":43,"x":0,"y":516}},{"width":42,"height":14,"fit":{"index":0,"id":"splitNode","width":42,"height":14,"x":373,"y":510}},{"width":42,"height":5,"fit":{"index":0,"id":"splitNode","width":42,"height":5,"x":395,"y":201}},{"width":20,"height":41,"fit":{"index":0,"id":"splitNode","width":20,"height":41,"x":429,"y":317}},{"width":41,"height":24,"fit":{"index":0,"id":"splitNode","width":41,"height":24,"x":193,"y":509}},{"width":41,"height":8,"fit":{"index":0,"id":"splitNode","width":41,"height":8,"x":478,"y":177}},{"width":40,"height":32,"fit":{"index":0,"id":"splitNode","width":40,"height":32,"x":512,"y":507}},{"width":40,"height":21,"fit":{"index":0,"id":"splitNode","width":40,"height":21,"x":37,"y":516}},{"width":38,"height":9,"fit":{"index":0,"id":"splitNode","width":38,"height":9,"x":591,"y":207}},{"width":35,"height":27,"fit":{"index":0,"id":"splitNode","width":35,"height":27,"x":509,"y":290}},{"width":20,"height":34,"fit":{"index":0,"id":"splitNode","width":20,"height":34,"x":536,"y":153}},{"width":33,"height":32,"fit":{"index":0,"id":"splitNode","width":33,"height":32,"x":241,"y":498}},{"width":29,"height":31,"fit":{"index":0,"id":"splitNode","width":29,"height":31,"x":601,"y":225}},{"width":23,"height":31,"fit":{"index":0,"id":"splitNode","width":23,"height":31,"x":544,"y":356}},{"width":8,"height":31,"fit":{"index":0,"id":"splitNode","width":8,"height":31,"x":189,"y":111}},{"width":8,"height":31,"fit":{"index":0,"id":"splitNode","width":8,"height":31,"x":287,"y":153}},{"width":18,"height":26,"fit":{"index":0,"id":"splitNode","width":18,"height":26,"x":456,"y":201}},{"width":21,"height":19,"fit":{"index":0,"id":"splitNode","width":21,"height":19,"x":597,"y":347}},{"width":13,"height":17,"fit":{"index":0,"id":"splitNode","width":13,"height":17,"x":193,"y":336}},{"width":11,"height":17,"fit":{"index":0,"id":"splitNode","width":11,"height":17,"x":281,"y":434}},{"width":16,"height":10,"fit":{"index":0,"id":"splitNode","width":16,"height":10,"x":51,"y":357}},{"width":14,"height":4,"fit":{"index":0,"id":"splitNode","width":14,"height":4,"x":287,"y":190}}];
//        this.blocks = [{"width":100,"height":97,"fit":{"index":0,"id":"splitNode","width":100,"height":97,"x":0,"y":0}},{"width":21,"height":99,"fit":{"index":0,"id":"splitNode","width":21,"height":99,"x":100,"y":0}},{"width":99,"height":85,"fit":{"index":0,"id":"splitNode","width":99,"height":85,"x":121,"y":0}},{"width":78,"height":99,"fit":{"index":0,"id":"splitNode","width":78,"height":99,"x":0,"y":97}},{"width":98,"height":2,"fit":{"index":0,"id":"splitNode","width":98,"height":2,"x":121,"y":85}},{"width":26,"height":98,"fit":{"index":0,"id":"splitNode","width":26,"height":98,"x":121,"y":87}},{"width":82,"height":96,"fit":{"index":0,"id":"splitNode","width":82,"height":96,"x":220,"y":0}},{"width":96,"height":55,"fit":{"index":0,"id":"splitNode","width":96,"height":55,"x":147,"y":96}},{"width":95,"height":8,"fit":{"index":0,"id":"splitNode","width":95,"height":8,"x":78,"y":185}},{"width":93,"height":95,"fit":{"index":0,"id":"splitNode","width":93,"height":95,"x":0,"y":196}},{"width":94,"height":33,"fit":{"index":0,"id":"splitNode","width":94,"height":33,"x":147,"y":151}},{"width":94,"height":67,"fit":{"index":0,"id":"splitNode","width":94,"height":67,"x":93,"y":193}},{"width":94,"height":2,"fit":{"index":0,"id":"splitNode","width":94,"height":2,"x":93,"y":260}},{"width":7,"height":94,"fit":{"index":0,"id":"splitNode","width":7,"height":94,"x":243,"y":96}},{"width":93,"height":28,"fit":{"index":0,"id":"splitNode","width":93,"height":28,"x":93,"y":262}},{"width":92,"height":70,"fit":{"index":0,"id":"splitNode","width":92,"height":70,"x":187,"y":190}},{"width":92,"height":19,"fit":{"index":0,"id":"splitNode","width":92,"height":19,"x":186,"y":262}},{"width":19,"height":91,"fit":{"index":0,"id":"splitNode","width":19,"height":91,"x":250,"y":96}},{"width":74,"height":91,"fit":{"index":0,"id":"splitNode","width":74,"height":91,"x":302,"y":0}},{"width":6,"height":91,"fit":{"index":0,"id":"splitNode","width":6,"height":91,"x":279,"y":96}},{"width":90,"height":34,"fit":{"index":0,"id":"splitNode","width":90,"height":34,"x":279,"y":187}}];
        var self = this;
        _.each(_.range(100), function() {
            self.blocks.push({
                width: _.random(1, 100),
                height: _.random(1, 100)
            })
        });
        this.sort();
        this.resetFirstRoot();
        //this.spaces = [this.roots[0], this.roots[1], this.roots[2], this.roots[3]];
        this.spaces = Array.prototype.slice.call(this.roots, 0);
//        this.spaces = [this.roots[0]];
        this._testRoots = _.sortBy(this.roots, function(root) {
            return root.index;
        });
        this.fit();
    },

    drawRect: function() {
        wrapper.empty();
        _.each(this._testRoots, function(root) {
            var div = $('<div class="root"></div>');
            div.css({
                width: root.width,
                height: root.height,
                backgroundColor: '#' + root.index + root.index + root.index,
                left: root.x,
                top: root.y
            }).appendTo(wrapper);
        });
        var rootDiv = wrapper.children();
        _.each(this._testBlocks, _.bind(function(block) {
            var index = block.fit.index,
                root = rootDiv.eq(index),
                div = $('<div class="root"></div>');
            div.css({
                width: block.width,
                height: block.height,
                backgroundColor: 'rgb(' + _.random(50, 255) + ', ' + _.random(50, 255) + ', ' + _.random(50, 255) + ')',
                left: block.fit.x - this._testRoots[index].x,
                top: block.fit.y - this._testRoots[index].y
            }).appendTo(root);
        }, this));

        _.each(this.spaces, _.bind(function(space) {
            var index = space.index,
                root = rootDiv.eq(index),
                div = $('<div class="space"></div>');
            var color = _.random(0, 255) + ', ' + _.random(0, 255) + ', ' + _.random(0, 255);
            div.css({
                width: space.width,
                height: space.height,
                borderColor: 'rgb(' + color + ')',
                left: space.x - this._testRoots[index].x,
                top: space.y - this._testRoots[index].y
            }).appendTo(root);
        }, this));
    },

    sort: function() {
        var sort = function(a, b) {
            var maxA = Math.max(a.width, a.height),
                maxB = Math.max(b.width, b.height),
                diffMax = maxB - maxA;

            if (diffMax === 0) {
                var areaA = a.width * a.height,
                    areaB = a.width * a.height;
                return areaB - areaA;
            } else {
                return diffMax;
            }
        };

        this.blocks.sort(sort);
        this.roots.sort(sort);
//        console.log(this.blocks, this.roots);
    },

    fit: function() {
        this._testBlocks = [];
        _.each(this.blocks, _.bind(function(block) {
            this.drawRect();
            var node;
            if (node = this.findNode(block.width, block.height)) {
//                console.log(node);
                block.fit = this.splitNode(node, block.width, block.height);
//                console.log(block);
            } else {
                //console.log('not found');
                block.fit = this.growNode(block.width, block.height);
                //console.log(block, block.fit);
            }
            this._testBlocks.push(block);
        }, this));
//        console.log(this.blocks);
//        console.log(this.roots[0].width, point);
    },

    resetFirstRoot: function() {
        var block = this.blocks[0],
            root = this.roots[0];
        if (block.width > root.width) {
            root.width = block.width;
        }
        if (block.height > root.height) {
            root.height = block.height;
        }
    },

    findNode: function(width, height) {
        var group = this._spaceGroup = {right: [], down: []},
            down = group.down,
            right = group.right,
            root = this.roots[0],
            spaces = this.spaces;

        return _.find(spaces, _.bind(function(space, index) {
            if (width <= space.width && height <= space.height) {
                spaces.splice(index, 1);
                return space;
            }

            if (width <= space.width && space.y + space.height === root.height) {
                down.push(space);
            } else if (height <= space.height && space.x + space.width === root.width) {
                right.push(space);
            }

            return null;
        }, this));
    },

    splitNode: function(space, width, height) {
        var ret =  {
            index: space.index,
            id: 'splitNode',
            width: width,
            height: height
        };
        utils.assign(ret, space, ['x', 'y']);

        var newSpaces = this.splitSpace(space, ret),
            spaces = [];
        _.each(this.spaces, _.bind(function(space) {
            var overlap;
            if (space.index === ret.index && (overlap = this.overlap(space, ret))) {
                newSpaces = newSpaces.concat(this.splitSpace(space, overlap));
            } else {
                spaces.push(space);
            }
        }, this));
        this.spaces = spaces.concat(newSpaces);
        this.mergeSpace();
        //this.spaces.sort(function(a, b) {
        //    return a.x - b.x;
        //});
        return ret;
    },

    mergeSpace: function() {
        for (var i = 0; i < this.spaces.length; i++) {
            var spaceA = this.spaces[i];
            for (var j = 0; j < this.spaces.length; j++) {
                var spaceB = this.spaces[j];
                if (i === j || spaceA.index !== spaceB.index) continue;

                var merged = false;
                if (spaceA.x === spaceB.x && spaceA.width === spaceB.width && spaceA.y <= spaceB.y && spaceA.y + spaceA.height >= spaceB.y) {
                    if (spaceA.height < spaceB.y + spaceB.height - spaceA.y) {
                        spaceA.__defineGetter__('height', _.bind(function(spaceA, spaceB) {
                            return spaceB.y + spaceB.height - spaceA.y;
                        }, this, spaceA, spaceB));
                    }
                    merged = true;
                }

                if (spaceA.y === spaceB.y && spaceA.height === spaceB.height && spaceA.x <= spaceB.x && spaceA.x + spaceA.width >= spaceB.x) {
                    if (spaceA.width < spaceB.x + spaceB.width - spaceA.x) {
                        spaceA.__defineGetter__('width', _.bind(function(spaceA, spaceB) {
                            return spaceB.x + spaceB.width - spaceA.x;
                        }, this, spaceA, spaceB));
                    }
                    merged = true;
                }

                if (merged) {
                    this.spaces.splice(j, 1);
                    if (j < i) {
                        i--;
                    }
                    j--;
                }
            }
        }
    },

    splitSpace: function(space, overlap) {
        var ret = [],
            root = this.roots[0];
        if (space.y !== overlap.y) {
            var top = {
                index: space.index,
                id: 'spaceY',
                get height() {
                    return overlap.y - space.y;
                }
            };
            utils.assign(top, space, ['x', 'y', 'width']);
            ret.push(top);
        }
        if (space.x !== overlap.x) {
            var left = {
                index: space.index,
                id: 'spaceX',
                get width() {
                    return overlap.x - space.x;
                }
            };
            utils.assign(left, space, ['x', 'y', 'height']);
            ret.push(left);
        }
        if (space.x + space.width - overlap.x - overlap.width > 0 || space.x + space.width === root.width) {
            var right = {
                index: space.index,
                id: 'spaceR',
                get x() {
                    return overlap.x + overlap.width;
                },
                get width() {
                    return space.x + space.width - overlap.x - overlap.width;
                }
            };
            utils.assign(right, space, ['y', 'height']);
            ret.push(right);
        }
        if (space.y + space.height - overlap.y - overlap.height > 0 || space.y + space.height === root.height) {
            var down = {
                index: space.index,
                id: 'spaceD',
                get y() {
                    return overlap.y + overlap.height;
                },
                get height() {
                    return space.y + space.height - overlap.y - overlap.height;
                }
            };
            utils.assign(down, space, ['x', 'width']);
            ret.push(down);
        }

        return ret;
    },

    growNode: function(width, height) {
        var root = this.roots[0],
            canGrowDown = width <= root.width,
            canGrowRight = height <= root.height,
            shouldGrowRight = root.height >= root.width + width,
            shouldGrowDown = root.width >= root.height + height;

        if (shouldGrowRight) {
            return this.growRight(width, height);
        } else if (shouldGrowDown) {
            return this.growDown(width, height);
        } else if (canGrowRight) {
            return this.growRight(width, height);
        } else if (canGrowDown) {
            return this.growDown(width, height);
        } else {
            console.log('grow');
            return null;
        }
    },

    growRight: function(width, height) {
        this._spaceGroup.right.sort(function(a, b) {
            return a.x - b.x;
        });
        this.roots[0].width += width - this._spaceGroup.right[0].width;
        var node;
        if (node = this.findNode(width, height)) {
            return this.splitNode(node, width, height);
        } else {
            console.log('right');
            return null;
        }
    },

    growDown: function(width, height) {
        this._spaceGroup.down.sort(function(a, b) {
            return a.y - b.y;
        });
        this.roots[0].height += height - this._spaceGroup.down[0].height;
        var node;
        if (node = this.findNode(width, height)) {
            return this.splitNode(node, width, height);
        } else {
            console.log('down');
            return null;
        }
    },

    overlap: function(spaceA, spaceB) {
        var overlapRect = null,
            xa = spaceA.x,
            xb = spaceB.x,
            ya = spaceA.y,
            yb = spaceB.y,
            wa = spaceA.width,
            wb = spaceB.width,
            ha = spaceA.height,
            hb = spaceB.height,
            x1 = Math.max(xa, xb),
            y1 = Math.max(ya, yb),
            x2 = Math.min(xa + wa, xb + wb),
            y2 = Math.min(ya + ha, yb + hb);
        if (x1 < x2 && y1 < y2) {
            overlapRect = {
                width: x2 - x1,
                height: y2 - y1
            };
            utils.assign(overlapRect, xa > xb ? spaceA : spaceB, ['x']);
            utils.assign(overlapRect, ya > yb ? spaceA : spaceB, ['y']);
        }
        return overlapRect;
    }

};

var layout = new FlexLayout();