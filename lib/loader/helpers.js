"use strict";
/**
 * nodejs module helpers
 * https://github.com/nodejs/node/blob/63d4cae009e114127e1a80644e4bffc019e2f4a7/lib/internal/modules/cjs/helpers.js#L50
 */
Object.defineProperty(exports, "__esModule", { value: true });
const CHAR_HASH = 35; /* # */
const CHAR_EXCLAMATION_MARK = 33; /* ! */
const CHAR_LINE_FEED = 10; /* \n */
const CHAR_CARRIAGE_RETURN = 13; /* \r */
/**
 * Remove byte order marker. This catches EF BB BF (the UTF-8 BOM)
 * because the buffer-to-string conversion in `fs.readFileSync()`
 * translates it to FEFF, the UTF-16 BOM.
 */
function stripBOM(content) {
    if (content.charCodeAt(0) === 0xfeff) {
        content = content.slice(1);
    }
    return content;
}
/**
 * Find end of shebang line and slice it off
 */
function stripShebang(content) {
    // Remove shebang
    const contLen = content.length;
    if (contLen >= 2) {
        if (content.charCodeAt(0) === CHAR_HASH &&
            content.charCodeAt(1) === CHAR_EXCLAMATION_MARK) {
            if (contLen === 2) {
                // Exact match
                content = '';
            }
            else {
                // Find end of shebang line and slice it off
                let i = 2;
                for (; i < contLen; ++i) {
                    const code = content.charCodeAt(i);
                    if (code === CHAR_LINE_FEED || code === CHAR_CARRIAGE_RETURN) {
                        break;
                    }
                }
                if (i === contLen) {
                    content = '';
                }
                else {
                    // Note that this actually includes the newline character(s) in the
                    // new output. This duplicates the behavior of the regular expression
                    // that was previously used to replace the shebang line
                    content = content.slice(i);
                }
            }
        }
    }
    return content;
}
/**
 * strip DOM and Shebang
 */
function stripCode(content) {
    return stripShebang(stripBOM(content));
}
exports.stripCode = stripCode;
