// Browser info
const userAgent = navigator.userAgent,
    platform = navigator.platform

/**
 * Test a regex with the user agent
 * @param {RegExp|String} regex 
 * @returns {String}
 */
function match(regex) {
    return userAgent.search(regex) !== -1;
}

// Is
const IS = {
        osx: ['Mac68K', 'MacPPC', 'MacIntel'].indexOf(platform) !== -1,
        ie: match('MSIE'),
        ie7: match('MSIE 7.0'),
        ie8: match('MSIE 8.0'),
        ie9: match('MSIE 9.0'),
        ie10: match('MSIE 10.'),
        safari: match('Safari') && !match('Chrome'),
        ios: match(/(iPhone|iPad|iPod)/),
        android: match('Android'),
        windowsPhone: match('IEMobile'),
        tablet: match(/iPad/i) || (match(/Android/i) && !match(/Mobile/i))
    }

// Ie
IS.ltie9 = IS.ie8 || IS.ie7
IS.lteie9 = IS.ie9 || IS.ltie9

// Devices
IS.mobile = (IS.ios || IS.android || IS.windowsPhone) && !IS.tablet
IS.desktop = !IS.mobile && !IS.tablet

export default IS