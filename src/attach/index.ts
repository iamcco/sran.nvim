import { attach, NeovimClient } from 'neovim'
import { Attach } from 'neovim/lib/attach/attach'
import getIP from '../util/getIP'
import Logger from '../util/logger'
import opener from '../util/opener'

const logger = Logger('SRAN:attach')

export interface IPlugin {
  util: {
    getIP: typeof getIP
    opener: typeof opener
  }
  nvim: NeovimClient
}

export default function(options: Attach): IPlugin {
  const nvim: NeovimClient = attach(options)

  nvim.on('notification', async (method: string, args: any[]) => {})

  nvim.on('request', (method: string, args: any, resp: any) => {})

  nvim.channelId
    .then(async channelId => {
      await nvim.setVar('sran_node_channel_id', channelId)
    })
    .catch(e => {
      logger.error('Get channelId error: ', e)
    })

  return {
    nvim,
    util: {
      getIP,
      opener
    }
  }
}
