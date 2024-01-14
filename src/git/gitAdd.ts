import { mustSucceedSpawnSync } from '../utils'

export interface GitAddOptions {
  paths: string[]
}

export function gitAdd(options: GitAddOptions) {
  mustSucceedSpawnSync('git', ['add', ...options.paths], {
    stdio: 'inherit',
  })
}
