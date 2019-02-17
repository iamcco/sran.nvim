"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const fs_1 = tslib_1.__importDefault(require("fs"));
const module_1 = tslib_1.__importDefault(require("module"));
const path_1 = tslib_1.__importDefault(require("path"));
const vm_1 = tslib_1.__importDefault(require("vm"));
const logger_1 = tslib_1.__importDefault(require("../util/logger"));
const helpers_1 = require("./helpers");
const preloadmodules_1 = tslib_1.__importDefault(require("./preloadmodules"));
const logger = logger_1.default('SRAN:loader');
const { builtinModules = [] } = module_1.default;
function isFile(scriptPath) {
    return fs_1.default.existsSync(scriptPath) && fs_1.default.statSync(scriptPath).isFile();
}
function readFile(scriptPath) {
    if (isFile(`${scriptPath}.js`)) {
        return `${scriptPath}.js`;
    }
    if (isFile(path_1.default.join(scriptPath, 'index.js'))) {
        return path_1.default.join(scriptPath, 'index.js');
    }
    throw new Error(`Module not found: ${scriptPath}`);
}
function readPackage(scriptPath) {
    if (isFile(scriptPath)) {
        return scriptPath;
    }
    const packageJson = path_1.default.join(scriptPath, 'package.json');
    if (isFile(packageJson)) {
        const jsonStr = fs_1.default.readFileSync(packageJson, 'utf-8');
        try {
            const mainPath = path_1.default.join(scriptPath, JSON.parse(jsonStr).main);
            if (isFile(mainPath)) {
                return mainPath;
            }
        }
        catch (e) {
            throw new Error(`JSON parse Error: ${packageJson}`);
        }
    }
    return readFile(scriptPath);
}
function loader(modulePath) {
    logger.info(`module path: ${modulePath}`);
    const scriptPath = readPackage(modulePath);
    if (scriptPath === '') {
        throw new Error(`Module not found: ${modulePath}`);
    }
    logger.info(`load module: ${scriptPath}`);
    const userModule = new module_1.default(scriptPath);
    userModule.filename = scriptPath;
    userModule.paths = module_1.default._nodeModulePaths(path_1.default.dirname(scriptPath));
    const codeStr = helpers_1.stripCode(fs_1.default.readFileSync(userModule.filename, 'utf-8'));
    userModule.require = userModule.require.bind(userModule);
    const sanbox = vm_1.default.createContext(Object.assign({}, global, { exports: userModule.exports, module: userModule, require: (name) => {
            // name is buildin module
            if (builtinModules.indexOf(name) !== -1) {
                return userModule.require(name);
            }
            try {
                const subModulePath = path_1.default.join(path_1.default.dirname(scriptPath), name);
                return loader(subModulePath);
            }
            catch (e) {
                // name is pre loadmodule
                if (preloadmodules_1.default[name]) {
                    return preloadmodules_1.default[name];
                }
                else {
                    throw e;
                }
            }
        }, __filename: userModule.filename, __dirname: path_1.default.dirname(scriptPath) }));
    vm_1.default.runInContext(codeStr, sanbox, { filename: userModule.filename });
    return userModule.exports;
}
exports.default = loader;
