"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const attach_1 = tslib_1.__importDefault(require("./attach"));
const logger_1 = tslib_1.__importDefault(require("./util/logger"));
const logger = logger_1.default('SRAN:index');
const address = process.env.NVIM_LISTEN_ADDRESS ||
    process.env.SRAN_NVIM_LISTEN_ADDRESS ||
    '/tmp/nvim';
const MSG_PREFIX = '[sran.vim]';
const plugin = attach_1.default({
    socket: address
});
process.on('uncaughtException', err => {
    const msg = `${MSG_PREFIX} uncaught exception: ` + err.stack;
    if (plugin.nvim) {
        plugin.nvim.call('sran#util#echo_messages', ['Error', msg.split('\n')]);
    }
    logger.error('uncaughtException', err.stack);
});
process.on('unhandledRejection', (reason, p) => {
    if (plugin.nvim) {
        plugin.nvim.call('sran#util#echo_messages', [
            'Error',
            [`${MSG_PREFIX} UnhandledRejection`, `${reason}`]
        ]);
    }
    logger.error('unhandledRejection ', p, reason);
});
