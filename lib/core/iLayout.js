var _ = require('lodash');

var objDefine = Object.defineProperty,
    objGetOwn = Object.getOwnPropertyDescriptor,
    arrSlice = Array.prototype.slice;

function assign(obj, source, keys) {
    keys = _.isString(keys) ? [keys] : keys;
    for (var i = 0, l = keys.length; i < l; i++) {
        var key = keys[i];
        objDefine(obj, key, objGetOwn(source, key));
    }
}

function extend(obj) {
    _.each(arrSlice.call(arguments, 1), function(source) {
        if (source) {
            for (var prop in source) {
                objDefine(obj, prop, objGetOwn(source, prop));
            }
        }
    });
    return obj;
}

var Layout = module.exports = function(blocks) {
    this.blocks = blocks;
    this.init();
};

Layout.prototype = {
    constructor: Layout,

    init: function() {
        this.groupByFloat();
        this.createRoot();
        var root = this.root;
        _.each(this.group, function(value, key) {
            if (key === 'none') {
                new FlexLayout(value, [root.leftTop, root.rightTop, root.leftBottom, root.rightBottom]);
            } else if (~['left', 'right', 'top', 'bottom'].indexOf(key)) {
                new FixedLayout(value, root[key], key);
            } else {
                throw new Error('"' + key + '" is not supported. File:"' + value.file + '"');
            }
        });
    },

    groupByFloat: function() {
        var group = this.group = {};
        this.blocks.forEach(function(block) {
            var float = block.float;
            if (!group[float]) {
                group[float] = [];
            }
            group[float].push(block);
        });
        this.border = {
            maxLeftWidth: group.left ? _.max(group.left, function(block) {
                return block.width;
            }).width : 0,
            maxRightWidth: group.right ? _.max(group.right, function(block) {
                return block.width;
            }).width : 0,
            maxTopHeight: group.top ? _.max(group.top, function(block) {
                return block.height;
            }).height : 0,
            maxBottomHeight: group.bottom ? _.max(group.bottom, function(block) {
                return block.height;
            }).height : 0,
            totalTopWidth: _.reduce(group.top, function(meno, block) {
                return meno + block.width;
            }, 0),
            totalBottomWidth: _.reduce(group.bottom, function(meno, block) {
                return meno + block.width;
            }, 0),
            totalLeftHeight: _.reduce(group.left, function(meno, block) {
                return meno + block.height;
            }, 0),
            totalRightHeight: _.reduce(group.right, function(meno, block) {
                return meno + block.height;
            }, 0)
        };
    },

    createRoot: function() {
        var border = this.border,
            totalWidth = border.totalTopWidth + border.totalBottomWidth,
            totalHeight = border.totalLeftHeight + border.totalRightHeight;
        this.root = {
            x: 0,
            y: 0,
            get width() {
                return border.maxLeftWidth + border.maxRightWidth + totalWidth;
            },
            get height() {
                return border.maxTopHeight + border.maxBottomHeight + totalHeight;
            },
            leftTop: {
                index: 0,
                x: 0,
                y: 0,
                get width() {
                    return border.maxLeftWidth;
                },
                set width(width) {
                    border.maxLeftWidth = width;
                },
                get height() {
                    return border.maxTopHeight;
                },
                set height(height) {
                    border.maxTopHeight = height;
                }
            },
            top: {
                index: 1,
                get x() {
                    return border.maxLeftWidth;
                },
                y: 0,
                width: border.totalTopWidth,
                get height() {
                    return border.maxTopHeight;
                }
            },
            rightTop: {
                index: 2,
                get x() {
                    return border.maxLeftWidth + totalWidth;
                },
                y: 0,
                get width() {
                    return border.maxRightWidth;
                },
                set width(width) {
                    border.maxRightWidth = width;
                },
                get height() {
                    return border.maxTopHeight;
                },
                set height(height) {
                    border.maxTopHeight = height;
                }
            },
            left: {
                index: 3,
                x: 0,
                get y() {
                    return border.maxTopHeight;
                },
                get width() {
                    return border.maxLeftWidth;
                },
                height: border.totalLeftHeight
            },
            right: {
                index: 4,
                get x() {
                    return border.maxLeftWidth + totalWidth;
                },
                get y() {
                    return border.maxTopHeight + border.totalLeftHeight;
                },
                get width() {
                    return border.maxRightWidth;
                },
                height: border.totalRightHeight
            },
            leftBottom: {
                index: 5,
                x: 0,
                get y() {
                    return border.maxTopHeight + totalHeight;
                },
                get width() {
                    return border.maxLeftWidth;
                },
                set width(width) {
                    border.maxLeftWidth = width;
                },
                get height() {
                    return border.maxBottomHeight;
                },
                set height(height) {
                    border.maxBottomHeight = height;
                }
            },
            bottom: {
                index: 6,
                get x() {
                    return border.maxLeftWidth + border.totalTopWidth;
                },
                get y() {
                    return border.maxTopHeight + totalHeight;
                },
                width: border.totalBottomWidth,
                get height() {
                    return border.maxBottomHeight;
                }
            },
            rightBottom: {
                index: 7,
                get x() {
                    return border.maxLeftWidth + totalWidth;
                },
                get y() {
                    return border.maxTopHeight + totalHeight;
                },
                get width() {
                    return border.maxRightWidth;
                },
                set width(width) {
                    border.maxRightWidth = width;
                },
                get height() {
                    return border.maxBottomHeight;
                },
                set height(height) {
                    border.maxBottomHeight = height;
                }
            }
        };
    }
};

var FixedLayout = function(blocks, root, position) {
    this.blocks = blocks;
    this.root = root;
    this.position = position;
    this.direction = (position === 'left' || position === 'right') ? 'down' : 'right';
    this.init();
};

FixedLayout.prototype = {
    construnctor: FixedLayout,

    init: function() {
        var node;
        _.each(this.blocks, _.bind(function(block) {
            if (node = this.findNode(this.root, block.width, block.height)) {
                var fit = block.fit = this.splitNode(node, block.width, block.height);
                var _fit = {};
                if (this.position === 'right') {
                    extend(_fit, fit);
                    _fit.__defineGetter__('x', _.bind(function() {
                        return fit.x + fit.width - block.width;
                    }, this));
                    block.fit = _fit;
                } else if (this.position === 'bottom') {
                    extend(_fit, fit);
                    _fit.__defineGetter__('y', _.bind(function() {
                        return fit.y + fit.height - block.height;
                    }, this));
                    block.fit = _fit;
                }
            }
        }, this));
    },

    findNode: function(root, width, height) {
        if (root.used) {
            return this.findNode(root[this.direction], width, height);
        } else if (width <= root.width && height <= root.height) {
            return root;
        } else {
            return null;
        }
    },

    splitNode: function(node, width, height) {
        node.used = true;
        node.down = {
            get y() {
                return node.y + height;
            },
            get height() {
                return node.height - height;
            }
        };
        assign(node.down, node, ['x', 'width']);
        node.right = {
            get x() {
                return node.x + width;
            },
            get width() {
                return node.width - width;
            }
        };
        assign(node.right, node, ['y', 'height']);
        return node;
    }
};

var FlexLayout = function(blocks, roots) {
    this.blocks = blocks;
    this.roots = roots;
    this.init();
};

FlexLayout.prototype = {
    constructor: FlexLayout,

    init: function() {
        this._spaceGroup = {right: [], down: []};
        this.sort();
        this.resetFirstRoot();
        this.spaces = arrSlice.call(this.roots, 0);
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

    fit: function() {
        _.each(this.blocks, _.bind(function(block) {
            var node;
            if (node = this.findNode(block.width, block.height)) {
                block.fit = this.splitNode(node, block.width, block.height);
            } else {
                block.fit = this.growNode(block.width, block.height);
            }
        }, this));
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

            if (width <= space.width && space.y - root.y + space.height === root.height) {
                down.push(space);
            } else if (height <= space.height && space.x - root.x + space.width === root.width) {
                right.push(space);
            }

            return null;
        }, this));
    },

    splitNode: function(space, width, height) {
        var ret =  {
            index: space.index,
            width: width,
            height: height
        };
        assign(ret, space, ['x', 'y']);

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
        this._spaceGroup.right.sort(function(a, b) {
            return a.x - b.x;
        });
        this.roots[0].width += width - this._spaceGroup.right[0].width;
        var node;
        if (node = this.findNode(width, height)) {
            return this.splitNode(node, width, height);
        } else {
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
            return null;
        }
    },

    splitSpace: function(space, overlap) {
        var ret = [],
            root = this.roots[0];

        if (space.y !== overlap.y) {
            var top = {
                index: space.index,
                get height() {
                    return overlap.y - space.y;
                }
            };
            assign(top, space, ['x', 'y', 'width']);
            ret.push(top);
        }
        if (space.x !== overlap.x) {
            var left = {
                index: space.index,
                get width() {
                    return overlap.x - space.x;
                }
            };
            assign(left, space, ['x', 'y', 'height']);
            ret.push(left);
        }
        if (space.x + space.width - overlap.x - overlap.width > 0 || space.x - root.x + space.width === root.width) {
            var right = {
                index: space.index,
                get x() {
                    return overlap.x + overlap.width;
                },
                get width() {
                    return space.x + space.width - overlap.x - overlap.width;
                }
            };
            assign(right, space, ['y', 'height']);
            ret.push(right);
        }
        if (space.y + space.height - overlap.y - overlap.height > 0 || space.y - root.y + space.height === root.height) {
            var down = {
                index: space.index,
                get y() {
                    return overlap.y + overlap.height;
                },
                get height() {
                    return space.y + space.height - overlap.y - overlap.height;
                }
            };
            assign(down, space, ['x', 'width']);
            ret.push(down);
        }

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
            assign(overlapRect, xa > xb ? spaceA : spaceB, ['x']);
            assign(overlapRect, ya > yb ? spaceA : spaceB, ['y']);
        }

        return overlapRect;
    }
};
