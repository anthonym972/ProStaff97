'use strict';

module.exports = function (source, map) {
    if (this.cacheable) {
        this.cacheable();
    }

    if (/\bmodule.hot\b/.test(source)) {
        return source;
    }
    else if (/(['"])[^'"]+\.(scss|styl|less)\1/.test(source)) {
        const files = source.match(/(['"])([^'"]+\.scss)\1/g)
        return ''
            + source + "\n"
            + "\n"
            + 'module.hot && module.hot.accept(['+files.join(',')+'])\n'
    }

    return source
};
