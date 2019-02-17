"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const log4js_1 = tslib_1.__importDefault(require("log4js"));
const msgpack_lite_1 = tslib_1.__importDefault(require("msgpack-lite"));
const neovim = tslib_1.__importStar(require("neovim"));
const tslib = tslib_1.__importStar(require("tslib"));
exports.default = {
    neovim,
    log4js: log4js_1.default,
    tslib,
    'msgpack-lite': msgpack_lite_1.default
};
