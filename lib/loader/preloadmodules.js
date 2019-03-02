"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cheerio_1 = tslib_1.__importDefault(require("cheerio"));
const fast_glob_1 = tslib_1.__importDefault(require("fast-glob"));
const findup_1 = tslib_1.__importDefault(require("findup"));
const log4js_1 = tslib_1.__importDefault(require("log4js"));
const msgpack_lite_1 = tslib_1.__importDefault(require("msgpack-lite"));
const neovim = tslib_1.__importStar(require("neovim"));
const node_fetch_1 = tslib_1.__importDefault(require("node-fetch"));
const rxjs = tslib_1.__importStar(require("rxjs"));
const rxjsOperators = tslib_1.__importStar(require("rxjs/operators"));
const tslib = tslib_1.__importStar(require("tslib"));
const plugin_1 = tslib_1.__importDefault(require("../attach/plugin"));
exports.default = {
    neovim,
    log4js: log4js_1.default,
    tslib,
    findup: findup_1.default,
    rxjs,
    cheerio: cheerio_1.default,
    'rxjs/operators': rxjsOperators,
    'msgpack-lite': msgpack_lite_1.default,
    'fast-glob': fast_glob_1.default,
    'sran.nvim': plugin_1.default,
    'node-fetch': node_fetch_1.default
};
