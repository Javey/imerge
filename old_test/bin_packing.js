var wrapper = $('.wrapper');

GrowingPacker = function() { };

GrowingPacker.prototype = {

    fit: function() {
        var blocks = [];
        _.each(_.range(100), function() {
            blocks.push({
                w: _.random(1, 100),
                h: _.random(1, 100)
            });
        });
        this.sort(blocks);
        this._testBlocks = [];
        var n, node, block, len = blocks.length;
        var w = len > 0 ? blocks[0].w : 0;
        var h = len > 0 ? blocks[0].h : 0;
        this.root = { x: 0, y: 0, w: w, h: h };
        for (n = 0; n < len ; n++) {
            this.drawRect(blocks);
            block = blocks[n];
            if (node = this.findNode(this.root, block.w, block.h))
                block.fit = this.splitNode(node, block.w, block.h);
            else
                block.fit = this.growNode(block.w, block.h);
            this._testBlocks.push(block);
        }
    },

    drawRect: function() {
        wrapper.empty();
        wrapper.css({
            width: this.root.w,
            height: this.root.h,
            backgroundColor: '#333'
        });
        _.each(this._testBlocks, _.bind(function(block, i) {
            var div = $('<div class="root"></div>');
            div.css({
                width: block.w,
                height: block.h,
                backgroundColor: 'rgb(' + ((i + 50) * (i + 100) % 255) + ', ' + ((i + 100) * (i + 100) % 255) + ', ' + ((i + 150) * (i + 100) * i % 255) + ')',
                left: block.fit.x,
                top: block.fit.y
            }).appendTo(wrapper);
        }, this));

        var spaces = [];
        var findSpace = function(root) {
            if (root.used) {
                findSpace(root.right);
                findSpace(root.down);
            } else if (root.w && root.h) {
                spaces.push(root);
            }
        };

        findSpace(this.root);

        _.each(spaces, _.bind(function(space) {
            var div = $('<div class="space"></div>');
            var color = _.random(0, 255) + ', ' + _.random(0, 255) + ', ' + _.random(0, 255);
            div.css({
                width: space.w,
                height: space.h,
                borderColor: 'rgb(' + color + ')',
                left: space.x,
                top: space.y
            }).appendTo(wrapper);
        }, this));
    },

    sort: function(blocks) {
        var sort = function(a, b) {
            var maxA = Math.max(a.w, a.h),
                maxB = Math.max(b.w, b.h),
                diffMax = maxB - maxA;

            if (diffMax === 0) {
                var areaA = a.w * a.h,
                    areaB = a.w * a.h;
                return areaB - areaA;
            } else {
                return diffMax;
            }
        };

        blocks.sort(sort);
    },

    findNode: function(root, w, h) {
        if (root.used)
            return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
        else if ((w <= root.w) && (h <= root.h))
            return root;
        else
            return null;
    },

    splitNode: function(node, w, h) {
        node.used = true;
        node.down  = { x: node.x,     y: node.y + h, w: node.w,     h: node.h - h };
        node.right = { x: node.x + w, y: node.y,     w: node.w - w, h: h          };
        return node;
    },

    growNode: function(w, h) {
        var canGrowDown  = (w <= this.root.w);
        var canGrowRight = (h <= this.root.h);

        var shouldGrowRight = canGrowRight && (this.root.h >= (this.root.w + w)); // attempt to keep square-ish by growing right when height is much greater than width
        var shouldGrowDown  = canGrowDown  && (this.root.w >= (this.root.h + h)); // attempt to keep square-ish by growing down  when width  is much greater than height

        if (shouldGrowRight)
            return this.growRight(w, h);
        else if (shouldGrowDown)
            return this.growDown(w, h);
        else if (canGrowRight)
            return this.growRight(w, h);
        else if (canGrowDown)
            return this.growDown(w, h);
        else
            return null; // need to ensure sensible root starting size to avoid this happening
    },

    growRight: function(w, h) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w + w,
            h: this.root.h,
            down: this.root,
            right: { x: this.root.w, y: 0, w: w, h: this.root.h }
        };
        if (node = this.findNode(this.root, w, h))
            return this.splitNode(node, w, h);
        else
            return null;
    },

    growDown: function(w, h) {
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w,
            h: this.root.h + h,
            down:  { x: 0, y: this.root.h, w: this.root.w, h: h },
            right: this.root
        };
        if (node = this.findNode(this.root, w, h))
            return this.splitNode(node, w, h);
        else
            return null;
    }
};

new GrowingPacker().fit();