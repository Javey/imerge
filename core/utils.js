var _= require('lodash');

module.exports = {
    defaults: {
        'padding-top': 0,
        'padding-right': 0,
        'padding-bottom': 0,
        'padding-left': 0,
        'float': 'none',
        'repeat': 'none'
    },

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