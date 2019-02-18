import attach from './attach'
import Plugin from './attach/plugin'
import Logger from './util/logger'

const logger = Logger('SRAN:index')

const address =
  process.env.NVIM_LISTEN_ADDRESS ||
  process.env.SRAN_NVIM_LISTEN_ADDRESS ||
  '/tmp/nvim'

const MSG_PREFIX = '[sran.vim]'

const plugin: Plugin = attach({
  socket: address
})

process.on('uncaughtException', err => {
  const msg = `${MSG_PREFIX} uncaught exception: ` + err.stack
  if (plugin.nvim) {
    plugin.nvim.call('sran#util#echo_messages', ['Error', msg.split('\n')])
  }
  logger.error('uncaughtException', err.stack)
})

process.on('unhandledRejection', (reason, p) => {
  if (plugin.nvim) {
    plugin.nvim.call('sran#util#echo_messages', [
      'Error',
      [`${MSG_PREFIX} UnhandledRejection`, `${reason}`]
    ])
  }
  logger.error('unhandledRejection ', p, reason)
})
