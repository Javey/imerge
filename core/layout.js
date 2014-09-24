var Layout = module.exports = function(blocks, direction) {
    this.blocks = blocks;
    this.direction = direction || 0;
    this.init();
};

Layout.prototype = {
    constructor: Layout,

    init: function() {
        this.sort();
        var blocks = this.blocks,
            length = blocks.length,
            width = length > 0 ? blocks[0].width : 0,
            height = length > 0 ? blocks[0].height : 0;
        this.root = { x: 0, y: 0, width: width, height: height };
        this.width = width;
        this.height = height;
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

    sort: function() {
        this.blocks.sort(function(a, b) {
            var maxA = Math.max(a.width, a.height),
                maxB = Math.max(b.width, b.height);
            return maxB - maxA;
        });
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
