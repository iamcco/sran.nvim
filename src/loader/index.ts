import fs from 'fs'
import Module from 'module'
import path from 'path'
import vm from 'vm'

import Logger from '../util/logger'
import { stripCode } from './helpers'
import modules from './preloadmodules'

const logger = Logger('SRAN:loader')

const { builtinModules = [] }: { builtinModules: string[] } = Module

function isFile(scriptPath: string): boolean {
  return fs.existsSync(scriptPath) && fs.statSync(scriptPath).isFile()
}

function readFile(scriptPath: string): string {
  if (isFile(path.join(scriptPath, 'js'))) {
    return path.join(scriptPath, 'js')
  }
  if (isFile(path.join(scriptPath, 'index.js'))) {
    return path.join(scriptPath, 'index.js')
  }
  throw new Error(`Module not found: ${scriptPath}`)
}

function readPackage(scriptPath: string): string {
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
      try {
        const subModulePath = path.join(path.dirname(scriptPath), name)
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

  vm.runInContext(codeStr, sanbox, { filename: userModule.filename })

  return userModule.exports
}
