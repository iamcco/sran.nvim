import fg from 'fast-glob'
import path from 'path'
import { IPlugin } from '../attach'
import getLogger from '../util/logger'

const logger = getLogger('SRAN:sran')

export default async function init(plugin: IPlugin) {
  const { nvim } = plugin
  const runtimepath = await nvim.getOption('runtimepath')
  logger.info('runtimepath: ', runtimepath)
  const glob = (runtimepath as string)
    .split(',')
    .map(p => path.join(p, 'rplugin/sran/**'))
  const packages: string[] = await fg(glob, { onlyFiles: false, deep: 0 })
  logger.info('list sran packages: ', packages)

  packages.forEach(packagePath => {
    try {
      const m = require(packagePath)
      if (typeof m === 'function') {
        m(plugin)
      } else {
        logger.error(
          `Module Error: module must be export as a function < ${packagePath} >`
        )
      }
    } catch (e) {
      logger.error(`Load package Error: ${packagePath}\n`, e)
    }
  })

  nvim.channelId
    .then(async channelId => {
      await nvim.setVar('sran_node_channel_id', channelId)
    })
    .catch(e => {
      logger.error('Get channelId error: ', e)
    })
}
