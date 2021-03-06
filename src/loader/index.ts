import fs from 'fs'
import Module from 'module'
import path from 'path'
import vm from 'vm'

import Logger from '../util/logger'
import { stripCode } from './helpers'
import modules from './preloadmodules'

const logger = Logger('SRAN:loader')

const { builtinModules = [] }: { builtinModules: string[] } = Module

const cacheModules = {}

function isFile(scriptPath: string): boolean {
  return fs.existsSync(scriptPath) && fs.statSync(scriptPath).isFile()
}

function readFile(scriptPath: string): string {
  if (isFile(`${scriptPath}.js`)) {
    return `${scriptPath}.js`
  }
  if (isFile(path.join(scriptPath, 'index.js'))) {
    return path.join(scriptPath, 'index.js')
  }
  throw new Error(`Module not found: ${scriptPath}`)
}

function readPackage(scriptPath: string): string {
  if (isFile(scriptPath)) {
    return scriptPath
  }
  const packageJson = path.join(scriptPath, 'package.json')
  if (isFile(packageJson)) {
    const jsonStr = fs.readFileSync(packageJson, 'utf-8')
    try {
      const mainPath = path.join(scriptPath, JSON.parse(jsonStr).main)
      if (isFile(mainPath)) {
        return mainPath
      }
    } catch (e) {
      throw new Error(`JSON parse Error: ${packageJson}`)
    }
  }
  return readFile(scriptPath)
}

export default function loader(modulePath: string) {
  logger.info(`module path: ${modulePath}`)
  const scriptPath = readPackage(modulePath)
  if (cacheModules[scriptPath]) {
    logger.info(`use cache: ${modulePath}`)
    return cacheModules[scriptPath].exports
  }
  if (scriptPath === '') {
    throw new Error(`Module not found: ${modulePath}`)
  }
  logger.info(`load module: ${scriptPath}`)
  const userModule = new Module(scriptPath)
  userModule.filename = scriptPath
  userModule.paths = (Module as any)._nodeModulePaths(path.dirname(scriptPath))

  const codeStr = stripCode(fs.readFileSync(userModule.filename, 'utf-8'))

  userModule.require = userModule.require.bind(userModule)

  const sanbox = vm.createContext({
    ...global,
    exports: userModule.exports,
    module: userModule,
    require: (name: string) => {
      // name is buildin module
      if (builtinModules.indexOf(name) !== -1) {
        return userModule.require(name)
      }
      // load module from node_modules
      if (
        !(
          path.isAbsolute(name) ||
          name.startsWith('./') ||
          name.startsWith('../')
        )
      ) {
        try {
          const m = userModule.require(name)
          return m
        } catch (e) {
          logger.info(`Module ${name}: not exists in node_modules`, e)
        }
      }
      try {
        const subModulePath = path.isAbsolute(name)
          ? name
          : path.join(path.dirname(scriptPath), name)
        return loader(subModulePath)
      } catch (e) {
        // name is pre loadmodule
        if (modules[name]) {
          return modules[name]
        } else {
          throw e
        }
      }
    },
    __filename: userModule.filename,
    __dirname: path.dirname(scriptPath)
  })

  // cache module
  cacheModules[scriptPath] = userModule

  vm.runInContext(codeStr, sanbox, { filename: userModule.filename })

  return userModule.exports
}
