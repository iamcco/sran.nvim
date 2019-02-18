import fastGlob from 'fast-glob';
import log4js from 'log4js';
import * as neovim from 'neovim';
import * as tslib from 'tslib';
import Plugin from '../attach/plugin';
declare const _default: {
    neovim: typeof neovim;
    log4js: typeof log4js;
    tslib: typeof tslib;
    'msgpack-lite': any;
    'fast-glob': fastGlob.IApi;
    'sran.nvim': typeof Plugin;
    'request-promise': any;
};
export default _default;
