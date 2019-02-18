import { NeovimClient } from 'neovim';
import getIP from '../util/getIP';
import getLogger from '../util/logger';
import opener from '../util/opener';
declare class Plugin {
    util: {
        getIP: typeof getIP;
        opener: typeof opener;
        getLogger: typeof getLogger;
    };
    nvim: NeovimClient;
    constructor(nvim: NeovimClient);
}
export default Plugin;
