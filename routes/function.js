function getHash(str) {
    var hash = 0, i, chr;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

function getImagePath(key) {
    console.log(key);
    var hash = getHash(key) + 123;

    var datetime = new Date();
    var str = `${datetime.getFullYear()}${datetime.getMonth()}${datetime.getDay()}${datetime.getHours()}${datetime.getMinutes()}${datetime.getSeconds()}${datetime.getMilliseconds()}`;

    var result = '';
    var characters = 'abcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < str.length; i++) {
        result += characters.charAt(((str.charCodeAt(i) - 48) * hash) % characters.length)
        result += characters.charAt(Math.floor(Math.random() * characters.length))
    }

    return result;
}

var functions = {
    getImagePath: getImagePath
};

module.exports = functions;