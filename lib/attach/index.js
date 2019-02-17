"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const neovim_1 = require("neovim");
const getIP_1 = tslib_1.__importDefault(require("../util/getIP"));
const logger_1 = tslib_1.__importDefault(require("../util/logger"));
const opener_1 = tslib_1.__importDefault(require("../util/opener"));
const logger = logger_1.default('SRAN:attach');
function default_1(options) {
    const nvim = neovim_1.attach(options);
    nvim.on('notification', (method, args) => tslib_1.__awaiter(this, void 0, void 0, function* () { }));
    nvim.on('request', (method, args, resp) => { });
    nvim.channelId
        .then((channelId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
        yield nvim.setVar('sran_node_channel_id', channelId);
    }))
        .catch(e => {
        logger.error('Get channelId error: ', e);
    });
    return {
        nvim,
        util: {
            getIP: getIP_1.default,
            opener: opener_1.default
        }
    };
}
exports.default = default_1;
