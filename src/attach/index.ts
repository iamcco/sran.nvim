import { attach, NeovimClient } from 'neovim'
import { Attach } from 'neovim/lib/attach/attach'
import sran from '../sran'
import Plugin from './plugin'

export default function(options: Attach): Plugin {
  const nvim: NeovimClient = attach(options)
  const plugin = new Plugin(nvim)

  sran(plugin)

  return plugin
}
