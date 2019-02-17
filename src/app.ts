import packageInfo from '../package.json'
import loader from './loader'

// change cwd to ./app
if (!/^(\/|C:\\)snapshot/.test(__dirname)) {
  process.chdir(__dirname)
} else {
  process.chdir(process.execPath.replace(/(sran.nvim).+?$/, '$1'))
}

const PATH = '--path'
const VERSION = '--version'

const { argv = [] }: { argv: string[] } = process

const param = argv[2]

if (param === PATH) {
  loader(argv[3])
} else if (param === VERSION) {
  // tslint:disable-next-line
  console.log(packageInfo.version)
}
