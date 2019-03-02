import cheerio from 'cheerio'
import fastGlob from 'fast-glob'
import findup from 'findup'
import log4js from 'log4js'
import msgpackLite from 'msgpack-lite'
import * as neovim from 'neovim'
import fetch from 'node-fetch'
import * as rxjs from 'rxjs'
import * as rxjsOperators from 'rxjs/operators'
import * as tslib from 'tslib'
import Plugin from '../attach/plugin'

export default {
  neovim,
  log4js,
  tslib,
  findup,
  rxjs,
  cheerio,
  'rxjs/operators': rxjsOperators,
  'msgpack-lite': msgpackLite,
  'fast-glob': fastGlob,
  'sran.nvim': Plugin,
  'node-fetch': fetch
}
