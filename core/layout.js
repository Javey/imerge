//var _ = require('underscore');
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

var module = {};
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
    this.init();
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
            {width: 154, height:183},
            {width: 125, height:182},
            {width: 180, height:33},
//            {width: 62, height:176},
//            {width: 172, height:156}
        ];
//        var self = this;
//        _.each(_.range(10), function() {
//            self.blocks.push({
//                width: _.random(1, 200),
//                height: _.random(1, 200)
//            })
//        });
        this.sort();
        this.resetFirstRoot();
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
        console.log(this.blocks, this.roots);
    },

    fit: function() {
        _.each(this.blocks, _.bind(function(block) {
            var node;
            if (node = this.findNode(this.roots, block.width, block.height)) {
                block.fit = this.splitNode(node, block.width, block.height);
            } else {
                block.fit = this.growNode(block.width, block.height);
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

    findNode: function(roots, width, height) {
        roots = [roots[0]];
        var find = function(root, width, height) {
            if (root.used) {
                return find(root.right, width, height) || find(root.down, width, height);
            } else if (width <= root.width && height <= root.height) {
                return root;
            } else {
                return null;
            }
        };
        var ret;
        _.find(roots, function(root) {
            ret = find(root, width, height);
            return ret;
        });
        return ret;
    },

    splitNode: function(node, width, height) {
        node.used = true;
        node.down = {
            index: node.index,
            get x() {
                return node.x;
            },
            get y() {
                return node.y + width;
            },
            get width() {
                return node.width;
            },
            get height() {
                return node.height - height;
            }
        };
        node.right = {
            index: node.index,
            get x() {
                return node.x + width;
            },
            get y() {
                return node.y;
            },
            get width() {
                return node.width - width;
            },
            get height() {
                return height;
            }
        };
        return node;
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
            return null;
        }
    },

    growRight: function(width, height) {
//        this.roots[0].width += width;
        var root = utils.extend({}, this.roots[0]),
            rootWidth = root.width;
        root.width += width;
        this.roots[0] = {
            index: root.index,
            used: true,
            get x() {
                return root.x;
            },
            get y() {
                return root.y;
            },
            get width() {
                return root.width;
            },
            set width(value) {
                root.width = value;
            },
            get height() {
                return root.height;
            },
            set height(value) {
                root.height = value;
            },
            down: root,
            right: {
                index: root.index,
                get x() {
                    return root.x + rootWidth;
                },
                get y() {
                    return root.y;
                },
                get width() {
                    return width;
                },
                get height() {
                    return root.height;
                }
            }
        };
        var node;
        if (node = this.findNode([this.roots[0]], width, height)) {
            return this.splitNode(node, width, height);
        } else {
            return null;
        }
    },

    growDown: function(width, height) {
        var root = utils.extend({}, this.roots[0]),
            rootHeight = root.height;
        root.height += height;
        this.roots[0] = {
            index: root.index,
            used: true,
            get x() {
                return root.x;
            },
            get y() {
                return root.y;
            },
            get width() {
                return root.width;
            },
            set width(value) {
                root.width = value;
            },
            get height() {
                return root.height;
            },
            set height(value) {
                root.height = value;
            },
            down: {
                index: root.index,
                test: root.y + rootHeight,
                get x() {
                    return root.x;
                },
                get y() {
                    return root.y + rootHeight;
                },
                get width() {
                    return root.width;
                },
                get height() {
                    return height;
                }
            },
            right: root
        };
        var node;
        if (node = this.findNode([this.roots[0]], width, height)) {
            console.log(node, node.y);
            return this.splitNode(node, width, height);
        } else {
            return null;
        }
    }

};

var Layout = module.exports = function(blocks, direction) {
    this.blocks = [];
    var self = this;
    _.each(_.range(10), function() {
        self.blocks.push({
            width: _.random(1, 200),
            height: _.random(1, 200)
        })
    });
    this.init();
};

Layout.prototype = {
    constructor: Layout,

    init: function() {
        this.blocks.sort(function(a, b) {
            var maxA = Math.max(a.width, a.height),
                maxB = Math.max(b.width, b.height);
            return maxB - maxA;
        });
        var blocks = this.blocks,
            length = blocks.length,
            width = length > 0 ? blocks[0].width : 0,
            height = length > 0 ? blocks[0].height : 0;
        this.root = { x: 0, y: 0, width: width, height: height };
        this.roots = [this.root];
        for (var i = 0; i < length; i++) {
            var block = blocks[i],
                node;
            if (node = this.findNode(this.root, block.width, block.height)) {
                block.fit = this.splitNode(node, block.width, block.height);
            } else {
                block.fit = this.growNode(block.width, block.height);
            }
        }
    },

    init2: function() {
        this.sort();
//        this.root = {x: 0, y: 0, width: ret.width, height: ret.height};

    },

    init3: function() {
        new FlexLayout(this.blocks);
    },

    sort: function() {
        var groups = {};
        this.blocks.forEach(function(block) {
            var float = block.float;
            if (!groups[float]) {
                groups[float] = [];
            }
            groups[float].push(block);
        });
        var maxLeft = _.max(groups.left, function(block) {
                return block.width;
            }),
            maxRight = _.max(groups.right, function(block) {
                return block.width;
            }),
            maxTop = _.max(groups.top, function(block) {
                return block.height;
            }),
            maxBottom = _.max(groups.bottom, function(block) {
                return block.height;
            }),

            reduceTopWidth = _.reduce(groups.top, function(meno, block) {
                return meno + block.width;
            }, 0),
            reduceBottomWidth = _.reduce(groups.bottom, function(meno, block) {
                return meno + block.width;
            }, 0),
            reduceLeftHeight = _.reduce(groups.left, function(meno, block) {
                return meno + block.height;
            }, 0),
            reduceRightHeight = _.reduce(groups.right, function(meno, block) {
                return meno + block.height;
            }, 0);

        this.root = this.resizeRoot({
            maxLeftWidth: maxLeft.width,
            maxRightWidth: maxRight.width,
            maxTopHeight: maxTop.height,
            maxBottomHeight: maxBottom.height,
            reduceTopWidth: reduceTopWidth,
            reduceBottomWidth: reduceBottomWidth,
            reduceLeftHeight: reduceLeftHeight,
            reduceRightHeight: reduceRightHeight
        });

        var self = this;
        _.each(groups, function(value, key) {
            if (key !== 'none') {
                new FixedLayout(value, self.root[key], (key === 'left' || key === 'right') ? 'vertical' : 'horizontal');
            }
        });

    },

    resizeRoot: function(data) {
        var maxLeftWidth = data.maxLeftWidth,
            maxRightWidth = data.maxRightWidth,
            maxTopHeight = data.maxTopHeight,
            maxBottomHeight = data.maxBottomHeight,
            reduceTopWidth = data.reduceTopWidth,
            reduceBottomWidth = data.reduceBottomWidth,
            reduceLeftHeight = data.reduceLeftHeight,
            reduceRightHeight = data.reduceRightHeight,
            reduceWidth = reduceTopWidth + reduceBottomWidth,
            reduceHeight = reduceLeftHeight + reduceRightHeight,
            width = maxLeftWidth + maxRightWidth + reduceWidth,
            height = maxTopHeight + maxBottomHeight + reduceHeight;

        return {
            x: 0,
            y: 0,
            width: width,
            height: height,
            leftTop: {
                x: 0,
                y: 0,
                width: maxLeftWidth,
                height: maxTopHeight
            },
            top: {
                x: maxLeftWidth,
                y: 0,
                width: reduceTopWidth,
                height: maxTopHeight
            },
            rightTop: {
                x: maxLeftWidth + reduceWidth,
                y: 0,
                width: maxRightWidth,
                height: maxTopHeight
            },
            left: {
                x: 0,
                y: maxTopHeight,
                width: maxLeftWidth,
                height: reduceLeftHeight
            },
            right: {
                x: maxLeftWidth + reduceWidth,
                y: maxTopHeight + reduceLeftHeight,
                width: maxRightWidth,
                height: reduceRightHeight
            },
            leftBottom: {
                x: 0,
                y: maxTopHeight + reduceHeight,
                width: maxLeftWidth,
                height: maxBottomHeight
            },
            bottom: {
                x: maxLeftWidth + reduceTopWidth,
                y: maxTopHeight + reduceHeight,
                width: reduceBottomWidth,
                height: maxBottomHeight
            },
            rightBottom: {
                x: maxLeftWidth + reduceWidth,
                y: maxTopHeight + reduceHeight,
                width: maxRightWidth,
                height: maxBottomHeight
            }
        };
    },

    findNode: function(root, width, height) {
        if (root.used) {
            return this.findNode(root.right, width, height) || this.findNode(root.down, width, height);
        } else if (width <= root.width && height <= root.height) {
            return root;
        } else {
            return null;
        }
    },

    splitNode: function(node, width, height) {
        node.used = true;
        node.down = {x: node.x, y: node.y + height, width: node.width, height: node.height - height};
        node.right = {x: node.x + width, y: node.y, width: node.width - width, height: height};
        return node;
    },

    growNode: function(width, height) {
        var root = this.root,
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
            return null;
        }
    },

    growRight: function(width, height) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            width: this.root.width + width,
            height: this.root.height,
            down: this.root,
            right: {
                x: this.root.width,
                y: 0,
                width: width,
                height: this.root.height
            }
        };
        var node;
        if (node = this.findNode(this.root, width, height)) {
            return this.splitNode(node, width, height);
        } else {
            return null;
        }
    },

    growDown: function(width, height) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            width: this.root.width,
            height: this.root.height + height,
            down: {
                x: 0,
                y: this.root.height,
                width: this.root.width,
                height: height
            },
            right: this.root
        };
        var node;
        if (node = this.findNode(this.root, width, height)) {
            return this.splitNode(node, width, height);
        } else {
            return null;
        }
    }
};
