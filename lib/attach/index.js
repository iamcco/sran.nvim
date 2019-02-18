"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const neovim_1 = require("neovim");
const sran_1 = tslib_1.__importDefault(require("../sran"));
const plugin_1 = tslib_1.__importDefault(require("./plugin"));
function default_1(options) {
    const nvim = neovim_1.attach(options);
    const plugin = new plugin_1.default(nvim);
    sran_1.default(plugin);
    return plugin;
}
exports.default = default_1;
