"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const loader_1 = tslib_1.__importDefault(require("./loader"));
// change cwd to ./app
if (!/^(\/|C:\\)snapshot/.test(__dirname)) {
    process.chdir(__dirname);
}
else {
    process.chdir(process.execPath.replace(/(sran.nvim).+?$/, '$1'));
}
const PATH = '--path';
const VERSION = '--version';
const { argv = [] } = process;
const param = argv[2];
if (param === PATH) {
    loader_1.default(argv[3]);
}
else if (param === VERSION) {
    // tslint:disable-next-line
    console.log('0.0.3');
}
