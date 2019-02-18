import { attach, NeovimClient } from 'neovim'
import { Attach } from 'neovim/lib/attach/attach'
import sran from '../sran'
import getIP from '../util/getIP'
import getLogger from '../util/logger'
import opener from '../util/opener'

const util = {
  getIP,
  opener,
  getLogger
}

export interface IPlugin {
  util: {
    getIP: typeof getIP
    opener: typeof opener
    getLogger: typeof getLogger
  }
  nvim: NeovimClient
}

export default function(options: Attach): IPlugin {
  const nvim: NeovimClient = attach(options)
  const plugin = {
    nvim,
    util
  }

  sran(plugin)

  return plugin
}
