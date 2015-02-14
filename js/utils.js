/* jshint node: true, esnext: true */
"use strict";

function uniq(a) {
    return a.sort().filter(function(item, pos) {
        return !pos || item != a[pos - 1];
    });
} //craziness

function assertNumber (n, errorMessage) {
    if (typeof n !== "number") {
        console.log(errorMessage);
    }
}

function assertString (s, errorMsg) {
	if (typeof s !== "string") {
		console.log(errorMsg);
	}
}

function assertDate (d, errorMsg) {
	if (!d instanceof Date) {
		console.log(errorMsg);
	}
}


module.exports.uniq = uniq;
module.exports.assertNumber = assertNumber;
module.exports.assertString = assertString;
module.exports.assertDate = assertDate;
