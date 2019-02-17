import { NeovimClient } from 'neovim';
import { Attach } from 'neovim/lib/attach/attach';
import getIP from '../util/getIP';
import opener from '../util/opener';
export interface IPlugin {
    util: {
        getIP: typeof getIP;
        opener: typeof opener;
    };
    nvim: NeovimClient;
}
export default function (options: Attach): IPlugin;
