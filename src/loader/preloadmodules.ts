import fastGlob from 'fast-glob'
import log4js from 'log4js'
import msgpackLite from 'msgpack-lite'
import * as neovim from 'neovim'
import * as tslib from 'tslib'
import Plugin from '../attach/plugin'

export default {
  neovim,
  log4js,
  tslib,
  'msgpack-lite': msgpackLite,
  'fast-glob': fastGlob,
  'sran.nvim': Plugin
}
