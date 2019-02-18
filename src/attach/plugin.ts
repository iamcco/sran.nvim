import { NeovimClient } from 'neovim'
import getIP from '../util/getIP'
import getLogger from '../util/logger'
import opener from '../util/opener'

class Plugin {
  public util: {
    getIP: typeof getIP
    opener: typeof opener
    getLogger: typeof getLogger
  } = {
    getIP,
    opener,
    getLogger
  }
  public nvim: NeovimClient
  constructor(nvim: NeovimClient) {
    this.nvim = nvim
  }
}

export default Plugin
