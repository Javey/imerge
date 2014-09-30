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
//            {width: 123, height:34},
//            {width: 142, height:12},
//
//            {"width":191,"height":143},
//            {"width":154,"height":183},
//            {"width":125,"height":182},
//            {"width":180,"height":33},{"width":180,"height":43},{"width":62,"height":176}
        ];
        //this.blocks = [{"width":58,"height":100,"fit":{"index":0,"x":0,"y":0,"width":58,"height":100}},{"width":33,"height":100,"fit":{"index":1,"x":500,"y":0,"width":33,"height":100}},{"width":85,"height":100,"fit":{"index":3,"x":0,"y":478,"width":85,"height":100}},{"width":65,"height":99,"fit":{"index":0,"x":58,"y":0,"width":65,"height":99}},{"width":4,"height":99,"fit":{"index":2,"x":500,"y":478,"width":4,"height":99}},{"width":85,"height":98,"fit":{"index":3,"x":85,"y":478,"width":85,"height":98}},{"width":97,"height":91,"fit":{"index":0,"x":123,"y":0,"width":97,"height":91}},{"width":97,"height":3,"fit":{"index":0,"x":123,"y":91,"width":97,"height":3}},{"width":96,"height":35,"fit":{"index":0,"x":0,"y":100,"width":96,"height":35}},{"width":20,"height":96,"fit":{"index":2,"x":504,"y":478,"width":20,"height":96}}];
        var self = this;
        _.each(_.range(100), function() {
            self.blocks.push({
                width: _.random(1, 100),
                height: _.random(1, 100)
            })
        });
        this.sort();
        this.resetFirstRoot();
        this.spaces = [this.roots[0], this.roots[1], this.roots[2], this.roots[3]];
        //this.spaces = [this.roots[0]];
        this.fit();
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
        _.each(this.blocks, _.bind(function(block) {
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
        var spaces = this.spaces,
            self = this;
        var find = function(space, width, height, index) {
            if (width <= space.width && height <= space.height) {
                self.spaces.splice(index, 1);
                return space;
            } else {
                return null;
            }
        };
        var ret = null;
        _.find(spaces, function(space, index) {
            ret = find(space, width, height, index);
            return ret;
        });
        return ret;
    },

    splitNode: function(space, width, height) {
        var ret =  {
            index: space.index,
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
                        spaceA.__defineGetter__('height', _.bind(function(spaceA, spaceB) {
                            return spaceB.y + spaceB.height - spaceA.y;
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
        var ret = [];
        if (space.y !== overlap.y) {
            ret.push({
                index: space.index,
                get height() {
                    return overlap.y - space.y;
                }
            });
            utils.assign(ret, space, ['x', 'y', 'width']);
        }
        if (space.x !== overlap.x) {
            ret.push({
                index: space.index,
                get width() {
                    return overlap.x - space.x;
                }
            });
            utils.assign(ret, space, ['x', 'y', 'height']);
        }
        var down = {
                index: space.index,
                get y() {
                    return overlap.y + overlap.height;
                },
                get height() {
                    return space.y + space.height - overlap.y - overlap.height;
                }
            },
            right = {
                index: space.index,
                get x() {
                    return overlap.x + overlap.width;
                },
                get width() {
                    return space.x + space.width - overlap.x - overlap.width;
                }
            };
        utils.assign(down, space, ['x', 'width']);
        utils.assign(right, space, ['y', 'height']);
        ret.push(down, right);
        return ret;
    },

    growNode: function(width, height) {
        var root = this.roots[0],
            canGrowDown = width <= root.width,
            canGrowRight = height <= root.height,
            shouldGrowRight = canGrowRight && root.height >= root.width + width,
            shouldGrowDown = canGrowDown && root.width >= root.height + height;

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
        this.roots[0].width += width;
        var node;
        if (node = this.findNode(width, height)) {
            return this.splitNode(node, width, height);
        } else {
            console.log('right');
            return null;
        }
    },

    growDown: function(width, height) {
        this.roots[0].height += height;
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
            overlapRect.__defineGetter__('x', (function() {
                return xa > xb ? function() {
                    return spaceA.x;
                } : function() {
                    return spaceB.x;
                }
            }()));
            overlapRect.__defineGetter__('y', (function() {
                return ya > yb ? function() {
                    return spaceA.y;
                } : function() {
                    return spaceB.y;
                }
            }()));
        }
        return overlapRect;
    }

};