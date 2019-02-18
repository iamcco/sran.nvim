"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const getIP_1 = tslib_1.__importDefault(require("../util/getIP"));
const logger_1 = tslib_1.__importDefault(require("../util/logger"));
const opener_1 = tslib_1.__importDefault(require("../util/opener"));
class Plugin {
    constructor(nvim) {
        this.util = {
            getIP: getIP_1.default,
            opener: opener_1.default,
            getLogger: logger_1.default
        };
        this.nvim = nvim;
    }
}
exports.default = Plugin;
