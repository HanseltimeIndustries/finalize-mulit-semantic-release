import { mustSucceedSpawnSync } from '../utils'

interface Options {
  tag: string
  message: string
}

export function gitTag(options: Options) {
  mustSucceedSpawnSync('git', ['tag', '-m', options.message, options.tag], {
    stdio: 'inherit',
  })
}
