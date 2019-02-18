"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fast_glob_1 = tslib_1.__importDefault(require("fast-glob"));
const path_1 = tslib_1.__importDefault(require("path"));
const logger_1 = tslib_1.__importDefault(require("../util/logger"));
const logger = logger_1.default('SRAN:sran');
function init(plugin) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        const { nvim } = plugin;
        const runtimepath = yield nvim.getOption('runtimepath');
        logger.info('runtimepath: ', runtimepath);
        const glob = runtimepath
            .split(',')
            .map(p => path_1.default.join(p, 'rplugin/sran/**'));
        const packages = yield fast_glob_1.default(glob, { onlyFiles: false, deep: 0 });
        logger.info('list sran packages: ', packages);
        packages.forEach(packagePath => {
            try {
                let m = require(packagePath);
                m = m.default || m;
                if (typeof m === 'function') {
                    m(plugin);
                }
                else {
                    logger.error(`Module Error: module must be export as a function < ${packagePath} >`);
                }
            }
            catch (e) {
                logger.error(`Load package Error: ${packagePath}\n`, e);
            }
        });
        nvim.channelId
            .then((channelId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield nvim.setVar('sran_node_channel_id', channelId);
            nvim.call('sran#rpc#server_ready');
        }))
            .catch(e => {
            logger.error('Get channelId error: ', e);
        });
    });
}
exports.default = init;
