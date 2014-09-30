var _ = require('lodash');
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
    }
};

//var module = {};
//var FixedLayout = function(blocks, root, direction) {
//    this.bocks = blocks;
//    this.root = root;
//    this.direction = direction === 'horizontal' ? 'right' : 'down';
//    this.init();
//};
//
//FixedLayout.prototype = {
//    constructor: FixedLayout,
//
//    init: function() {
//        var node,
//            self = this;
//        _.each(this.bocks, function(block) {
//            if (node = self.findNode(self.root, block.width, block.height)) {
//                block.fit = self.splitNode(node, block.width, block.height);
//            }
//        });
//    },
//
//    findNode: function(root, width, height) {
//        if (root.used) {
//            return this.findNode(root[this.direction], width, height);
//        } else if (width <= root.width && height <= root.height) {
//            return root;
//        } else {
//            return null;
//        }
//    },
//
//    splitNode: function(node, width, height) {
//        node.used = true;
//        node.down = {
//            x: node.x,
//            y: node.y + height,
//            width: node.width,
//            height: node.height - height
//        };
//        node.right = {
//            x: node.x + width,
//            y: node.y,
//            width: node.width - width,
//            height: height
//        };
//        return node;
//    }
//};

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
    this.quadrant = {
        first: {
            border: 100
        },
        second: {
            border: 200
        },
        third: {
            border: 200
        },
        fourth: {
            border: 50
        }
    };
    //console.log('123123')
    if (!blocks) {
        //console.log('123123')
        this.init();
    }
};

FlexLayout.prototype = {
    constructor: FlexLayout,

    getQuadrant: function(type) {
        var quadrant = ['first', 'second', 'third', 'fourth'],
            index = quadrant.indexOf(type),
            preIndex = index - 1 < 0 ? 3 : index - 1,

            border1 = this.quadrant[type].border,
            border2 = this.quadrant[quadrant[preIndex]].border,

            isEven = (index + 1) % 2 === 0;

        if (isEven) {
            return {
                index: index,
                x: 0,
                y: 0,
                width: border1,
                height: border2
            }
        } else {
            return {
                index: index,
                x: 0,
                y: 0,
                width: border2,
                height: border1
            }
        }
    },

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
            get x() {
                return space.x;
            },
            get y() {
                return space.y;
            },
            width: width,
            height: height
        };

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
                get x() {
                    return space.x;
                },
                get y() {
                    return space.y;
                },
                get width() {
                    return space.width;
                },
                get height() {
                    return overlap.y - space.y;
                }
            });
        }
        if (space.x !== overlap.x) {
            ret.push({
                index: space.index,
                get x() {
                    return space.x;
                },
                get y() {
                    return space.y;
                },
                get width() {
                    return overlap.x - space.x;
                },
                get height() {
                    return space.height;
                }
            });
        }
        ret.push(
            {
                index: space.index,
                get x() {
                    return space.x;
                },
                get y() {
                    return overlap.y + overlap.height;
                },
                get width() {
                    return space.width;
                },
                get height() {
                    return space.y + space.height - overlap.y - overlap.height;
                }
            },
            {
                index: space.index,
                get x() {
                    return overlap.x + overlap.width;
                },
                get y() {
                    return space.y;
                },
                get width() {
                    return space.x + space.width - overlap.x - overlap.width;
                },
                get height() {
                    return space.height;
                }
            }
        );
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

//var Layout = module.exports = function(blocks, direction) {
//    this.blocks = [];
//    var self = this;
//    _.each(_.range(10), function() {
//        self.blocks.push({
//            width: _.random(1, 200),
//            height: _.random(1, 200)
//        })
//    });
//    this.init();
//};
//
//Layout.prototype = {
//    constructor: Layout,
//
//    init: function() {
//        this.blocks.sort(function(a, b) {
//            var maxA = Math.max(a.width, a.height),
//                maxB = Math.max(b.width, b.height);
//            return maxB - maxA;
//        });
//        var blocks = this.blocks,
//            length = blocks.length,
//            width = length > 0 ? blocks[0].width : 0,
//            height = length > 0 ? blocks[0].height : 0;
//        this.root = { x: 0, y: 0, width: width, height: height };
//        this.roots = [this.root];
//        for (var i = 0; i < length; i++) {
//            var block = blocks[i],
//                node;
//            if (node = this.findNode(this.root, block.width, block.height)) {
//                block.fit = this.splitNode(node, block.width, block.height);
//            } else {
//                block.fit = this.growNode(block.width, block.height);
//            }
//        }
//    },
//
//    init2: function() {
//        this.sort();
////        this.root = {x: 0, y: 0, width: ret.width, height: ret.height};
//
//    },
//
//    init3: function() {
//        new FlexLayout(this.blocks);
//    },
//
//    sort: function() {
//        var groups = {};
//        this.blocks.forEach(function(block) {
//            var float = block.float;
//            if (!groups[float]) {
//                groups[float] = [];
//            }
//            groups[float].push(block);
//        });
//        var maxLeft = _.max(groups.left, function(block) {
//                return block.width;
//            }),
//            maxRight = _.max(groups.right, function(block) {
//                return block.width;
//            }),
//            maxTop = _.max(groups.top, function(block) {
//                return block.height;
//            }),
//            maxBottom = _.max(groups.bottom, function(block) {
//                return block.height;
//            }),
//
//            reduceTopWidth = _.reduce(groups.top, function(meno, block) {
//                return meno + block.width;
//            }, 0),
//            reduceBottomWidth = _.reduce(groups.bottom, function(meno, block) {
//                return meno + block.width;
//            }, 0),
//            reduceLeftHeight = _.reduce(groups.left, function(meno, block) {
//                return meno + block.height;
//            }, 0),
//            reduceRightHeight = _.reduce(groups.right, function(meno, block) {
//                return meno + block.height;
//            }, 0);
//
//        this.root = this.resizeRoot({
//            maxLeftWidth: maxLeft.width,
//            maxRightWidth: maxRight.width,
//            maxTopHeight: maxTop.height,
//            maxBottomHeight: maxBottom.height,
//            reduceTopWidth: reduceTopWidth,
//            reduceBottomWidth: reduceBottomWidth,
//            reduceLeftHeight: reduceLeftHeight,
//            reduceRightHeight: reduceRightHeight
//        });
//
//        var self = this;
//        _.each(groups, function(value, key) {
//            if (key !== 'none') {
//                new FixedLayout(value, self.root[key], (key === 'left' || key === 'right') ? 'vertical' : 'horizontal');
//            }
//        });
//
//    },
//
//    resizeRoot: function(data) {
//        var maxLeftWidth = data.maxLeftWidth,
//            maxRightWidth = data.maxRightWidth,
//            maxTopHeight = data.maxTopHeight,
//            maxBottomHeight = data.maxBottomHeight,
//            reduceTopWidth = data.reduceTopWidth,
//            reduceBottomWidth = data.reduceBottomWidth,
//            reduceLeftHeight = data.reduceLeftHeight,
//            reduceRightHeight = data.reduceRightHeight,
//            reduceWidth = reduceTopWidth + reduceBottomWidth,
//            reduceHeight = reduceLeftHeight + reduceRightHeight,
//            width = maxLeftWidth + maxRightWidth + reduceWidth,
//            height = maxTopHeight + maxBottomHeight + reduceHeight;
//
//        return {
//            x: 0,
//            y: 0,
//            width: width,
//            height: height,
//            leftTop: {
//                x: 0,
//                y: 0,
//                width: maxLeftWidth,
//                height: maxTopHeight
//            },
//            top: {
//                x: maxLeftWidth,
//                y: 0,
//                width: reduceTopWidth,
//                height: maxTopHeight
//            },
//            rightTop: {
//                x: maxLeftWidth + reduceWidth,
//                y: 0,
//                width: maxRightWidth,
//                height: maxTopHeight
//            },
//            left: {
//                x: 0,
//                y: maxTopHeight,
//                width: maxLeftWidth,
//                height: reduceLeftHeight
//            },
//            right: {
//                x: maxLeftWidth + reduceWidth,
//                y: maxTopHeight + reduceLeftHeight,
//                width: maxRightWidth,
//                height: reduceRightHeight
//            },
//            leftBottom: {
//                x: 0,
//                y: maxTopHeight + reduceHeight,
//                width: maxLeftWidth,
//                height: maxBottomHeight
//            },
//            bottom: {
//                x: maxLeftWidth + reduceTopWidth,
//                y: maxTopHeight + reduceHeight,
//                width: reduceBottomWidth,
//                height: maxBottomHeight
//            },
//            rightBottom: {
//                x: maxLeftWidth + reduceWidth,
//                y: maxTopHeight + reduceHeight,
//                width: maxRightWidth,
//                height: maxBottomHeight
//            }
//        };
//    },
//
//    findNode: function(root, width, height) {
//        if (root.used) {
//            return this.findNode(root.right, width, height) || this.findNode(root.down, width, height);
//        } else if (width <= root.width && height <= root.height) {
//            return root;
//        } else {
//            return null;
//        }
//    },
//
//    splitNode: function(node, width, height) {
//        node.used = true;
//        node.down = {x: node.x, y: node.y + height, width: node.width, height: node.height - height};
//        node.right = {x: node.x + width, y: node.y, width: node.width - width, height: height};
//        return node;
//    },
//
//    growNode: function(width, height) {
//        var root = this.root,
//            canGrowDown = width <= root.width,
//            canGrowRight = height <= root.height,
//            shouldGrowRight = canGrowRight && root.height >= root.width + width,
//            shouldGrowDown = canGrowDown && root.width >= root.height + height;
//
//        if (shouldGrowRight) {
//            return this.growRight(width, height);
//        } else if (shouldGrowDown) {
//            return this.growDown(width, height);
//        } else if (canGrowRight) {
//            return this.growRight(width, height);
//        } else if (canGrowDown) {
//            return this.growDown(width, height);
//        } else {
//            return null;
//        }
//    },
//
//    growRight: function(width, height) {
//        this.root = {
//            used: true,
//            x: 0,
//            y: 0,
//            width: this.root.width + width,
//            height: this.root.height,
//            down: this.root,
//            right: {
//                x: this.root.width,
//                y: 0,
//                width: width,
//                height: this.root.height
//            }
//        };
//        var node;
//        if (node = this.findNode(this.root, width, height)) {
//            return this.splitNode(node, width, height);
//        } else {
//            return null;
//        }
//    },
//
//    growDown: function(width, height) {
//        this.root = {
//            used: true,
//            x: 0,
//            y: 0,
//            width: this.root.width,
//            height: this.root.height + height,
//            down: {
//                x: 0,
//                y: this.root.height,
//                width: this.root.width,
//                height: height
//            },
//            right: this.root
//        };
//        var node;
//        if (node = this.findNode(this.root, width, height)) {
//            return this.splitNode(node, width, height);
//        } else {
//            return null;
//        }
//    }
//};
